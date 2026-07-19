import AdminShell from "@/components/admin/AdminShell";
import { getSettings } from "@/lib/data";
import { updateSettingsAction } from "./actions";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  textarea = false,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-espresso">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          rows={3}
          className="mt-1 w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-caramel"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          className="mt-1 w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-caramel"
        />
      )}
      {hint && <p className="mt-1 text-xs text-espresso-light">{hint}</p>}
    </div>
  );
}

export default async function AdminSettingsPage() {
  const settings = getSettings();

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-espresso">Site Ayarları</h1>
      <p className="mt-1 text-sm text-espresso-light">
        Ana sayfa metinleri ve iletişim bilgilerini buradan güncelleyin.
      </p>

      <form action={updateSettingsAction} className="mt-6 max-w-2xl space-y-6">
        <div className="rounded-2xl border border-cardline bg-cream p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-espresso-light">
            Genel
          </h2>
          <div className="mt-4 space-y-4">
            <Field label="Site Adı" name="siteName" defaultValue={settings.siteName} />
            <Field label="Ana Sayfa Başlığı" name="heroTitle" defaultValue={settings.heroTitle} />
            <Field
              label="Ana Sayfa Alt Başlığı"
              name="heroSubtitle"
              defaultValue={settings.heroSubtitle}
            />
            <Field
              label="Hakkımızda Metni"
              name="aboutText"
              defaultValue={settings.aboutText}
              textarea
            />
          </div>
        </div>

        <div className="rounded-2xl border border-cardline bg-cream p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-espresso-light">
            İletişim
          </h2>
          <div className="mt-4 space-y-4">
            <Field label="Adres" name="address" defaultValue={settings.address} textarea />
            <Field label="Telefon" name="phone" defaultValue={settings.phone} />
            <Field
              label="WhatsApp Numarası"
              name="whatsapp"
              defaultValue={settings.whatsapp}
              hint="Ülke koduyla birlikte, sadece rakamlar. Örn: 905551234567"
            />
            <Field label="E-posta" name="email" defaultValue={settings.email} type="email" />
            <Field label="Çalışma Saatleri" name="openingHours" defaultValue={settings.openingHours} />
          </div>
        </div>

        <div className="rounded-2xl border border-cardline bg-cream p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-espresso-light">
            Sosyal Medya & Harita
          </h2>
          <div className="mt-4 space-y-4">
            <Field
              label="Instagram Linki"
              name="instagram"
              defaultValue={settings.instagram}
              hint="Örn: https://instagram.com/cofengo"
            />
            <Field
              label="Facebook Linki"
              name="facebook"
              defaultValue={settings.facebook}
            />
            <Field
              label="Google Maps Embed Linki"
              name="mapEmbedUrl"
              defaultValue={settings.mapEmbedUrl}
              textarea
              hint="Google Maps'te 'Paylaş > Harita yerleştir' seçeneğinden alınan iframe src linki."
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-espresso px-6 py-2.5 text-sm font-semibold text-cream hover:bg-espresso-light"
        >
          Değişiklikleri Kaydet
        </button>
      </form>
    </AdminShell>
  );
}
