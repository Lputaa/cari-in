"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { reportPost, reportComment } from "@/lib/db";
import { showToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const REPORT_THRESHOLD = 3;

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "post" | "comment";
  targetId: string;
}

const REASONS = [
  "Spam atau penipuan",
  "Konten tidak pantas",
  "Informasi palsu",
  "Pelanggaran lainnya",
];

export default function ReportModal({ isOpen, onClose, targetType, targetId }: ReportModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      if (targetType === "post") {
        await reportPost(targetId);
      } else {
        await reportComment(targetId);
      }
      showToast("Laporan terkirim. Terima kasih!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Gagal mengirim laporan", "error");
    } finally {
      setSubmitting(false);
      setReason("");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Laporkan ${targetType === "post" ? "Postingan" : "Komentar"}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-body text-neutral-black/70">
          Laporan akan ditinjau. {targetType === "post" ? "Postingan" : "Komentar"} akan disembunyikan otomatis setelah {REPORT_THRESHOLD} laporan.
        </p>

        <div className="space-y-2">
          {REASONS.map((r) => (
            <label
              key={r}
              className={`flex items-center gap-3 p-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] cursor-pointer transition-colors ${
                reason === r ? "bg-primary/10 border-primary" : "bg-neutral-white"
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
                className="accent-primary"
              />
              <span className="text-body">{r}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" className="flex-1" type="submit" disabled={submitting || !reason}>
            <Flag size={18} strokeWidth={2.5} className="mr-1" />
            {submitting ? "Mengirim..." : "Laporkan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
