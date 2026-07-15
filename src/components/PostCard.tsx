"use client";

import { useState } from "react";
import { MessageCircle, MapPin, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AnonymousBadge from "@/components/ui/AnonymousBadge";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import type { Post } from "@/types";

interface PostWithUser extends Post {
  users?: { anonymous_id: string };
}

interface PostCardProps {
  post: PostWithUser;
  onClick?: () => void;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j`;
  const days = Math.floor(hours / 24);
  return `${days}h`;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const isLost = post.type === "lost";
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  return (
    <Card hoverable className="p-4" onClick={onClick}>
      {/* Image preview modal */}
      {previewIndex !== null && post.images.length > 0 && (
        <ImagePreviewModal
          images={post.images}
          index={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onNavigate={setPreviewIndex}
        />
      )}
      {/* Header: badge + status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-2 border-neutral-black text-label font-bold ${
            isLost ? "bg-danger text-neutral-white" : "bg-primary text-neutral-black"
          }`}>
            {isLost ? "LOST" : "FOUND"}
          </span>
          <span className="text-caption text-neutral-black/40">{post.category}</span>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border-2 border-neutral-black text-label font-bold ${
          post.status === "OPEN" ? "bg-status-open text-neutral-black" : "bg-status-resolved text-neutral-black"
        }`}>
          {post.status}
        </span>
      </div>

      {/* Title — bold, prominent */}
      <h3 className="text-h3 font-bold mb-1.5 leading-tight">{post.title}</h3>

      {/* Description — truncated */}
      <p className="text-body text-neutral-black/60 mb-3 line-clamp-2">
        {post.description}
      </p>

      {/* Image — klik untuk preview */}
      {post.images.length > 0 && (
        <div
          className="relative w-full h-44 rounded-[var(--radius-badge)] border-2 border-neutral-black overflow-hidden mb-3 bg-neutral-gray cursor-pointer"
          onClick={(e) => { e.stopPropagation(); setPreviewIndex(0); }}
        >
          <ImageWithFallback
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover"
            fallbackClassName="w-full h-44"
          />
          {post.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-neutral-black/70 text-neutral-white px-2 py-0.5 rounded-full text-label font-bold backdrop-blur-sm">
              +{post.images.length - 1}
            </div>
          )}
        </div>
      )}

      {/* Footer: user + location + time + comments */}
      <div className="flex items-center justify-between pt-2 border-t-2 border-neutral-black/5">
        <div className="flex items-center gap-2">
          <AnonymousBadge anonymousId={post.users?.anonymous_id ?? "???"} />
        </div>
        <div className="flex items-center gap-3 text-caption text-neutral-black/40">
          <span className="flex items-center gap-1">
            <MapPin size={13} strokeWidth={2.5} />
            {post.location}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={13} strokeWidth={2.5} />
            {post.comment_count}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} strokeWidth={2.5} />
            {timeAgo(post.created_at)}
          </span>
        </div>
      </div>
    </Card>
  );
}
