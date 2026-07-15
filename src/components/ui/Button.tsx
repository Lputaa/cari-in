"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-neutral-black hover:-translate-x-0.5 hover:-translate-y-0.5",
  secondary: "bg-secondary text-neutral-black hover:-translate-x-0.5 hover:-translate-y-0.5",
  danger: "bg-danger text-neutral-white hover:-translate-x-0.5 hover:-translate-y-0.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center
        px-6 py-3 rounded-[var(--radius-brutal)]
        border-[var(--border-brutal)] font-bold text-base
        shadow-[var(--shadow-brutal)]
        transition-transform duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
