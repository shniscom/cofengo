import AdminShell from "@/components/admin/AdminShell";
import EditModal from "@/components/admin/EditModal";
import ImageCropField from "@/components/admin/ImageCropField";
import { getMenuWithItems } from "@/lib/data";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  createItemAction,
  updateItemAction,
  deleteItemAction,
} from "./actions";

export default async function AdminMenuPage() {
  const categories = getMenuWithItems();

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-espresso">Menü Yönetimi</h1>
      </div>

      <section className="mt-6 rounded-2xl border border-cardline bg-cream p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-espresso-light">
          Yeni Kategori Ekle
        </h2>
        <form action={createCategoryAction} className="mt-3 flex gap-3">
          <input
            name="name"
            required
            placeholder="Örn. Tatlılar"
            className="flex-1 rounded-lg border border-cardline bg-cream px-3 py-2 text-espresso outline-none focus:border-caramel"
          />
          <button
            type="submit"
            className="rounded-lg bg-espresso px-4 py-2 text-sm font-semibold text-cream hover:bg-espresso-light"
          >
            Ekle
          </button>
        </form>
      </section>

      <div className="mt-8 space-y-8">
        {categories.map((category) => (
          <section key={category.id} className="rounded-2xl border border-cardline bg-cream p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-espresso">{category.name}</h3>
              <div className="flex gap-2">
                <EditModal
                  trigger="Kategoriyi Düzenle"
                  title="Kategoriyi Düzenle"
                  action={updateCategoryAction}
                >
                  <input type="hidden" name="id" value={category.id} />
                  <input
                    name="name"
                    defaultValue={category.name}
                    required
                    className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                  />
                </EditModal>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Kategoriyi Sil
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cardline/70 p-3"
                >
                  <div>
                    <p className="font-medium text-espresso">
                      {item.name}{" "}
                      <span className="font-semibold text-caramel-dark">
                        {item.price.toFixed(0)} ₺
                      </span>
                      {!item.isAvailable && (
                        <span className="ml-2 rounded-full bg-espresso/10 px-2 py-0.5 text-xs text-espresso-light">
                          Tükendi
                        </span>
                      )}
                    </p>
                    {item.description && (
                      <p className="text-sm text-espresso-light">{item.description}</p>
                    )}
                    {item.allergens && (
                      <p className="text-xs text-espresso-light/80">Alerjen: {item.allergens}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <EditModal trigger="Düzenle" title="Ürünü Düzenle" action={updateItemAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        name="name"
                        defaultValue={item.name}
                        required
                        className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                        placeholder="Ürün adı"
                      />
                      <textarea
                        name="description"
                        defaultValue={item.description ?? ""}
                        className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                        placeholder="Açıklama"
                        rows={2}
                      />
                      <input
                        name="allergens"
                        defaultValue={item.allergens ?? ""}
                        className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                        placeholder="Alerjenler (örn. Gluten, Süt, Fındık)"
                      />
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={item.price}
                        required
                        className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                        placeholder="Fiyat"
                      />
                      <ImageCropField name="image" label="Ürün Görseli" initialImageUrl={item.imageUrl} />
                      <label className="flex items-center gap-2 text-sm text-espresso">
                        <input
                          type="checkbox"
                          name="isAvailable"
                          defaultChecked={item.isAvailable}
                        />
                        Stokta / satışta
                      </label>
                    </EditModal>
                    <form action={deleteItemAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="imageUrl" value={item.imageUrl ?? ""} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {category.items.length === 0 && (
                <p className="text-sm text-espresso-light">Bu kategoride henüz ürün yok.</p>
              )}
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold text-caramel-dark">
                + Bu kategoriye ürün ekle
              </summary>
              <form action={createItemAction} className="mt-3 grid gap-2 sm:grid-cols-2">
                <input type="hidden" name="categoryId" value={category.id} />
                <input
                  name="name"
                  required
                  placeholder="Ürün adı"
                  className="rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="Fiyat (₺)"
                  className="rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                />
                <textarea
                  name="description"
                  placeholder="Açıklama (opsiyonel)"
                  className="sm:col-span-2 rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                  rows={2}
                />
                <input
                  name="allergens"
                  placeholder="Alerjenler (opsiyonel, örn. Gluten, Süt, Fındık)"
                  className="sm:col-span-2 rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                />
                <div className="sm:col-span-2">
                  <ImageCropField name="image" label="Ürün Görseli (opsiyonel)" />
                </div>
                <label className="flex items-center gap-2 text-sm text-espresso">
                  <input type="checkbox" name="isAvailable" defaultChecked />
                  Stokta / satışta
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-espresso px-4 py-2 text-sm font-semibold text-cream hover:bg-espresso-light sm:col-span-2"
                >
                  Ürünü Ekle
                </button>
              </form>
            </details>
          </section>
        ))}

        {categories.length === 0 && (
          <p className="text-sm text-espresso-light">
            Henüz kategori yok. Yukarıdan yeni bir kategori ekleyin.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
