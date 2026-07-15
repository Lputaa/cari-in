"use client";

import { useState, useRef, useEffect } from "react";

interface SwipeableToggleProps {
  options: { label: string; value: string; emoji: string; color: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function SwipeableToggle({ options, value, onChange }: SwipeableToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentIndex = options.findIndex((o) => o.value === value);

  function handleTouchStart(e: React.TouchEvent) {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startXRef.current;
    setDragOffset(diff);
  }

  function handleTouchEnd() {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    if (dragOffset < -threshold && currentIndex < options.length - 1) {
      onChange(options[currentIndex + 1].value);
    } else if (dragOffset > threshold && currentIndex > 0) {
      onChange(options[currentIndex - 1].value);
    }
    setDragOffset(0);
  }

  // Mouse support for desktop
  function handleMouseDown(e: React.MouseEvent) {
    startXRef.current = e.clientX;
    setIsDragging(true);
  }

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(e: MouseEvent) {
      setDragOffset(e.clientX - startXRef.current);
    }

    function handleMouseUp() {
      setIsDragging(false);
      const threshold = 50;
      if (dragOffset < -threshold && currentIndex < options.length - 1) {
        onChange(options[currentIndex + 1].value);
      } else if (dragOffset > threshold && currentIndex > 0) {
        onChange(options[currentIndex - 1].value);
      }
      setDragOffset(0);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, currentIndex, options, onChange]);

  const current = options[currentIndex];

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      className="relative flex items-center bg-neutral-gray rounded-full border-2 border-neutral-black p-1 select-none overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* Sliding indicator */}
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full border-2 border-neutral-black transition-all duration-200 ease-out ${current.color}`}
        style={{
          transform: `translateX(${currentIndex * 100}% + ${isDragging ? dragOffset * 0.3 : 0}px)`,
          left: "4px",
        }}
      />

      {options.map((option, i) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            relative z-10 flex-1 px-4 py-1.5 rounded-full text-label font-bold cursor-pointer
            transition-colors duration-200 text-center whitespace-nowrap
            ${value === option.value ? "text-neutral-black" : "text-neutral-black/40"}
          `}
        >
          {option.emoji} {option.label}
        </button>
      ))}

      {/* Swipe hint dots */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1">
        {options.map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full transition-colors ${
              i === currentIndex ? "bg-neutral-black" : "bg-neutral-black/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
