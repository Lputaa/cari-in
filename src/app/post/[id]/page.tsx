"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock, Send, Trash2, CheckCircle, Pencil, ImagePlus, X, Flag } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { getPostById, getCommentsByPostId, createComment, deleteComment, updatePost, deletePost } from "@/lib/db";
import { getUserById } from "@/lib/db";
import { deleteImage, uploadMultipleImages } from "@/lib/storage";
import { createNotificationForPostOwner } from "@/lib/notifications";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AnonymousBadge from "@/components/ui/AnonymousBadge";
import Skeleton from "@/components/ui/Skeleton";
import ErrorState from "@/components/ui/ErrorState";
import EditPostModal from "@/components/EditPostModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ReportModal from "@/components/ReportModal";
import { showToast } from "@/components/ui/Toast";
import type { Post, Comment } from "@/types";

function timeAgo(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentImages, setCommentImages] = useState<File[]>([]);
  const [commentPreviews, setCommentPreviews] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: "post" | "comment"; id: string } | null>(null);

  useEffect(() => {
    loadPost();
  }, [id]);

  async function loadPost() {
    try {
      setError(false);
      const [postData, commentData] = await Promise.all([
        getPostById(id),
        getCommentsByPostId(id),
      ]);
      setPost(postData);
      setComments(commentData);

      const userIds = new Set([postData.user_id, ...commentData.map((c) => c.user_id)]);
      const map: Record<string, string> = {};
      await Promise.all(
        Array.from(userIds).map(async (uid) => {
          try {
            const u = await getUserById(uid);
            map[uid] = u.anonymous_id;
          } catch {}
        })
      );
      setUserMap(map);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleCommentImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newFiles = [...commentImages, ...files].slice(0, 3);
    setCommentImages(newFiles);
    setCommentPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  }

  function removeCommentImage(index: number) {
    const filtered = commentImages.filter((_, i) => i !== index);
    setCommentImages(filtered);
    setCommentPreviews(filtered.map((f) => URL.createObjectURL(f)));
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setSending(true);
    try {
      let imageUrls: string[] = [];
      if (commentImages.length > 0) {
        imageUrls = await uploadMultipleImages(commentImages, user.id);
      }
      await createComment(id, user.id, commentText.trim(), imageUrls);
      setCommentText("");
      setCommentImages([]);
      setCommentPreviews([]);
      // Notify post owner
      await createNotificationForPostOwner(id, user.id, "comment");
      showToast("Komentar terkirim!", "success");
      await loadPost();
    } catch (err) {
      console.error(err);
      showToast("Gagal mengirim komentar", "error");
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await deleteComment(commentId);
      showToast("Komentar dihapus", "success");
      await loadPost();
    } catch (err) {
      showToast("Gagal menghapus komentar", "error");
    }
  }

  async function handleToggleStatus() {
    if (!post || !user || user.id !== post.user_id) return;
    const newStatus = post.status === "OPEN" ? "RESOLVED" : "OPEN";
    try {
      await updatePost(post.id, { status: newStatus });
      setPost({ ...post, status: newStatus });
      showToast(`Status diubah ke ${newStatus}`, "success");
    } catch (err) {
      showToast("Gagal mengubah status", "error");
    }
  }

  async function handleDelete() {
    if (!post) return;
    setDeleting(true);
    try {
      // Delete images from storage
      if (post.images.length > 0) {
        await Promise.all(
          post.images.map((url) => {
            const path = url.split("/post-images/")[1];
            return path ? deleteImage(path) : Promise.resolve();
          })
        );
      }
      await deletePost(post.id);
      showToast("Postingan dihapus", "success");
      router.push("/");
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus postingan", "error");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-gray">
        <Navbar />
        <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-gray">
        <Navbar />
        <ErrorState
          title="Gagal memuat postingan"
          description="Terjadi kesalahan saat memuat data."
          onRetry={() => { setLoading(true); loadPost(); }}
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-gray">
        <Navbar />
        <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-16 text-center">
          <h2 className="text-h2 font-bold mb-2">Postingan tidak ditemukan</h2>
          <Button variant="primary" onClick={() => router.push("/")}>Kembali ke Feed</Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === post.user_id;

  return (
    <div className="min-h-screen bg-neutral-gray">
      <Navbar />

      <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-4">
        {/* Back button */}
        <button onClick={() => router.back()} className="flex items-center gap-1 mb-4 cursor-pointer font-bold text-sm">
          <ArrowLeft size={18} strokeWidth={2.5} />
          Kembali
        </button>

        {/* Post */}
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <AnonymousBadge anonymousId={userMap[post.user_id] ?? "???"} />
            <div className="flex items-center gap-2">
              <Badge>{post.type === "lost" ? "🔴 Lost" : "🟢 Found"}</Badge>
              <Badge variant={post.status === "OPEN" ? "open" : "resolved"}>{post.status}</Badge>
            </div>
          </div>

          <Badge className="mb-2">{post.category}</Badge>

          <h1 className="text-h2 font-bold mb-2">{post.title}</h1>
          <p className="text-body text-neutral-black/70 mb-4 whitespace-pre-wrap">{post.description}</p>

          {/* Images */}
          {post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {post.images.map((url, i) => (
                <div key={i} className="rounded-[var(--radius-badge)] border-2 border-neutral-black overflow-hidden">
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-caption text-neutral-black/50 pt-3 border-t-2 border-neutral-black/10">
            <div className="flex items-center gap-1">
              <MapPin size={14} strokeWidth={2.5} />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} strokeWidth={2.5} />
              <span>{timeAgo(post.created_at)}</span>
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="mt-4 pt-3 border-t-2 border-neutral-black/10 space-y-2">
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => setShowEditModal(true)}>
                  <Pencil size={18} strokeWidth={2.5} className="mr-1" />
                  Edit
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => setShowDeleteModal(true)}>
                  <Trash2 size={18} strokeWidth={2.5} className="mr-1" />
                  Hapus
                </Button>
              </div>
              <Button
                variant={post.status === "OPEN" ? "primary" : "secondary"}
                className="w-full"
                onClick={handleToggleStatus}
              >
                <CheckCircle size={18} strokeWidth={2.5} className="mr-1" />
                {post.status === "OPEN" ? "Tandai RESOLVED" : "Buka Kembali (OPEN)"}
              </Button>
            </div>
          )}
        </Card>

        {/* Comments */}
        <h3 className="text-h3 font-bold mb-3">Komentar ({comments.length})</h3>

        {/* Comment input */}
        {user ? (
          <form onSubmit={handleComment} className="mb-4">
            {/* Image previews */}
            {commentPreviews.length > 0 && (
              <div className="flex gap-2 mb-2">
                {commentPreviews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-[var(--radius-badge)] border-2 border-neutral-black overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeCommentImage(i)} className="absolute top-0 right-0 bg-danger text-neutral-white p-0.5 cursor-pointer">
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tulis komentar..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-neutral-white text-base outline-none focus:ring-2 focus:ring-primary"
              />
              <label className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-neutral-gray cursor-pointer hover:bg-primary/20 transition-colors">
                <ImagePlus size={18} strokeWidth={2.5} />
                <input type="file" accept="image/*" className="hidden" onChange={handleCommentImageSelect} />
              </label>
              <Button type="submit" variant="primary" className="!px-4" disabled={sending || !commentText.trim()}>
                <Send size={18} strokeWidth={2.5} />
              </Button>
            </div>
          </form>
        ) : (
          <Card className="p-4 mb-4 text-center text-neutral-black/50">
            Login untuk berkomentar
          </Card>
        )}

        {/* Comment list */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <Card className="p-6 text-center text-neutral-black/50">
              Belum ada komentar. Jadilah yang pertama!
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <AnonymousBadge anonymousId={userMap[comment.user_id] ?? "???"} />
                  <div className="flex items-center gap-2">
                    <span className="text-caption text-neutral-black/50">{timeAgo(comment.created_at)}</span>
                    {user?.id === comment.user_id && (
                      <button onClick={() => handleDeleteComment(comment.id)} className="text-danger cursor-pointer" aria-label="Hapus">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    )}
                    {user && user.id !== comment.user_id && (
                      <button onClick={() => setReportTarget({ type: "comment", id: comment.id })} className="text-neutral-black/40 hover:text-danger cursor-pointer" aria-label="Laporkan">
                        <Flag size={16} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-body whitespace-pre-wrap">{comment.message}</p>
                {comment.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {comment.images.map((url, i) => (
                      <img key={i} src={url} alt="" className="w-16 h-16 rounded-[var(--radius-badge)] border-2 border-neutral-black object-cover" />
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showEditModal && post && (
        <EditPostModal
          isOpen={showEditModal}
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            loadPost();
          }}
        />
      )}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={post?.title}
        loading={deleting}
      />
      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
        />
      )}
    </div>
  );
}
