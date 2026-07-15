"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, CheckCircle, Bell, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getPostById } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import type { Notification, Post } from "@/types";

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

const typeLabels: Record<string, { icon: string; text: string }> = {
  comment: { icon: "💬", text: "ada komentar baru di postinganmu" },
  status_change: { icon: "✅", text: "status postingan berubah" },
};

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [postTitles, setPostTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }
    if (user) loadNotifications();
  }, [user, authLoading]);

  async function loadNotifications() {
    if (!user) return;
    setLoading(true);
    setError(false);
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);

      const postIds = [...new Set(data.map((n) => n.post_id))];
      const titles: Record<string, string> = {};
      await Promise.all(
        postIds.map(async (pid) => {
          try {
            const post = await getPostById(pid);
            titles[pid] = post.title;
          } catch {
            titles[pid] = "Postingan tidak ditemukan";
          }
        })
      );
      setPostTitles(titles);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleClick(notification: Notification) {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
    }
    router.push(`/post/${notification.post_id}`);
  }

  async function handleMarkAllRead() {
    if (!user) return;
    await markAllNotificationsAsRead(user.id);
    await loadNotifications();
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-gray">
        <Navbar />
        <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-gray">
        <Navbar />
        <ErrorState
          title="Gagal memuat notifikasi"
          description="Terjadi kesalahan saat memuat data."
          onRetry={loadNotifications}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-gray">
      <Navbar />

      <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="cursor-pointer">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-h2 font-bold">Notifikasi</h1>
            {unreadCount > 0 && (
              <Badge variant="open">{unreadCount} baru</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" className="!px-3 !py-1.5 text-sm" onClick={handleMarkAllRead}>
              Tandai semua dibaca
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            title="Belum ada notifikasi"
            description="Notifikasi akan muncul saat ada aktivitas di postinganmu."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const label = typeLabels[notif.type] ?? { icon: "🔔", text: "aktivitas baru" };
              return (
                <Card
                  key={notif.id}
                  className={`p-4 cursor-pointer hover:-translate-y-0.5 transition-transform duration-200 ${
                    !notif.is_read ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleClick(notif)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{label.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-body">
                        <span className="font-bold">{postTitles[notif.post_id] ?? "..."}</span>
                        {" — "}
                        {label.text}
                      </p>
                      <span className="text-caption text-neutral-black/50">{timeAgo(notif.created_at)}</span>
                    </div>
                    {!notif.is_read && (
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
