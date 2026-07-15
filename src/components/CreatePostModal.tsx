"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { createPost } from "@/lib/db";
import { uploadMultipleImages } from "@/lib/storage";
import { showToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { CATEGORIES, LOCATIONS, type PostType } from "@/types";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const { user } = useAuth();
  const [type, setType] = useState<PostType>("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newFiles = [...images, ...files].slice(0, 3);
    setImages(newFiles);
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  }

  function removeImage(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newImages.map((f) => URL.createObjectURL(f)));
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
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadMultipleImages(images, user.id);
      }

      await createPost({
        userId: user.id,
        type,
        title,
        description,
        category: category as any,
        location: location as any,
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
    setType("lost");
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setImages([]);
    setPreviews([]);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Postingan">
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

        <Input
          label="Judul"
          placeholder="Contoh: Dompet Kulit Hitam"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          label="Deskripsi"
          placeholder="Jelaskan barang yang hilang/ditemukan..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Select
          label="Kategori"
          options={CATEGORIES}
          placeholder="Pilih kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <Select
          label="Lokasi"
          options={LOCATIONS}
          placeholder="Pilih lokasi"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        {/* Image upload */}
        <div>
          <label className="font-bold text-sm mb-1 block">Foto (maks. 3)</label>
          <div className="flex gap-2 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-[var(--radius-badge)] border-2 border-neutral-black overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-danger text-neutral-white p-0.5 cursor-pointer"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <label className="w-20 h-20 rounded-[var(--radius-badge)] border-2 border-dashed border-neutral-black/30 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <ImagePlus size={24} strokeWidth={2.5} className="text-neutral-black/30" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </label>
            )}
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
          {submitting ? "Mengirim..." : "Posting"}
        </Button>
      </form>
    </Modal>
  );
}
