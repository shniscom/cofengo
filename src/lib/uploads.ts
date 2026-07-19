import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function saveUploadedImage(file: File): Promise<string> {
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new Error(
      "Desteklenmeyen dosya turu. Lutfen JPG, PNG, WEBP ya da GIF yukleyin."
    );
  }

  const maxSizeBytes = 8 * 1024 * 1024; // 8 MB
  if (file.size > maxSizeBytes) {
    throw new Error("Dosya boyutu 8 MB'dan kucuk olmali.");
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}

export async function deleteUploadedImage(imageUrl: string | null) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", imageUrl);
  try {
    await fs.unlink(filePath);
  } catch {
    // dosya zaten yoksa yoksay
  }
}
