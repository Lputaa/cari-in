"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "postingan ini",
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Postingan">
      <p className="text-body mb-6">
        Yakin ingin menghapus <strong>{title}</strong>? Tindakan ini tidak bisa dibatalkan.
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={loading}>
          {loading ? "Menghapus..." : "Hapus"}
        </Button>
      </div>
    </Modal>
  );
}
