import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "open" | "resolved";
}

const variantStyles = {
  default: "bg-neutral-gray text-neutral-black",
  open: "bg-status-open text-neutral-black",
  resolved: "bg-status-resolved text-neutral-black",
};

export default function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5
        rounded-[var(--radius-badge)] border-2 border-neutral-black
        font-bold text-caption
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
