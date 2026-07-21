import { randomUUID } from "node:crypto";
import { getDb } from "./db";

function now() {
  return new Date().toISOString();
}

// ---------- Types ----------

export type MenuCategory = {
  id: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  allergens: string | null;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MenuCategoryWithItems = MenuCategory & { items: MenuItem[] };

export type EventItem = {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
};

export type SiteSettings = {
  id: string;
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  openingHours: string;
  mapEmbedUrl: string;
};

// ---------- Row mappers ----------

function mapCategory(row: Record<string, unknown>): MenuCategory {
  return {
    id: row.id as string,
    name: row.name as string,
    sortOrder: Number(row.sort_order),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapItem(row: Record<string, unknown>): MenuItem {
  return {
    id: row.id as string,
    categoryId: row.category_id as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    price: Number(row.price),
    imageUrl: (row.image_url as string) ?? null,
    allergens: (row.allergens as string) ?? null,
    isAvailable: Number(row.is_available) === 1,
    sortOrder: Number(row.sort_order),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapEvent(row: Record<string, unknown>): EventItem {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? null,
    eventDate: row.event_date as string,
    imageUrl: (row.image_url as string) ?? null,
    isPublished: Number(row.is_published) === 1,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapGalleryImage(row: Record<string, unknown>): GalleryImage {
  return {
    id: row.id as string,
    imageUrl: row.image_url as string,
    caption: (row.caption as string) ?? null,
    sortOrder: Number(row.sort_order),
    createdAt: row.created_at as string,
  };
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  return {
    id: row.id as string,
    siteName: row.site_name as string,
    heroTitle: row.hero_title as string,
    heroSubtitle: row.hero_subtitle as string,
    aboutText: row.about_text as string,
    address: row.address as string,
    phone: row.phone as string,
    whatsapp: row.whatsapp as string,
    email: row.email as string,
    instagram: row.instagram as string,
    facebook: row.facebook as string,
    openingHours: row.opening_hours as string,
    mapEmbedUrl: row.map_embed_url as string,
  };
}

// ---------- Menu categories ----------

export function getMenuCategories(): MenuCategory[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM menu_categories ORDER BY sort_order ASC, created_at ASC")
    .all() as Record<string, unknown>[];
  return rows.map(mapCategory);
}

export function getMenuWithItems(): MenuCategoryWithItems[] {
  const db = getDb();
  const categories = getMenuCategories();
  const items = db
    .prepare("SELECT * FROM menu_items ORDER BY sort_order ASC, created_at ASC")
    .all() as Record<string, unknown>[];
  const mappedItems = items.map(mapItem);
  return categories.map((category) => ({
    ...category,
    items: mappedItems.filter((item) => item.categoryId === category.id),
  }));
}

export function createMenuCategory(name: string, sortOrder = 0): MenuCategory {
  const db = getDb();
  const id = randomUUID();
  const ts = now();
  db.prepare(
    "INSERT INTO menu_categories (id, name, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
  ).run(id, name, sortOrder, ts, ts);
  return { id, name, sortOrder, createdAt: ts, updatedAt: ts };
}

export function updateMenuCategory(
  id: string,
  data: { name?: string; sortOrder?: number }
) {
  const db = getDb();
  const current = db
    .prepare("SELECT * FROM menu_categories WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  if (!current) throw new Error("Kategori bulunamadı");
  const name = data.name ?? (current.name as string);
  const sortOrder = data.sortOrder ?? Number(current.sort_order);
  db.prepare(
    "UPDATE menu_categories SET name = ?, sort_order = ?, updated_at = ? WHERE id = ?"
  ).run(name, sortOrder, now(), id);
}

export function deleteMenuCategory(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM menu_categories WHERE id = ?").run(id);
}

// ---------- Menu items ----------

export function createMenuItem(data: {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  allergens?: string;
  isAvailable?: boolean;
  sortOrder?: number;
}): MenuItem {
  const db = getDb();
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO menu_items
      (id, category_id, name, description, price, image_url, allergens, is_available, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    data.categoryId,
    data.name,
    data.description ?? null,
    data.price,
    data.imageUrl ?? null,
    data.allergens ?? null,
    data.isAvailable === false ? 0 : 1,
    data.sortOrder ?? 0,
    ts,
    ts
  );
  return {
    id,
    categoryId: data.categoryId,
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    imageUrl: data.imageUrl ?? null,
    allergens: data.allergens ?? null,
    isAvailable: data.isAvailable !== false,
    sortOrder: data.sortOrder ?? 0,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function updateMenuItem(
  id: string,
  data: Partial<{
    categoryId: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    allergens: string | null;
    isAvailable: boolean;
    sortOrder: number;
  }>
) {
  const db = getDb();
  const current = db
    .prepare("SELECT * FROM menu_items WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  if (!current) throw new Error("Ürün bulunamadı");

  const merged = {
    categoryId: data.categoryId ?? (current.category_id as string),
    name: data.name ?? (current.name as string),
    description:
      data.description !== undefined ? data.description : (current.description as string | null),
    price: data.price ?? Number(current.price),
    imageUrl: data.imageUrl !== undefined ? data.imageUrl : (current.image_url as string | null),
    allergens:
      data.allergens !== undefined ? data.allergens : (current.allergens as string | null),
    isAvailable:
      data.isAvailable !== undefined ? data.isAvailable : Number(current.is_available) === 1,
    sortOrder: data.sortOrder ?? Number(current.sort_order),
  };

  db.prepare(
    `UPDATE menu_items SET
      category_id = ?, name = ?, description = ?, price = ?, image_url = ?, allergens = ?,
      is_available = ?, sort_order = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    merged.categoryId,
    merged.name,
    merged.description,
    merged.price,
    merged.imageUrl,
    merged.allergens,
    merged.isAvailable ? 1 : 0,
    merged.sortOrder,
    now(),
    id
  );
}

export function deleteMenuItem(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM menu_items WHERE id = ?").run(id);
}

// ---------- Events ----------

export function getEvents(options: { onlyPublished?: boolean } = {}): EventItem[] {
  const db = getDb();
  const rows = options.onlyPublished
    ? (db
        .prepare("SELECT * FROM events WHERE is_published = 1 ORDER BY event_date ASC")
        .all() as Record<string, unknown>[])
    : (db.prepare("SELECT * FROM events ORDER BY event_date ASC").all() as Record<
        string,
        unknown
      >[]);
  return rows.map(mapEvent);
}

export function createEvent(data: {
  title: string;
  description?: string;
  eventDate: string;
  imageUrl?: string;
  isPublished?: boolean;
}): EventItem {
  const db = getDb();
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO events (id, title, description, event_date, image_url, is_published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    data.title,
    data.description ?? null,
    data.eventDate,
    data.imageUrl ?? null,
    data.isPublished === false ? 0 : 1,
    ts,
    ts
  );
  return {
    id,
    title: data.title,
    description: data.description ?? null,
    eventDate: data.eventDate,
    imageUrl: data.imageUrl ?? null,
    isPublished: data.isPublished !== false,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function updateEvent(
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    eventDate: string;
    imageUrl: string | null;
    isPublished: boolean;
  }>
) {
  const db = getDb();
  const current = db.prepare("SELECT * FROM events WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
  if (!current) throw new Error("Etkinlik bulunamadı");

  const merged = {
    title: data.title ?? (current.title as string),
    description:
      data.description !== undefined ? data.description : (current.description as string | null),
    eventDate: data.eventDate ?? (current.event_date as string),
    imageUrl: data.imageUrl !== undefined ? data.imageUrl : (current.image_url as string | null),
    isPublished:
      data.isPublished !== undefined ? data.isPublished : Number(current.is_published) === 1,
  };

  db.prepare(
    `UPDATE events SET title = ?, description = ?, event_date = ?, image_url = ?, is_published = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    merged.title,
    merged.description,
    merged.eventDate,
    merged.imageUrl,
    merged.isPublished ? 1 : 0,
    now(),
    id
  );
}

export function deleteEvent(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM events WHERE id = ?").run(id);
}

// ---------- Gallery ----------

export function getGalleryImages(): GalleryImage[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC")
    .all() as Record<string, unknown>[];
  return rows.map(mapGalleryImage);
}

export function createGalleryImage(data: {
  imageUrl: string;
  caption?: string;
  sortOrder?: number;
}): GalleryImage {
  const db = getDb();
  const id = randomUUID();
  const ts = now();
  db.prepare(
    "INSERT INTO gallery_images (id, image_url, caption, sort_order, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(id, data.imageUrl, data.caption ?? null, data.sortOrder ?? 0, ts);
  return {
    id,
    imageUrl: data.imageUrl,
    caption: data.caption ?? null,
    sortOrder: data.sortOrder ?? 0,
    createdAt: ts,
  };
}

export function deleteGalleryImage(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM gallery_images WHERE id = ?").run(id);
}

// ---------- Site settings ----------

export function getSettings(): SiteSettings {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM site_settings WHERE id = ?")
    .get("singleton") as Record<string, unknown>;
  return mapSettings(row);
}

export function updateSettings(data: Partial<Omit<SiteSettings, "id">>) {
  const db = getDb();
  const current = getSettings();
  const merged = { ...current, ...data };
  db.prepare(
    `UPDATE site_settings SET
      site_name = ?, hero_title = ?, hero_subtitle = ?, about_text = ?,
      address = ?, phone = ?, whatsapp = ?, email = ?, instagram = ?, facebook = ?,
      opening_hours = ?, map_embed_url = ?
     WHERE id = 'singleton'`
  ).run(
    merged.siteName,
    merged.heroTitle,
    merged.heroSubtitle,
    merged.aboutText,
    merged.address,
    merged.phone,
    merged.whatsapp,
    merged.email,
    merged.instagram,
    merged.facebook,
    merged.openingHours,
    merged.mapEmbedUrl
  );
}
