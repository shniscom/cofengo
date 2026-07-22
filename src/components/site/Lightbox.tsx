"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type LightboxImage = { src: string; alt: string; caption?: string | null };

const LightboxContext = createContext<{ open: (index: number) => void } | null>(null);

export function LightboxProvider({
  images,
  children,
}: {
  images: LightboxImage[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => {
    setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, close, prev, next]);

  const current = index !== null ? images[index] : null;

  return (
    <LightboxContext.Provider value={{ open: setIndex }}>
      {children}
      {current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/95 p-4"
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const diff = e.changedTouches[0].clientX - touchStartX.current;
            if (diff > 50) prev();
            else if (diff < -50) next();
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20"
          >
            ✕
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Önceki fotoğraf"
              className="absolute left-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20 sm:left-4"
            >
              ‹
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full select-none rounded-lg object-contain shadow-2xl"
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Sonraki fotoğraf"
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20 sm:right-4"
            >
              ›
            </button>
          )}

          {current.caption && (
            <div className="absolute bottom-6 left-1/2 max-w-[90vw] -translate-x-1/2 rounded-full bg-espresso/70 px-4 py-2 text-center text-sm text-cream">
              {current.caption}
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 right-4 rounded-full bg-espresso/70 px-3 py-1 text-xs text-cream sm:top-4 sm:bottom-auto">
              {(index ?? 0) + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function LightboxThumbnail({
  index,
  children,
  className,
  ariaLabel,
}: {
  index: number;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("LightboxThumbnail, LightboxProvider içinde kullanılmalı");
  }
  return (
    <button
      type="button"
      onClick={() => ctx.open(index)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
