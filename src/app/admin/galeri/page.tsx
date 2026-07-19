import AdminShell from "@/components/admin/AdminShell";
import { getGalleryImages } from "@/lib/data";
import ImageOrPlaceholder from "@/components/site/ImageOrPlaceholder";
import ImageCropField from "@/components/admin/ImageCropField";
import { uploadGalleryImageAction, deleteGalleryImageAction } from "./actions";

export default async function AdminGalleryPage() {
  const images = getGalleryImages();

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-espresso">Galeri Yönetimi</h1>

      <section className="mt-6 rounded-2xl border border-cardline bg-cream p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-espresso-light">
          Fotoğraf Yükle
        </h2>
        <form action={uploadGalleryImageAction} className="mt-3 space-y-3">
          <ImageCropField name="image" label="Fotoğraf" />
          <input
            name="caption"
            placeholder="Açıklama (opsiyonel)"
            className="w-full max-w-sm rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
          />
          <button
            type="submit"
            className="rounded-lg bg-espresso px-4 py-2 text-sm font-semibold text-cream hover:bg-espresso-light"
          >
            Yükle
          </button>
        </form>
      </section>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="space-y-2">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <ImageOrPlaceholder src={image.imageUrl} alt={image.caption ?? "Cofengo"} />
            </div>
            {image.caption && <p className="truncate text-xs text-espresso-light">{image.caption}</p>}
            <form action={deleteGalleryImageAction}>
              <input type="hidden" name="id" value={image.id} />
              <input type="hidden" name="imageUrl" value={image.imageUrl} />
              <button
                type="submit"
                className="w-full rounded-lg border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Sil
              </button>
            </form>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-full text-sm text-espresso-light">
            Henüz fotoğraf eklenmedi. Yukarıdan yükleyebilirsiniz.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
