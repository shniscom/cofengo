import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getMenuWithItems, getEvents, getGalleryImages } from "@/lib/data";

export default async function AdminDashboardPage() {
  const menu = getMenuWithItems();
  const itemCount = menu.reduce((sum, category) => sum + category.items.length, 0);
  const events = getEvents();
  const gallery = getGalleryImages();

  const stats = [
    { label: "Menü Kategorisi", value: menu.length, href: "/admin/menu" },
    { label: "Menü Ürünü", value: itemCount, href: "/admin/menu" },
    { label: "Etkinlik", value: events.length, href: "/admin/etkinlikler" },
    { label: "Galeri Fotoğrafı", value: gallery.length, href: "/admin/galeri" },
  ];

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-espresso">Yönetim Paneli</h1>
      <p className="mt-1 text-sm text-espresso-light">
        Menü, etkinlik, galeri ve iletişim bilgilerinizi buradan yönetin.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-cardline bg-cream p-5 shadow-sm transition-colors hover:border-caramel"
          >
            <p className="text-3xl font-bold text-espresso">{stat.value}</p>
            <p className="mt-1 text-sm text-espresso-light">{stat.label}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
