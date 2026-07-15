"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-black/60"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={`
          bg-neutral-white rounded-t-[var(--radius-brutal)] sm:rounded-[var(--radius-brutal)]
          border-[var(--border-brutal)] shadow-[var(--shadow-brutal)]
          w-full sm:max-w-lg max-h-[90vh] overflow-y-auto
          animate-[slideUp_200ms_ease-out]
        `}
      >
        <div className="flex items-center justify-between p-4 border-b-[var(--border-brutal)]">
          {title && <h2 className="text-h3 font-bold">{title}</h2>}
          <button onClick={onClose} className="p-1 cursor-pointer" aria-label="Close">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
