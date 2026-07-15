import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly string[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="font-bold text-sm">{label}</label>}
      <select
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-[var(--radius-brutal)]
          border-[var(--border-brutal)] bg-neutral-white
          text-base outline-none cursor-pointer
          focus:ring-2 focus:ring-primary
          ${className}
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
);

Select.displayName = "Select";
export default Select;
