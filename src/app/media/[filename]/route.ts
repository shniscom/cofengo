import fs from "node:fs/promises";
import path from "node:path";

// Next.js standalone modda "public" klasorune runtime'da yazilan dosyalarin
// statik sunucu tarafindan her zaman guvenilir sekilde bulunamadigi
// gozlemlendi (bazi ogeler icin gorseller yuklendikten sonra 404 donuyordu).
// Bu route, yuklenen gorselleri dogrudan diskten okuyup kendimiz sunarak
// Next'in dahili statik dosya sunma mekanizmasina bagimliligi ortadan
// kaldirir.
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Path traversal korumasi: sadece duz dosya adlarina izin ver
  if (!filename || filename.includes("/") || filename.includes("..")) {
    return new Response("Bulunamadı", { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return new Response("Bulunamadı", { status: 404 });
  }

  const filePath = path.join(UPLOADS_DIR, filename);

  try {
    const data = await fs.readFile(filePath);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error(`[media] dosya okunamadi: ${filePath}`, err);
    return new Response("Bulunamadı", { status: 404 });
  }
}
