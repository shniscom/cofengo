import type { Metadata } from "next";
import { getMenuWithItems } from "@/lib/data";
import ImageOrPlaceholder from "@/components/site/ImageOrPlaceholder";

export const metadata: Metadata = {
  title: "Menü | Cofengo",
  description: "Cofengo'nun güncel menüsü: sıcak ve soğuk içecekler, tatlılar ve daha fazlası.",
};

function formatPrice(price: number) {
  return `${price.toFixed(0)} ₺`;
}

export default async function MenuPage() {
  const categories = getMenuWithItems();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-espresso">Menümüz</h1>
        <p className="mt-3 text-espresso-light">
          Taze malzemelerle, özenle hazırladığımız lezzetlerimiz.
        </p>
      </div>

      {categories.length === 0 && (
        <p className="mt-12 text-center text-espresso-light">
          Menü henüz eklenmedi. Admin panelinden kategori ve ürün ekleyebilirsiniz.
        </p>
      )}

      {categories.length > 1 && (
        <nav
          aria-label="Kategoriler"
          className="sticky top-16 z-30 -mx-6 mt-8 flex gap-2 overflow-x-auto border-y border-cardline bg-cream/95 px-6 py-3 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#kategori-${category.id}`}
              className="flex-none whitespace-nowrap rounded-full border border-cardline px-4 py-1.5 text-sm font-medium text-espresso-light transition-colors hover:border-caramel hover:text-caramel-dark"
            >
              {category.name}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-12 space-y-14">
        {categories.map((category) => (
          <section key={category.id} id={`kategori-${category.id}`} className="scroll-mt-36">
            <h2 className="font-display border-b border-cardline pb-3 text-2xl font-bold text-espresso">
              {category.name}
            </h2>
            <div className="mt-6 mx-auto max-w-2xl space-y-5">
              {category.items.map((item) => (
                <div key={item.id} className="flex gap-5">
                  <div className="relative h-28 w-28 flex-none overflow-hidden rounded-xl">
                    <ImageOrPlaceholder src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-espresso">
                        {item.name}
                        {!item.isAvailable && (
                          <span className="ml-2 rounded-full bg-espresso/10 px-2 py-0.5 text-xs font-medium text-espresso-light">
                            Tükendi
                          </span>
                        )}
                      </h3>
                      <span className="whitespace-nowrap font-semibold text-caramel-dark">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-espresso-light">{item.description}</p>
                    )}
                    {item.allergens && (
                      <p className="mt-1 text-xs italic text-espresso-light/80">
                        Alerjen: {item.allergens}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {category.items.length === 0 && (
                <p className="text-sm text-espresso-light">Bu kategoride henüz ürün yok.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
