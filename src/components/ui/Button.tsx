"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-neutral-black border-neutral-black shadow-[var(--shadow-brutal-sm)] hover:shadow-[var(--shadow-brutal)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none",
  secondary: "bg-secondary text-neutral-black border-neutral-black shadow-[var(--shadow-brutal-sm)] hover:shadow-[var(--shadow-brutal)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none",
  danger: "bg-danger text-neutral-white border-neutral-black shadow-[var(--shadow-brutal-sm)] hover:shadow-[var(--shadow-brutal)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none",
  ghost: "bg-transparent text-neutral-black border-transparent hover:bg-neutral-gray",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-caption gap-1",
  md: "px-5 py-2.5 text-body gap-1.5",
  lg: "px-7 py-3.5 text-h3 gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center
        rounded-[var(--radius-brutal)]
        border-2 font-bold
        transition-all duration-150 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
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
