"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  initials?: string;
}

export default function SafeImage({
  src,
  alt,
  width = 80,
  height = 80,
  className = "",
  fallback = "/Profile.jpg",
  initials = "",
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  // If we have an error and no fallback, show initials
  if (hasError && (!fallback || imgSrc === fallback)) {
    return (
      <div
        className={`bg-stone-200 rounded-full flex items-center justify-center text-stone-600 font-medium ${className}`}
        style={{ width, height }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={imgSrc || fallback}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      crossOrigin="anonymous"
    />
  );
}
