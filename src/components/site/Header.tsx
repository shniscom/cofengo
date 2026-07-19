import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/menu", label: "Menü" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cardline bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight text-espresso">
          Cofengo
        </Link>
        <nav className="hidden gap-8 text-sm font-medium text-espresso-light md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-caramel-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <details className="relative md:hidden">
      <summary className="list-none cursor-pointer rounded-md border border-cardline px-3 py-2 text-sm text-espresso">
        Menü
      </summary>
      <div className="absolute right-0 mt-2 w-48 rounded-lg border border-cardline bg-cream shadow-lg">
        <nav className="flex flex-col p-2 text-sm text-espresso-light">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 hover:bg-cream-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </details>
  );
}
