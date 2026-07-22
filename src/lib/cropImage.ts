export type PixelCrop = { x: number; y: number; width: number; height: number };

// Kirpilan gorselin en uzun kenari bu degeri gecmeyecek sekilde
// olceklenir. Urun/etkinlik/galeri kartlarinda gorseller zaten kucuk
// boyutta gosteriliyor; telefon kameralarindan gelen 3000px+ genislikteki
// orijinal fotograflari oldugu gibi saklamak mobil kullanicilar icin
// gereksiz veri tuketimine ve yavas yuklemeye yol aciyordu.
const MAX_OUTPUT_DIMENSION = 1000;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = src;
  });
}

/**
 * Verilen gorseli belirtilen piksel alanina gore kirpar, makul bir azami
 * boyuta olcekler ve bir Blob olarak dondurur. react-easy-crop'un
 * onCropComplete callback'inden gelen croppedAreaPixels ile kullanilir.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  cropPixels: PixelCrop,
  mimeType: string = "image/jpeg",
  quality: number = 0.85
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  const cropWidth = Math.round(cropPixels.width);
  const cropHeight = Math.round(cropPixels.height);

  const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(cropWidth, cropHeight));
  const outputWidth = Math.max(1, Math.round(cropWidth * scale));
  const outputHeight = Math.max(1, Math.round(cropHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context oluşturulamadı");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropWidth,
    cropHeight,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Görsel kırpma başarısız oldu"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}
