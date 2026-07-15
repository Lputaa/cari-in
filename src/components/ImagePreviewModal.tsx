"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ImageIcon } from "lucide-react";

interface ImagePreviewModalProps {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImagePreviewModal({ images, index, onClose, onNavigate }: ImagePreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [visible, setVisible] = useState(false);
  const justOpened = useRef(true);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Ref to avoid stale closure on onClose
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Animate in + guard against immediate close from the originating click
  useEffect(() => {
    justOpened.current = true;
    const raf = requestAnimationFrame(() => setVisible(true));
    const guard = setTimeout(() => { justOpened.current = false; }, 350);
    return () => { cancelAnimationFrame(raf); clearTimeout(guard); };
  }, []);

  // Reset states when image changes
  useEffect(() => {
    setLoading(true);
    setError(false);
    setZoom(1);
  }, [index]);

  // Close with animation
  function handleClose() {
    if (justOpened.current) return;
    setVisible(false);
    setTimeout(() => onCloseRef.current(), 200);
  }

  // Keyboard + lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1) onNavigate(index + 1);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 0.5));
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [index, images.length, onNavigate]);

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0 && index < images.length - 1) onNavigate(index + 1);
      if (dx > 0 && index > 0) onNavigate(index - 1);
    }
  }

  // Scroll zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => {
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      return Math.min(Math.max(z + delta, 0.5), 3);
    });
  }

  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  const modal = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-neutral-black/90 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClose}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white cursor-pointer transition-colors"
        aria-label="Tutup"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-neutral-white/10 text-neutral-white text-caption font-bold">
        {index + 1} / {images.length}
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z - 0.25, 0.5)); }}
          className="p-2 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white cursor-pointer transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut size={18} strokeWidth={2.5} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z + 0.25, 3)); }}
          className="p-2 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white cursor-pointer transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn size={18} strokeWidth={2.5} />
        </button>
        {zoom !== 1 && (
          <span className="flex items-center px-2 text-neutral-white/70 text-caption font-bold">
            {Math.round(zoom * 100)}%
          </span>
        )}
      </div>

      {/* Prev */}
      {canPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(index - 1); }}
          className="absolute left-4 z-10 p-2 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white cursor-pointer transition-colors max-sm:left-2"
          aria-label="Sebelumnya"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* Next */}
      {canNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(index + 1); }}
          className="absolute right-4 z-10 p-2 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white cursor-pointer transition-colors max-sm:right-2"
          aria-label="Selanjutnya"
        >
          <ChevronRight size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* Image container */}
      <div
        className={`relative transition-transform duration-200 ${visible ? "scale-100" : "scale-90"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading spinner */}
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-neutral-white/20 border-t-neutral-white rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center gap-3 w-[80vw] h-[60vh] max-w-[600px]">
            <ImageIcon size={48} strokeWidth={1.5} className="text-neutral-white/30" />
            <p className="text-neutral-white/50 text-caption font-bold">Gagal memuat gambar</p>
            <button
              onClick={(e) => { e.stopPropagation(); setError(false); setLoading(true); }}
              className="px-4 py-1.5 rounded-full bg-neutral-white/10 hover:bg-neutral-white/20 text-neutral-white text-caption font-bold cursor-pointer transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Actual image */}
        {!error && (
          <img
            key={images[index]}
            src={images[index]}
            alt={`Foto ${index + 1}`}
            style={{ transform: `scale(${zoom})` }}
            className={`max-w-[90vw] max-h-[85vh] object-contain rounded-[var(--radius-brutal)] transition-all duration-200 ${
              loading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
      </div>

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

  // Render via portal to avoid click event bubbling through parent DOM tree
  if (typeof window === "undefined") return null;
  return createPortal(modal, document.body);
}
