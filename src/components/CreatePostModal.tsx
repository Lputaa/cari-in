"use client";

import { useState } from "react";
import { ImagePlus, X, MapPin, Tag, ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { createPost } from "@/lib/db";
import { uploadMultipleImages } from "@/lib/storage";
import { showToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { CATEGORIES, LOCATIONS, type PostType, type Category, type Location } from "@/types";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "type" | "compose";

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("type");
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

  function selectType(t: PostType) {
    setType(t);
    setStep("compose");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

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

  async function handleSubmit() {
    if (!user) return;
    if (!title.trim()) {
      showToast("Judul wajib diisi", "error");
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
    setStep("type");
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
  const accentColor = isLost ? "bg-danger" : "bg-primary";
  const accentText = isLost ? "text-neutral-white" : "text-neutral-black";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={step === "type" ? "Buat Postingan" : ""}>
      {/* Step 1: Pilih tipe */}
      {step === "type" && (
        <div className="space-y-3">
          <p className="text-body text-neutral-black/60 text-center mb-4">
            Mau lapor apa?
          </p>
          <button
            type="button"
            onClick={() => selectType("lost")}
            className="w-full flex items-center gap-4 p-5 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-danger/5 hover:bg-danger/10 cursor-pointer transition-colors text-left"
          >
            <span className="text-3xl">🔴</span>
            <div>
              <h3 className="font-bold text-h3 text-danger">Kehilangan Barang</h3>
              <p className="text-caption text-neutral-black/50">Laporkan barang yang hilang</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => selectType("found")}
            className="w-full flex items-center gap-4 p-5 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors text-left"
          >
            <span className="text-3xl">🟢</span>
            <div>
              <h3 className="font-bold text-h3 text-primary">Menemukan Barang</h3>
              <p className="text-caption text-neutral-black/50">Laporkan barang yang ditemukan</p>
            </div>
          </button>
        </div>
      )}

      {/* Step 2: Compose — ala X/FB */}
      {step === "compose" && (
        <div className="space-y-3">
          {/* Header: type badge + back */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep("type")}
              className="p-1 cursor-pointer"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <span className={`px-3 py-1 rounded-full border-2 border-neutral-black font-bold text-sm ${accentColor} ${accentText}`}>
              {isLost ? "🔴 Lost" : "🟢 Found"}
            </span>
          </div>

          {/* Title — compact, single line */}
          <input
            type="text"
            placeholder={isLost ? "Apa yang hilang?" : "Apa yang ditemukan?"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full px-0 py-2 text-h3 font-bold bg-transparent border-none outline-none placeholder:text-neutral-black/25"
          />

          {/* Description — main textarea */}
          <textarea
            placeholder="Ceritakan detailnya..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-0 py-1 text-body bg-transparent border-none outline-none resize-none placeholder:text-neutral-black/25"
          />

          {/* Image previews */}
          {previews.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
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

          {/* Tags: category + location (compact chips) */}
          <div className="flex flex-wrap gap-1.5">
            {/* Category chip */}
            {category ? (
              <button
                type="button"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-neutral-black bg-secondary text-sm font-bold cursor-pointer"
              >
                <Tag size={14} strokeWidth={2.5} />
                {category}
                <X size={12} strokeWidth={3} className="ml-0.5" onClick={(e) => { e.stopPropagation(); setCategory(""); }} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-neutral-black/30 text-sm text-neutral-black/40 cursor-pointer hover:border-primary hover:text-primary transition-colors"
              >
                <Tag size={14} strokeWidth={2.5} />
                Kategori
              </button>
            )}

            {/* Location chip */}
            {location ? (
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-neutral-black bg-accent text-neutral-white text-sm font-bold cursor-pointer"
              >
                <MapPin size={14} strokeWidth={2.5} />
                {location}
                <X size={12} strokeWidth={3} className="ml-0.5" onClick={(e) => { e.stopPropagation(); setLocation(""); }} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-neutral-black/30 text-sm text-neutral-black/40 cursor-pointer hover:border-accent hover:text-accent transition-colors"
              >
                <MapPin size={14} strokeWidth={2.5} />
                Lokasi
              </button>
            )}
          </div>

          {/* Category picker dropdown */}
          {showCategoryPicker && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-neutral-gray">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(cat); setShowCategoryPicker(false); }}
                  className={`px-3 py-1.5 rounded-full border-2 border-neutral-black text-sm font-bold cursor-pointer transition-colors ${
                    category === cat ? "bg-secondary" : "bg-neutral-white hover:bg-secondary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Location picker dropdown */}
          {showLocationPicker && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-neutral-gray">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => { setLocation(loc); setShowLocationPicker(false); }}
                  className={`px-3 py-1.5 rounded-full border-2 border-neutral-black text-sm font-bold cursor-pointer transition-colors ${
                    location === loc ? "bg-accent text-neutral-white" : "bg-neutral-white hover:bg-accent/20"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t-2 border-neutral-black/10" />

          {/* Bottom toolbar — image + post */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-primary/10 transition-colors">
              <ImagePlus size={20} strokeWidth={2.5} className={isLost ? "text-danger" : "text-primary"} />
              <span className="text-sm font-bold">
                Foto {images.length > 0 && `(${images.length}/3)`}
              </span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            </label>

            <Button
              variant={isLost ? "danger" : "primary"}
              className={`!px-6 !py-2 ${isLost ? "" : "!bg-primary !text-neutral-black"}`}
              onClick={handleSubmit}
              disabled={submitting || !title.trim()}
            >
              {submitting ? "Mengirim..." : "Posting"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
