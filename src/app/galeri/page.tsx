import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/data";
import ImageOrPlaceholder from "@/components/site/ImageOrPlaceholder";
import { LightboxProvider, LightboxThumbnail } from "@/components/site/Lightbox";

export const metadata: Metadata = {
  title: "Galeri | Cofengo",
  description: "Cofengo mekanından fotoğraflar.",
};

export default async function GalleryPage() {
  const images = getGalleryImages();
  const lightboxImages = images
    .filter((image) => image.imageUrl)
    .map((image) => ({
      src: image.imageUrl as string,
      alt: image.caption ?? "Cofengo",
      caption: image.caption,
    }));

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
        <LightboxProvider images={lightboxImages}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => {
              const lightboxIndex = lightboxImages.findIndex(
                (li) => li.src === image.imageUrl
              );
              return (
                <LightboxThumbnail
                  key={image.id}
                  index={lightboxIndex}
                  ariaLabel={image.caption ?? "Fotoğrafı büyüt"}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <ImageOrPlaceholder src={image.imageUrl} alt={image.caption ?? "Cofengo"} />
                  {image.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-espresso/70 px-3 py-2 text-left text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100">
                      {image.caption}
                    </div>
                  )}
                </LightboxThumbnail>
              );
            })}
          </div>
        </LightboxProvider>
      )}
    </div>
  );
}
