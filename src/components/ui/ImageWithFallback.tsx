"use client";

import { useState, useCallback, useEffect } from "react";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  ...props
}: ImageWithFallbackProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(true);
    } else {
      setLoading(true);
      setError(false);
    }
  }, [src]);

  const handleLoad = useCallback(() => setLoading(false), []);
  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  // No src → immediate fallback
  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-neutral-gray ${fallbackClassName || className}`}>
        <ImageIcon size={32} strokeWidth={1.5} className="text-neutral-black/20" />
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={`absolute inset-0 animate-pulse bg-neutral-gray ${fallbackClassName}`} />
      )}
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
        {...props}
      />
    </>
  );
}
