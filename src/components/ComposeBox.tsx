"use client";

import { ImagePlus, MapPin, Tag } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import AnonymousBadge from "@/components/ui/AnonymousBadge";

interface ComposeBoxProps {
  onClick: () => void;
}

export default function ComposeBox({ onClick }: ComposeBoxProps) {
  const { user, anonymousId, signInWithGoogle } = useAuth();

  if (!user) {
    return (
      <div
        className="bg-neutral-white rounded-[var(--radius-brutal)] border-2 border-neutral-black shadow-[var(--shadow-brutal-sm)] p-4 cursor-pointer hover:shadow-[var(--shadow-brutal)] hover:-translate-y-0.5 transition-all duration-150 text-center"
        onClick={signInWithGoogle}
      >
        <p className="text-h3 font-bold text-neutral-black/30">
          Masuk untuk membuat postingan
        </p>
        <p className="text-caption text-neutral-black/20 mt-1">
          Kehilangan atau menemukan sesuatu di kampus?
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-neutral-white rounded-[var(--radius-brutal)] border-2 border-neutral-black shadow-[var(--shadow-brutal-sm)] p-4 cursor-pointer hover:shadow-[var(--shadow-brutal)] hover:-translate-y-0.5 transition-all duration-150"
      onClick={onClick}
    >
      {/* User row */}
      <div className="flex items-center gap-3 mb-3">
        <AnonymousBadge anonymousId={anonymousId ?? "???"} />
      </div>

      {/* Placeholder text */}
      <p className="text-h3 font-bold text-neutral-black/20 mb-4">
        Kehilangan atau menemukan sesuatu?
      </p>

      {/* Action hints */}
      <div className="flex items-center gap-3 pt-3 border-t-2 border-neutral-black/5">
        <span className="flex items-center gap-1.5 text-caption text-neutral-black/30 font-medium">
          <ImagePlus size={16} strokeWidth={2.5} />
          Foto
        </span>
        <span className="flex items-center gap-1.5 text-caption text-neutral-black/30 font-medium">
          <Tag size={16} strokeWidth={2.5} />
          Kategori
        </span>
        <span className="flex items-center gap-1.5 text-caption text-neutral-black/30 font-medium">
          <MapPin size={16} strokeWidth={2.5} />
          Lokasi
        </span>
      </div>
    </div>
  );
}
