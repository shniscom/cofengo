import Link from "next/link";
import { getSettings } from "@/lib/data";

export default async function Footer() {
  const settings = getSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cardline bg-espresso text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl font-bold">{settings.siteName}</h3>
          <p className="mt-3 max-w-xs text-sm text-cream/80">{settings.aboutText}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-cream/60">
            İletişim
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/85">
            <li>{settings.address}</li>
            <li>{settings.phone}</li>
            <li>{settings.email}</li>
            <li>{settings.openingHours}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-cream/60">
            Keşfet
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/85">
            <li>
              <Link href="/menu" className="hover:text-caramel">
                Menü
              </Link>
            </li>
            <li>
              <Link href="/etkinlikler" className="hover:text-caramel">
                Etkinlikler
              </Link>
            </li>
            <li>
              <Link href="/galeri" className="hover:text-caramel">
                Galeri
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-caramel">
                İletişim
              </Link>
            </li>
          </ul>
          <div className="mt-4 flex gap-4 text-sm">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-caramel"
              >
                Instagram
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-caramel"
              >
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {year} {settings.siteName}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
