"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImagePreviewModalProps {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImagePreviewModal({ images, index, onClose, onNavigate }: ImagePreviewModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1) onNavigate(index + 1);
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [index, images.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white cursor-pointer transition-colors"
        aria-label="Tutup"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-neutral-white/10 text-neutral-white text-caption font-bold">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(index - 1); }}
          className="absolute left-4 z-10 p-2 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white cursor-pointer transition-colors"
          aria-label="Sebelumnya"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* Next */}
      {index < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(index + 1); }}
          className="absolute right-4 z-10 p-2 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white cursor-pointer transition-colors"
          aria-label="Selanjutnya"
        >
          <ChevronRight size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* Image */}
      <img
        src={images[index]}
        alt={`Foto ${index + 1}`}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-[var(--radius-brutal)]"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
              className={`w-2.5 h-2.5 rounded-full border-2 border-neutral-white cursor-pointer transition-all ${
                i === index ? "bg-neutral-white scale-125" : "bg-neutral-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
