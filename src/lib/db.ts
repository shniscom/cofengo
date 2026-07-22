import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.DATABASE_PATH || "./data/cofengo.db";

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

declare global {
  var __cofengoDb: DatabaseSync | undefined;
}

function createConnection(): DatabaseSync {
  ensureDir(DB_PATH);
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA journal_mode = WAL;");
  runMigrations(db);
  return db;
}

function runMigrations(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      allergens TEXT,
      is_available INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      event_date TEXT NOT NULL,
      image_url TEXT,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id TEXT PRIMARY KEY,
      image_url TEXT NOT NULL,
      caption TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      site_name TEXT NOT NULL DEFAULT 'Cofengo',
      hero_title TEXT NOT NULL DEFAULT '',
      hero_subtitle TEXT NOT NULL DEFAULT '',
      about_text TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      whatsapp TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      instagram TEXT NOT NULL DEFAULT '',
      facebook TEXT NOT NULL DEFAULT '',
      opening_hours TEXT NOT NULL DEFAULT '',
      map_embed_url TEXT NOT NULL DEFAULT ''
    );
  `);

  const menuItemColumns = db
    .prepare("PRAGMA table_info(menu_items)")
    .all() as { name: string }[];
  const hasAllergensColumn = menuItemColumns.some((col) => col.name === "allergens");
  if (!hasAllergensColumn) {
    db.exec("ALTER TABLE menu_items ADD COLUMN allergens TEXT;");
  }

  // Eski surumlerde gorsel URL'leri "/uploads/..." seklindeydi; artik
  // "/media/[filename]" route'u uzerinden sunuluyorlar. Var olan kayitlari
  // yeni onekle guncelliyoruz.
  db.exec(
    `UPDATE menu_items SET image_url = '/media/' || substr(image_url, 10)
     WHERE image_url LIKE '/uploads/%';`
  );
  db.exec(
    `UPDATE events SET image_url = '/media/' || substr(image_url, 10)
     WHERE image_url LIKE '/uploads/%';`
  );
  db.exec(
    `UPDATE gallery_images SET image_url = '/media/' || substr(image_url, 10)
     WHERE image_url LIKE '/uploads/%';`
  );

  const existingSettings = db
    .prepare("SELECT id FROM site_settings WHERE id = ?")
    .get("singleton");

  if (!existingSettings) {
    db.prepare(
      `INSERT INTO site_settings (
        id, site_name, hero_title, hero_subtitle, about_text,
        address, phone, whatsapp, email, instagram, facebook,
        opening_hours, map_embed_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      "singleton",
      "Cofengo",
      "Cofengo'ya Hoş Geldiniz",
      "Şehrin kalbinde, sıcacık bir mola noktası",
      "Cofengo, özenle hazırlanan kahveler ve lezzetli atıştırmalıklarla güne başlamanın veya güne mola vermenin en keyifli adresi.",
      "Örnek Mahallesi, Kahve Sokak No:1, İstanbul",
      "+90 555 000 00 00",
      "905550000000",
      "info@cofengo.com",
      "",
      "",
      "Her gün 08:00 - 23:00",
      ""
    );
  }
}

export function getDb(): DatabaseSync {
  if (!globalThis.__cofengoDb) {
    globalThis.__cofengoDb = createConnection();
  }
  return globalThis.__cofengoDb;
}
