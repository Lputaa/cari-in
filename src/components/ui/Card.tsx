import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`
        bg-neutral-white rounded-[var(--radius-brutal)]
        border-2 border-neutral-black
        ${hoverable
          ? "shadow-[var(--shadow-brutal-sm)] hover:shadow-[var(--shadow-brutal)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer transition-all duration-150"
          : "shadow-[var(--shadow-brutal)]"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";
export default Card;
