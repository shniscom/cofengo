import Link from "next/link";
import { logoutAction } from "@/lib/auth-actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/menu", label: "Menü" },
  { href: "/admin/etkinlikler", label: "Etkinlikler" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl gap-8 px-6 py-10">
      <aside className="w-52 flex-none">
        <div className="rounded-2xl border border-cardline bg-cream p-4">
          <p className="font-display px-2 text-lg font-bold text-espresso">Cofengo</p>
          <nav className="mt-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-espresso-light transition-colors hover:bg-cream-dark hover:text-espresso"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            target="_blank"
            className="mt-4 block rounded-lg px-3 py-2 text-xs font-medium text-caramel-dark hover:underline"
          >
            Siteyi Görüntüle ↗
          </Link>
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-espresso-light hover:bg-cream-dark hover:text-espresso"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
