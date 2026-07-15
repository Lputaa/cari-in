"use client";

import { useState, useEffect } from "react";
import { ImagePlus, X, MapPin, Tag } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { updatePost } from "@/lib/db";
import { uploadMultipleImages, deleteImage } from "@/lib/storage";
import { showToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { CATEGORIES, LOCATIONS, type Post, type PostType, type Category, type Location } from "@/types";

interface EditPostModalProps {
  isOpen: boolean;
  post: Post;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPostModal({ isOpen, post, onClose, onSuccess }: EditPostModalProps) {
  const { user } = useAuth();
  const [type, setType] = useState<PostType>(post.type);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [category, setCategory] = useState<Category | "">(post.category);
  const [location, setLocation] = useState<Location | "">(post.location);
  const [existingImages, setExistingImages] = useState<string[]>(post.images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setType(post.type);
    setTitle(post.title);
    setDescription(post.description);
    setCategory(post.category);
    setLocation(post.location);
    setExistingImages(post.images);
    setNewImages([]);
    setNewPreviews([]);
  }, [post]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const total = existingImages.length + newImages.length;
    const allowed = 3 - total;
    const newFiles = [...newImages, ...files].slice(0, allowed);
    setNewImages(newFiles);
    setNewPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  }

  function removeExistingImage(index: number) {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  }

  function removeNewImage(index: number) {
    const filtered = newImages.filter((_, i) => i !== index);
    setNewImages(filtered);
    setNewPreviews(filtered.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit() {
    if (!user) return;
    if (!title.trim()) {
      showToast("Judul wajib diisi", "error");
      return;
    }

    setSubmitting(true);
    try {
      let newUrls: string[] = [];
      if (newImages.length > 0) {
        newUrls = await uploadMultipleImages(newImages, user.id);
      }

      const removedImages = post.images.filter((url) => !existingImages.includes(url));
      await Promise.all(removedImages.map((url) => {
        const path = url.split("/post-images/")[1];
        return path ? deleteImage(path) : Promise.resolve();
      }));

      const allImages = [...existingImages, ...newUrls];

      await updatePost(post.id, {
        type,
        title: title.trim(),
        description: description.trim(),
        category: (category || "Lainnya") as Category,
        location: (location || "Kantin") as Location,
        images: allImages,
      });

      showToast("Postingan berhasil diupdate!", "success");
      onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Gagal mengupdate postingan", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const isLost = type === "lost";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Postingan">
      <div className="space-y-3">
        {/* Type toggle — compact */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("lost")}
            className={`flex-1 py-2.5 rounded-full border-2 border-neutral-black font-bold text-sm cursor-pointer transition-colors ${
              type === "lost" ? "bg-danger text-neutral-white" : "bg-neutral-gray"
            }`}
          >
            🔴 Lost
          </button>
          <button
            type="button"
            onClick={() => setType("found")}
            className={`flex-1 py-2.5 rounded-full border-2 border-neutral-black font-bold text-sm cursor-pointer transition-colors ${
              type === "found" ? "bg-primary text-neutral-black" : "bg-neutral-gray"
            }`}
          >
            🟢 Found
          </button>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder={isLost ? "Apa yang hilang?" : "Apa yang ditemukan?"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full px-0 py-2 text-h3 font-bold bg-transparent border-none outline-none placeholder:text-neutral-black/25"
        />

        {/* Description */}
        <textarea
          placeholder="Ceritakan detailnya..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-0 py-1 text-body bg-transparent border-none outline-none resize-none placeholder:text-neutral-black/25"
        />

        {/* All images (existing + new) */}
        {(existingImages.length > 0 || newPreviews.length > 0) && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {existingImages.map((url, i) => (
              <div key={`ex-${i}`} className="relative w-20 h-20 flex-shrink-0 rounded-[var(--radius-badge)] border-2 border-neutral-black overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-neutral-black/60 text-neutral-white rounded-full flex items-center justify-center cursor-pointer">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative w-20 h-20 flex-shrink-0 rounded-[var(--radius-badge)] border-2 border-primary overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-neutral-black/60 text-neutral-white rounded-full flex items-center justify-center cursor-pointer">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tags: category + location */}
        <div className="flex flex-wrap gap-1.5">
          {category ? (
            <button type="button" onClick={() => setShowCategoryPicker(!showCategoryPicker)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-neutral-black bg-secondary text-sm font-bold cursor-pointer">
              <Tag size={14} strokeWidth={2.5} />
              {category}
              <X size={12} strokeWidth={3} className="ml-0.5" onClick={(e) => { e.stopPropagation(); setCategory(""); }} />
            </button>
          ) : (
            <button type="button" onClick={() => setShowCategoryPicker(!showCategoryPicker)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-neutral-black/30 text-sm text-neutral-black/40 cursor-pointer hover:border-primary hover:text-primary transition-colors">
              <Tag size={14} strokeWidth={2.5} /> Kategori
            </button>
          )}
          {location ? (
            <button type="button" onClick={() => setShowLocationPicker(!showLocationPicker)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-neutral-black bg-accent text-neutral-white text-sm font-bold cursor-pointer">
              <MapPin size={14} strokeWidth={2.5} />
              {location}
              <X size={12} strokeWidth={3} className="ml-0.5" onClick={(e) => { e.stopPropagation(); setLocation(""); }} />
            </button>
          ) : (
            <button type="button" onClick={() => setShowLocationPicker(!showLocationPicker)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-neutral-black/30 text-sm text-neutral-black/40 cursor-pointer hover:border-accent hover:text-accent transition-colors">
              <MapPin size={14} strokeWidth={2.5} /> Lokasi
            </button>
          )}
        </div>

        {showCategoryPicker && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-neutral-gray">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => { setCategory(cat); setShowCategoryPicker(false); }} className={`px-3 py-1.5 rounded-full border-2 border-neutral-black text-sm font-bold cursor-pointer transition-colors ${category === cat ? "bg-secondary" : "bg-neutral-white hover:bg-secondary/50"}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {showLocationPicker && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-neutral-gray">
            {LOCATIONS.map((loc) => (
              <button key={loc} type="button" onClick={() => { setLocation(loc); setShowLocationPicker(false); }} className={`px-3 py-1.5 rounded-full border-2 border-neutral-black text-sm font-bold cursor-pointer transition-colors ${location === loc ? "bg-accent text-neutral-white" : "bg-neutral-white hover:bg-accent/20"}`}>
                {loc}
              </button>
            ))}
          </div>
        )}

        <div className="border-t-2 border-neutral-black/10" />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between">
          {existingImages.length + newImages.length < 3 && (
            <label className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-primary/10 transition-colors">
              <ImagePlus size={20} strokeWidth={2.5} className="text-primary" />
              <span className="text-sm font-bold">Foto ({existingImages.length + newImages.length}/3)</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            </label>
          )}

          <Button variant="primary" className="!px-6 !py-2 ml-auto" onClick={handleSubmit} disabled={submitting || !title.trim()}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
