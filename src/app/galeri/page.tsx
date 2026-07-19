import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/data";
import ImageOrPlaceholder from "@/components/site/ImageOrPlaceholder";

export const metadata: Metadata = {
  title: "Galeri | Cofengo",
  description: "Cofengo mekanından fotoğraflar.",
};

export default async function GalleryPage() {
  const images = getGalleryImages();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-espresso">Galeri</h1>
        <p className="mt-3 text-espresso-light">Mekanımızdan kareler.</p>
      </div>

      {images.length === 0 ? (
        <p className="mt-12 text-center text-espresso-light">
          Henüz fotoğraf eklenmedi. Admin panelinden galeri fotoğrafı ekleyebilirsiniz.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <ImageOrPlaceholder src={image.imageUrl} alt={image.caption ?? "Cofengo"} />
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-espresso/70 px-3 py-2 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
