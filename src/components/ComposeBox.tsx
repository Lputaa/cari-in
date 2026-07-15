"use client";

import { useState } from "react";
import { ImagePlus, X, MapPin, Tag } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { createPost } from "@/lib/db";
import { uploadMultipleImages } from "@/lib/storage";
import { showToast } from "@/components/ui/Toast";
import SwipeableToggle from "@/components/SwipeableToggle";
import AnonymousBadge from "@/components/ui/AnonymousBadge";
import { CATEGORIES, LOCATIONS, type PostType, type Category, type Location } from "@/types";

const TYPE_OPTIONS = [
  { label: "LOST", value: "lost", icon: "🔴", color: "bg-danger" },
  { label: "FOUND", value: "found", icon: "🟢", color: "bg-primary" },
];

interface ComposeBoxProps {
  onSuccess: () => void;
}

export default function ComposeBox({ onSuccess }: ComposeBoxProps) {
  const { user, anonymousId, signInWithGoogle } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [type, setType] = useState<PostType>("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [location, setLocation] = useState<Location | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newFiles = [...images, ...files].slice(0, 3);
    setImages(newFiles);
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  }

  function removeImage(index: number) {
    const filtered = images.filter((_, i) => i !== index);
    setImages(filtered);
    setPreviews(filtered.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit() {
    if (!user || !title.trim()) return;
    setSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadMultipleImages(images, user.id);
      }
      await createPost({
        userId: user.id,
        type,
        title: title.trim(),
        description: description.trim() || title.trim(),
        category: (category || "Lainnya") as Category,
        location: (location || "Kantin") as Location,
        images: imageUrls,
      });
      showToast("Postingan berhasil dibuat!", "success");
      resetForm();
      onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Gagal membuat postingan", "error");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setExpanded(false);
    setType("lost");
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setImages([]);
    setPreviews([]);
    setShowCategoryPicker(false);
    setShowLocationPicker(false);
  }

  const isLost = type === "lost";

  // ─── Not logged in ───
  if (!user) {
    return (
      <div
        className="bg-neutral-white rounded-[var(--radius-brutal)] border-2 border-neutral-black shadow-[var(--shadow-brutal-sm)] p-4 cursor-pointer hover:shadow-[var(--shadow-brutal)] hover:-translate-y-0.5 transition-all duration-150 text-center"
        onClick={signInWithGoogle}
      >
        <p className="text-h3 font-bold text-neutral-black/25">
          Masuk untuk membuat postingan
        </p>
      </div>
    );
  }

  // ─── Collapsed ───
  if (!expanded) {
    return (
      <div
        className="bg-neutral-white rounded-[var(--radius-brutal)] border-2 border-neutral-black shadow-[var(--shadow-brutal-sm)] p-4 cursor-pointer hover:shadow-[var(--shadow-brutal)] hover:-translate-y-0.5 transition-all duration-150"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center gap-3 mb-2">
          <AnonymousBadge anonymousId={anonymousId ?? "???"} />
        </div>
        <p className="text-h3 font-bold text-neutral-black/20">
          Kehilangan atau menemukan sesuatu?
        </p>
      </div>
    );
  }

  // ─── Expanded ───
  return (
    <div className="bg-neutral-white rounded-[var(--radius-brutal)] border-2 border-neutral-black shadow-[var(--shadow-brutal)] p-4 mb-2">
      {/* Header: user + swipe toggle */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <AnonymousBadge anonymousId={anonymousId ?? "???"} />
        <SwipeableToggle
          options={TYPE_OPTIONS}
          value={type}
          onChange={(v) => setType(v as PostType)}
        />
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder={isLost ? "Apa yang hilang?" : "Apa yang ditemukan?"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        autoFocus
        className="w-full py-2 text-h3 font-bold bg-transparent border-none outline-none placeholder:text-neutral-black/20"
      />

      {/* Description */}
      <textarea
        placeholder="Ceritakan detailnya..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full py-1 text-body bg-transparent border-none outline-none resize-none placeholder:text-neutral-black/15"
      />

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-2">
          {previews.map((src, i) => (
            <div key={i} className="relative w-20 h-20 flex-shrink-0 rounded-[var(--radius-badge)] border-2 border-neutral-black overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-neutral-black/60 text-neutral-white rounded-full flex items-center justify-center cursor-pointer"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {category ? (
          <button
            type="button"
            onClick={() => setShowCategoryPicker(!showCategoryPicker)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-neutral-black bg-secondary text-label font-bold cursor-pointer"
          >
            <Tag size={12} strokeWidth={2.5} />
            {category}
            <X size={10} strokeWidth={3} className="ml-0.5" onClick={(e) => { e.stopPropagation(); setCategory(""); }} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setShowCategoryPicker(!showCategoryPicker); setShowLocationPicker(false); }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-dashed border-neutral-black/20 text-label text-neutral-black/30 cursor-pointer hover:border-secondary hover:text-secondary transition-colors"
          >
            <Tag size={12} strokeWidth={2.5} />
            Kategori
          </button>
        )}

        {location ? (
          <button
            type="button"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-neutral-black bg-accent text-neutral-white text-label font-bold cursor-pointer"
          >
            <MapPin size={12} strokeWidth={2.5} />
            {location}
            <X size={10} strokeWidth={3} className="ml-0.5" onClick={(e) => { e.stopPropagation(); setLocation(""); }} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setShowLocationPicker(!showLocationPicker); setShowCategoryPicker(false); }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-dashed border-neutral-black/20 text-label text-neutral-black/30 cursor-pointer hover:border-accent hover:text-accent transition-colors"
          >
            <MapPin size={12} strokeWidth={2.5} />
            Lokasi
          </button>
        )}
      </div>

      {/* Category picker */}
      {showCategoryPicker && (
        <div className="flex flex-wrap gap-1.5 p-3 mb-3 rounded-[var(--radius-brutal)] border-2 border-neutral-black bg-neutral-gray">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setCategory(cat); setShowCategoryPicker(false); }}
              className={`px-3 py-1.5 rounded-full border-2 border-neutral-black text-label font-bold cursor-pointer transition-colors ${
                category === cat ? "bg-secondary" : "bg-neutral-white hover:bg-secondary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Location picker */}
      {showLocationPicker && (
        <div className="flex flex-wrap gap-1.5 p-3 mb-3 rounded-[var(--radius-brutal)] border-2 border-neutral-black bg-neutral-gray">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => { setLocation(loc); setShowLocationPicker(false); }}
              className={`px-3 py-1.5 rounded-full border-2 border-neutral-black text-label font-bold cursor-pointer transition-colors ${
                location === loc ? "bg-accent text-neutral-white" : "bg-neutral-white hover:bg-accent/20"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t-2 border-neutral-black/10 mb-3" />

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer hover:bg-neutral-gray transition-colors">
          <ImagePlus size={18} strokeWidth={2.5} className={isLost ? "text-danger" : "text-primary"} />
          <span className="text-label font-bold">
            {images.length > 0 ? `${images.length}/3` : "Foto"}
          </span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} disabled={images.length >= 3} />
        </label>

        <div className="flex items-center gap-2">
          <button type="button" onClick={resetForm} className="px-3 py-1.5 rounded-full text-label font-bold text-neutral-black/40 hover:text-neutral-black cursor-pointer transition-colors">
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !title.trim()}
            className={`px-5 py-2 rounded-[var(--radius-brutal)] border-2 border-neutral-black font-bold text-body cursor-pointer transition-all duration-150 shadow-[var(--shadow-brutal-sm)] hover:shadow-[var(--shadow-brutal)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed ${
              isLost ? "bg-danger text-neutral-white" : "bg-primary text-neutral-black"
            }`}
          >
            {submitting ? "Mengirim..." : "Posting"}
          </button>
        </div>
      </div>
    </div>
  );
}
