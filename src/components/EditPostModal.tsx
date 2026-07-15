"use client";

import { useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { updatePost } from "@/lib/db";
import { uploadMultipleImages, deleteImage } from "@/lib/storage";
import { showToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
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
  const [category, setCategory] = useState<Category>(post.category);
  const [location, setLocation] = useState<Location>(post.location);
  const [existingImages, setExistingImages] = useState<string[]>(post.images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!title || !description || !category || !location) {
      showToast("Lengkapi semua field", "error");
      return;
    }

    setSubmitting(true);
    try {
      // Upload new images
      let newUrls: string[] = [];
      if (newImages.length > 0) {
        newUrls = await uploadMultipleImages(newImages, user.id);
      }

      // Delete removed images from storage
      const removedImages = post.images.filter((url) => !existingImages.includes(url));
      await Promise.all(removedImages.map((url) => {
        const path = url.split("/post-images/")[1];
        return path ? deleteImage(path) : Promise.resolve();
      }));

      const allImages = [...existingImages, ...newUrls];

      await updatePost(post.id, {
        type,
        title,
        description,
        category,
        location,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Postingan">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("lost")}
            className={`flex-1 py-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] font-bold cursor-pointer transition-colors ${
              type === "lost" ? "bg-danger text-neutral-white" : "bg-neutral-gray"
            }`}
          >
            🔴 Lost
          </button>
          <button
            type="button"
            onClick={() => setType("found")}
            className={`flex-1 py-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] font-bold cursor-pointer transition-colors ${
              type === "found" ? "bg-primary text-neutral-black" : "bg-neutral-gray"
            }`}
          >
            🟢 Found
          </button>
        </div>

        <Input label="Judul" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea label="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <Select label="Kategori" options={CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value as Category)} required />
        <Select label="Lokasi" options={LOCATIONS} value={location} onChange={(e) => setLocation(e.target.value as Location)} required />

        {/* Images */}
        <div>
          <label className="font-bold text-sm mb-1 block">Foto (maks. 3)</label>
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((url, i) => (
              <div key={`existing-${i}`} className="relative w-20 h-20 rounded-[var(--radius-badge)] border-2 border-neutral-black overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute top-0 right-0 bg-danger text-neutral-white p-0.5 cursor-pointer"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative w-20 h-20 rounded-[var(--radius-badge)] border-2 border-primary overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-0 right-0 bg-danger text-neutral-white p-0.5 cursor-pointer"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
            {existingImages.length + newImages.length < 3 && (
              <label className="w-20 h-20 rounded-[var(--radius-badge)] border-2 border-dashed border-neutral-black/30 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <ImagePlus size={24} strokeWidth={2.5} className="text-neutral-black/30" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </label>
            )}
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </Modal>
  );
}
