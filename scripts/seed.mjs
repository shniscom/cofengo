// Ornek menu ve etkinlik verisi ekler. Kullanim: npm run seed
// Bu script birden fazla calistirilirsa mevcut veriyi silip yeniden ekler.
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.DATABASE_PATH || "./data/cofengo.db";
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS menu_categories (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY, category_id TEXT NOT NULL, name TEXT NOT NULL, description TEXT,
    price REAL NOT NULL, image_url TEXT, is_available INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, event_date TEXT NOT NULL,
    image_url TEXT, is_published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY, image_url TEXT NOT NULL, caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY, site_name TEXT NOT NULL DEFAULT 'Cofengo',
    hero_title TEXT NOT NULL DEFAULT '', hero_subtitle TEXT NOT NULL DEFAULT '',
    about_text TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '', whatsapp TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '', instagram TEXT NOT NULL DEFAULT '',
    facebook TEXT NOT NULL DEFAULT '', opening_hours TEXT NOT NULL DEFAULT '',
    map_embed_url TEXT NOT NULL DEFAULT ''
  );
`);

const hasSettings = db.prepare("SELECT id FROM site_settings WHERE id = ?").get("singleton");
if (!hasSettings) {
  db.prepare(
    `INSERT INTO site_settings (id, site_name, hero_title, hero_subtitle, about_text, address, phone, whatsapp, email, instagram, facebook, opening_hours, map_embed_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    "singleton", "Cofengo", "Cofengo'ya Hoş Geldiniz",
    "Şehrin kalbinde, sıcacık bir mola noktası",
    "Cofengo, özenle hazırlanan kahveler ve lezzetli atıştırmalıklarla güne başlamanın veya güne mola vermenin en keyifli adresi.",
    "Örnek Mahallesi, Kahve Sokak No:1, İstanbul", "+90 555 000 00 00", "905550000000",
    "info@cofengo.com", "", "", "Her gün 08:00 - 23:00", ""
  );
}

// Mevcut ornek menu/etkinlik verisini temizle (idempotent calistirma icin)
db.exec("DELETE FROM menu_items; DELETE FROM menu_categories; DELETE FROM events;");

const now = () => new Date().toISOString();

const categories = [
  {
    name: "Sıcak İçecekler",
    items: [
      ["Filtre Kahve", "Günlük taze demlenen filtre kahve", 90],
      ["Latte", "Espresso ve buharda ısıtılmış süt", 110],
      ["Cappuccino", "Espresso, süt ve yoğun köpük", 110],
      ["Sıcak Çikolata", "Ev yapımı çikolata sosuyla", 120],
      ["Türk Kahvesi", "Geleneksel usul, lokum ile", 85],
    ],
  },
  {
    name: "Soğuk İçecekler",
    items: [
      ["Ice Latte", "Soğuk süt ve espresso", 115],
      ["Cold Brew", "18 saat soğuk demleme", 125],
      ["Limonata", "Taze sıkım, nane yapraklı", 95],
      ["Frozen Çilek", "Buzlu çilek smoothie", 130],
    ],
  },
  {
    name: "Tatlılar",
    items: [
      ["Cheesecake", "Frambuazlı ev yapımı cheesecake", 140],
      ["Brownie", "Sıcak servis, dondurma ile", 135],
      ["San Sebastian", "Karamelize İspanyol usulü cheesecake", 145],
    ],
  },
  {
    name: "Kahvaltılık & Atıştırmalık",
    items: [
      ["Serpme Kahvaltı (2 Kişilik)", "Peynir çeşitleri, reçeller, zeytin, simit", 420],
      ["Avokadolu Tost", "Tam buğday ekmeği üzerinde avokado ezmesi", 160],
      ["Sigara Böreği (6 Adet)", "Peynirli el açması börek", 130],
    ],
  },
];

let categoryOrder = 0;
for (const category of categories) {
  const categoryId = randomUUID();
  const ts = now();
  db.prepare(
    "INSERT INTO menu_categories (id, name, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
  ).run(categoryId, category.name, categoryOrder, ts, ts);
  categoryOrder += 1;

  let itemOrder = 0;
  for (const [name, description, price] of category.items) {
    db.prepare(
      `INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NULL, 1, ?, ?, ?)`
    ).run(randomUUID(), categoryId, name, description, price, itemOrder, ts, ts);
    itemOrder += 1;
  }
}

const in10Days = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
const in24Days = new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString();

db.prepare(
  `INSERT INTO events (id, title, description, event_date, image_url, is_published, created_at, updated_at)
   VALUES (?, ?, ?, ?, NULL, 1, ?, ?)`
).run(
  randomUUID(),
  "Akustik Gece",
  "Cofengo'da hafif akustik müzik eşliğinde keyifli bir akşam.",
  in10Days,
  now(),
  now()
);

db.prepare(
  `INSERT INTO events (id, title, description, event_date, image_url, is_published, created_at, updated_at)
   VALUES (?, ?, ?, ?, NULL, 1, ?, ?)`
).run(
  randomUUID(),
  "Kahve Demleme Atölyesi",
  "Farklı demleme yöntemlerini öğrenebileceğiniz ücretsiz bir atölye çalışması.",
  in24Days,
  now(),
  now()
);

console.log("Örnek veriler eklendi: 4 kategori, etkinlikler ve site ayarları hazır.");
