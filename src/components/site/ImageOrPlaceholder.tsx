import Image from "next/image";

export default function ImageOrPlaceholder({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-dark to-caramel/40 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-10 w-10 text-espresso/30"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8h13a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1M3 8v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8M3 8l1-4h10l1 4"
        />
      </svg>
    </div>
  );
}
