import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-bold text-sm">{label}</label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-[var(--radius-brutal)]
          border-[var(--border-brutal)] bg-neutral-white
          text-base outline-none
          focus:ring-2 focus:ring-primary
          ${error ? "border-danger" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-danger text-caption">{error}</span>}
    </div>
  )
);

Input.displayName = "Input";
export default Input;
