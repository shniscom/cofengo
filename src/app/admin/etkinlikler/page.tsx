import AdminShell from "@/components/admin/AdminShell";
import EditModal from "@/components/admin/EditModal";
import ImageCropField from "@/components/admin/ImageCropField";
import { getEvents } from "@/lib/data";
import { createEventAction, updateEventAction, deleteEventAction } from "./actions";

function toDatetimeLocal(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminEventsPage() {
  const events = getEvents();

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-espresso">Etkinlik Yönetimi</h1>

      <section className="mt-6 rounded-2xl border border-cardline bg-cream p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-espresso-light">
          Yeni Etkinlik Ekle
        </h2>
        <form action={createEventAction} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            name="title"
            required
            placeholder="Etkinlik başlığı"
            className="rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
          />
          <input
            name="eventDate"
            type="datetime-local"
            required
            className="rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
          />
          <textarea
            name="description"
            placeholder="Açıklama (opsiyonel)"
            rows={2}
            className="sm:col-span-2 rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
          />
          <div className="sm:col-span-2">
            <ImageCropField name="image" label="Etkinlik Görseli (opsiyonel)" aspect={4 / 3} />
          </div>
          <label className="flex items-center gap-2 text-sm text-espresso">
            <input type="checkbox" name="isPublished" defaultChecked />
            Sitede yayınla
          </label>
          <button
            type="submit"
            className="rounded-lg bg-espresso px-4 py-2 text-sm font-semibold text-cream hover:bg-espresso-light sm:col-span-2"
          >
            Etkinliği Ekle
          </button>
        </form>
      </section>

      <div className="mt-8 space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cardline bg-cream p-4"
          >
            <div>
              <p className="font-semibold text-espresso">
                {event.title}
                {!event.isPublished && (
                  <span className="ml-2 rounded-full bg-espresso/10 px-2 py-0.5 text-xs text-espresso-light">
                    Taslak
                  </span>
                )}
              </p>
              <p className="text-sm text-caramel-dark">{formatDate(event.eventDate)}</p>
              {event.description && (
                <p className="mt-1 text-sm text-espresso-light">{event.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <EditModal trigger="Düzenle" title="Etkinliği Düzenle" action={updateEventAction}>
                <input type="hidden" name="id" value={event.id} />
                <input type="hidden" name="currentImageUrl" value={event.imageUrl ?? ""} />
                <input
                  name="title"
                  defaultValue={event.title}
                  required
                  className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                />
                <input
                  name="eventDate"
                  type="datetime-local"
                  defaultValue={toDatetimeLocal(event.eventDate)}
                  required
                  className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                />
                <textarea
                  name="description"
                  defaultValue={event.description ?? ""}
                  rows={2}
                  className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso"
                />
                <ImageCropField
                  name="image"
                  label="Etkinlik Görseli"
                  initialImageUrl={event.imageUrl}
                  aspect={4 / 3}
                />
                <label className="flex items-center gap-2 text-sm text-espresso">
                  <input type="checkbox" name="isPublished" defaultChecked={event.isPublished} />
                  Sitede yayınla
                </label>
              </EditModal>
              <form action={deleteEventAction}>
                <input type="hidden" name="id" value={event.id} />
                <input type="hidden" name="imageUrl" value={event.imageUrl ?? ""} />
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
        {events.length === 0 && (
          <p className="text-sm text-espresso-light">Henüz etkinlik eklenmedi.</p>
        )}
      </div>
    </AdminShell>
  );
}
