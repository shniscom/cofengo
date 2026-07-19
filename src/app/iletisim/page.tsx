import type { Metadata } from "next";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "İletişim | Cofengo",
  description: "Cofengo adres, telefon ve sosyal medya bilgileri.",
};

export default async function ContactPage() {
  const settings = getSettings();
  const whatsappDigits = settings.whatsapp.replace(/\D/g, "");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-espresso">İletişim</h1>
        <p className="mt-3 text-espresso-light">Bize aşağıdaki kanallardan ulaşabilirsiniz.</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <InfoCard label="Adres" value={settings.address} />
        <InfoCard label="Telefon" value={settings.phone} href={`tel:${settings.phone.replace(/\s/g, "")}`} />
        <InfoCard label="E-posta" value={settings.email} href={`mailto:${settings.email}`} />
        <InfoCard label="Çalışma Saatleri" value={settings.openingHours} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {whatsappDigits && (
          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            WhatsApp&apos;tan Yaz
          </a>
        )}
        {settings.instagram && (
          <a
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-espresso px-6 py-3 text-sm font-semibold text-espresso hover:bg-espresso hover:text-cream"
          >
            Instagram
          </a>
        )}
        {settings.facebook && (
          <a
            href={settings.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-espresso px-6 py-3 text-sm font-semibold text-espresso hover:bg-espresso hover:text-cream"
          >
            Facebook
          </a>
        )}
      </div>

      {settings.mapEmbedUrl && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-cardline">
          <iframe
            src={settings.mapEmbedUrl}
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Konum haritası"
          />
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div className="rounded-2xl border border-cardline bg-cream p-5 shadow-sm transition-colors hover:border-caramel">
      <p className="text-xs font-semibold uppercase tracking-wide text-caramel-dark">{label}</p>
      <p className="mt-1 text-espresso">{value}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}
