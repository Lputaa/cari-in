"use client";

import { MessageCircle, MapPin, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AnonymousBadge from "@/components/ui/AnonymousBadge";
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
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:-translate-y-0.5 transition-transform duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <AnonymousBadge anonymousId={post.users?.anonymous_id ?? "???"} />
        <Badge variant={post.status === "OPEN" ? "open" : "resolved"}>
          {post.status}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Badge>{post.type === "lost" ? "🔴 Lost" : "🟢 Found"}</Badge>
        <Badge>{post.category}</Badge>
      </div>

      <h3 className="font-bold text-h3 mb-1">{post.title}</h3>
      <p className="text-body text-neutral-black/70 mb-3 line-clamp-2">
        {post.description}
      </p>

      {post.images.length > 0 && (
        <div className="relative w-full h-48 bg-neutral-gray rounded-[var(--radius-badge)] border-2 border-neutral-black mb-3 overflow-hidden">
          <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
          {post.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-neutral-black/60 text-neutral-white px-2 py-0.5 rounded text-caption font-bold">
              +{post.images.length - 1}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-caption text-neutral-black/50">
        <div className="flex items-center gap-1">
          <MapPin size={14} strokeWidth={2.5} />
          <span>{post.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MessageCircle size={14} strokeWidth={2.5} />
            {post.comment_count}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} strokeWidth={2.5} />
            {timeAgo(post.created_at)}
          </span>
        </div>
      </div>
    </Card>
  );
}
