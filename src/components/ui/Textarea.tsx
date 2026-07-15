import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-bold text-sm">{label}</label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-[var(--radius-brutal)]
          border-[var(--border-brutal)] bg-neutral-white
          text-base outline-none resize-y min-h-[120px]
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

Textarea.displayName = "Textarea";
export default Textarea;
