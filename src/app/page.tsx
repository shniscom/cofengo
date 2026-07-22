import Link from "next/link";
import { getSettings, getMenuWithItems, getEvents, getGalleryImages } from "@/lib/data";
import ImageOrPlaceholder from "@/components/site/ImageOrPlaceholder";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  return `${price.toFixed(0)} ₺`;
}

export default async function Home() {
  const settings = getSettings();
  const menu = getMenuWithItems();
  const events = getEvents({ onlyPublished: true }).slice(0, 2);
  const gallery = getGalleryImages().slice(0, 4);

  const featuredItems = menu.flatMap((category) => category.items).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-cardline bg-gradient-to-b from-cream-dark to-cream px-6 py-16 text-center md:py-24">
        <h1 className="font-display mx-auto max-w-3xl text-4xl font-bold leading-tight text-espresso md:text-5xl">
          {settings.heroTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-espresso-light">
          {settings.heroSubtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/menu"
            className="rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-espresso-light"
          >
            Menüyü İncele
          </Link>
          <Link
            href="/iletisim"
            className="rounded-full border border-espresso px-6 py-3 text-sm font-semibold text-espresso transition-colors hover:bg-espresso hover:text-cream"
          >
            Bize Ulaşın
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-espresso">
          {settings.siteName} Hikayesi
        </h2>
        <p className="mt-4 text-espresso-light">{settings.aboutText}</p>
      </section>

      {/* Featured menu items */}
      {featuredItems.length > 0 && (
        <section className="bg-cream-dark/50 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-espresso">Öne Çıkanlar</h2>
              <Link href="/menu" className="text-sm font-semibold text-caramel-dark hover:underline">
                Tüm menü →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-cardline bg-cream shadow-sm"
                >
                  <div className="relative h-40 w-full">
                    <ImageOrPlaceholder src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-espresso">{item.name}</h3>
                      <span className="whitespace-nowrap font-semibold text-caramel-dark">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-espresso-light">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {events.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-espresso">Yaklaşan Etkinlikler</h2>
              <Link
                href="/etkinlikler"
                className="text-sm font-semibold text-caramel-dark hover:underline"
              >
                Tüm etkinlikler →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-4 rounded-2xl border border-cardline bg-cream p-4 shadow-sm"
                >
                  <div className="relative h-24 w-24 flex-none overflow-hidden rounded-xl">
                    <ImageOrPlaceholder src={event.imageUrl} alt={event.title} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-caramel-dark">
                      {formatDate(event.eventDate)}
                    </p>
                    <h3 className="mt-1 font-semibold text-espresso">{event.title}</h3>
                    {event.description && (
                      <p className="mt-1 text-sm text-espresso-light line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery preview */}
      {gallery.length > 0 && (
        <section className="bg-cream-dark/50 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-espresso">Mekanımızdan Kareler</h2>
              <Link href="/galeri" className="text-sm font-semibold text-caramel-dark hover:underline">
                Tüm galeri →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {gallery.map((image) => (
                <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl">
                  <ImageOrPlaceholder src={image.imageUrl} alt={image.caption ?? "Cofengo"} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
