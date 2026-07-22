import type { Metadata } from "next";
import { getEvents, type EventItem } from "@/lib/data";
import ImageOrPlaceholder from "@/components/site/ImageOrPlaceholder";
import { LightboxProvider, LightboxThumbnail } from "@/components/site/Lightbox";

export const metadata: Metadata = {
  title: "Etkinlikler | Cofengo",
  description: "Cofengo'da düzenlenen ve düzenlenecek etkinlikler.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventsPage() {
  const events = getEvents({ onlyPublished: true });
  // eslint-disable-next-line react-hooks/purity -- sunucu bilesenidir, her istekte bir kez calisir
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.eventDate).getTime() >= now);
  const past = events.filter((e) => new Date(e.eventDate).getTime() < now);

  // Sadece gorseli olan etkinlikler lightbox'ta gezinilebilir listeye girer.
  const lightboxImages = events
    .filter((e) => e.imageUrl)
    .map((e) => ({ src: e.imageUrl as string, alt: e.title }));

  const lightboxIndexFor = (event: EventItem) =>
    event.imageUrl ? lightboxImages.findIndex((li) => li.src === event.imageUrl) : -1;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-espresso">Etkinlikler</h1>
        <p className="mt-3 text-espresso-light">
          Cofengo&apos;da neler oluyor, kaçırmayın.
        </p>
      </div>

      {events.length === 0 && (
        <p className="mt-12 text-center text-espresso-light">
          Şu anda planlanan bir etkinlik bulunmuyor.
        </p>
      )}

      <LightboxProvider images={lightboxImages}>
        {upcoming.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="font-display text-xl font-bold text-espresso">Yaklaşan</h2>
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                formatDate={formatDate}
                lightboxIndex={lightboxIndexFor(event)}
              />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-14 space-y-6 opacity-70">
            <h2 className="font-display text-xl font-bold text-espresso">Geçmiş Etkinlikler</h2>
            {past.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                formatDate={formatDate}
                lightboxIndex={lightboxIndexFor(event)}
              />
            ))}
          </div>
        )}
      </LightboxProvider>
    </div>
  );
}

function EventCard({
  event,
  formatDate,
  lightboxIndex,
}: {
  event: EventItem;
  formatDate: (iso: string) => string;
  lightboxIndex: number;
}) {
  const image = (
    <div className="relative h-28 w-28 flex-none overflow-hidden rounded-xl">
      <ImageOrPlaceholder src={event.imageUrl} alt={event.title} />
    </div>
  );

  return (
    <div className="flex gap-5 rounded-2xl border border-cardline bg-cream p-5 shadow-sm">
      {lightboxIndex >= 0 ? (
        <LightboxThumbnail index={lightboxIndex} ariaLabel={`${event.title} fotoğrafını büyüt`}>
          {image}
        </LightboxThumbnail>
      ) : (
        image
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-caramel-dark">
          {formatDate(event.eventDate)}
        </p>
        <h3 className="font-display mt-1 text-lg font-bold text-espresso">{event.title}</h3>
        {event.description && (
          <p className="mt-2 text-sm text-espresso-light">{event.description}</p>
        )}
      </div>
    </div>
  );
}
