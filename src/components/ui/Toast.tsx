"use client";

import { useEffect, useState, ReactNode } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const typeStyles = {
  success: "bg-primary",
  error: "bg-danger text-neutral-white",
  info: "bg-accent text-neutral-white",
};

export default function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200); // wait for exit animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-4 right-4 sm:top-4 left-4 sm:left-auto sm:right-4 z-50
        px-4 py-3 rounded-[var(--radius-brutal)]
        border-[var(--border-brutal)] shadow-[var(--shadow-brutal)]
        flex items-center justify-between gap-3
        transition-all duration-200
        ${typeStyles[type]}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      <span className="font-bold text-sm">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 200); }} className="cursor-pointer" aria-label="Close">
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ============================================
// Toast Manager — gunakan useToast() hook
// ============================================

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
let listeners: Array<(toasts: ToastItem[]) => void> = [];
let toasts: ToastItem[] = [];

function emitChange() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function showToast(message: string, type: ToastItem["type"] = "info") {
  const id = ++toastId;
  toasts = [...toasts, { id, message, type }];
  emitChange();
}

export function useToast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((fn) => fn !== setItems);
    };
  }, []);

  function dismiss(id: number) {
    toasts = toasts.filter((t) => t.id !== id);
    emitChange();
  }

  return {
    toasts: items,
    dismiss,
    success: (msg: string) => showToast(msg, "success"),
    error: (msg: string) => showToast(msg, "error"),
    info: (msg: string) => showToast(msg, "info"),
  };
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => dismiss(t.id)} />
      ))}
    </>
  );
}
