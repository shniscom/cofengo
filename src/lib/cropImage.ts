export type PixelCrop = { x: number; y: number; width: number; height: number };

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
 * Verilen gorseli belirtilen piksel alanina gore kirpar ve bir Blob olarak dondurur.
 * react-easy-crop'un onCropComplete callback'inden gelen croppedAreaPixels ile kullanilir.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  cropPixels: PixelCrop,
  mimeType: string = "image/jpeg",
  quality: number = 0.9
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cropPixels.width);
  canvas.height = Math.round(cropPixels.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context oluşturulamadı");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
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
