"use client";

import { useRef, useState, useCallback, useId } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImageBlob, type PixelCrop } from "@/lib/cropImage";

export default function ImageCropField({
  name,
  label = "Görsel",
  initialImageUrl = null,
  aspect = 1,
}: {
  name: string;
  label?: string;
  initialImageUrl?: string | null;
  aspect?: number;
}) {
  const inputId = useId();
  const rawFileInputRef = useRef<HTMLInputElement>(null);
  const outputFileInputRef = useRef<HTMLInputElement>(null);

  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeRequested, setRemoveRequested] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePickClick = () => {
    rawFileInputRef.current?.click();
  };

  const handleRawFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(String(reader.result));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    };
    reader.readAsDataURL(file);
    // Ayni dosyayi tekrar secebilmek icin input'u sifirla
    e.target.value = "";
  };

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCancelCrop = () => {
    setRawSrc(null);
  };

  const handleSaveCrop = async () => {
    if (!rawSrc || !croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const blob = await getCroppedImageBlob(rawSrc, croppedAreaPixels, "image/jpeg", 0.9);
      const file = new File([blob], "gorsel.jpg", { type: "image/jpeg" });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (outputFileInputRef.current) {
        outputFileInputRef.current.files = dataTransfer.files;
      }

      setPreviewUrl(URL.createObjectURL(blob));
      setRemoveRequested(false);
      setRawSrc(null);
    } catch {
      // sessizce yut, kullanici tekrar deneyebilir
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setRemoveRequested(true);
    setRawSrc(null);
    if (outputFileInputRef.current) {
      outputFileInputRef.current.value = "";
    }
  };

  const displayUrl = removeRequested ? null : previewUrl ?? initialImageUrl;

  return (
    <div>
      <label className="block text-sm font-medium text-espresso" htmlFor={inputId}>
        {label}
      </label>
      <div className="mt-1 flex items-center gap-3">
        <div className="h-16 w-16 flex-none overflow-hidden rounded-lg border border-cardline bg-cream-dark">
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayUrl} alt="Önizleme" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-espresso-light">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8h13a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1M3 8v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8M3 8l1-4h10l1 4"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <button
            type="button"
            id={inputId}
            onClick={handlePickClick}
            className="rounded-lg border border-cardline px-3 py-1.5 text-xs font-medium text-espresso hover:bg-cream-dark"
          >
            {displayUrl ? "Fotoğrafı Değiştir" : "Fotoğraf Seç"}
          </button>
          {displayUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Fotoğrafı Kaldır
            </button>
          )}
        </div>
      </div>

      {/* Gercek dosya secici, gizli */}
      <input
        ref={rawFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleRawFileChange}
        className="hidden"
      />
      {/* Forma submit edilecek asil dosya - kirpma sonrasi JS ile dolduruluyor */}
      <input ref={outputFileInputRef} type="file" name={name} className="hidden" />
      {/* Kullanici fotografi kaldirmak istedigini belirtti */}
      {removeRequested && <input type="hidden" name={`${name}Remove`} value="1" />}

      {/* Kirpma arayuzu - EditModal icindeki ic ice modal (dialog-in-dialog)
          sorunlarindan kacinmak icin ayri bir <dialog> yerine formun icinde
          acilan bir panel olarak gosteriliyor. */}
      {rawSrc && (
        <div className="mt-3 rounded-xl border border-cardline bg-cream-dark/40 p-3">
          <p className="text-xs text-espresso-light">
            Görseli sürükleyip yakınlaştırarak kırpma alanını ayarlayın.
          </p>
          <div className="relative mt-2 h-64 w-full overflow-hidden rounded-xl bg-espresso/10">
            <Cropper
              image={rawSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-espresso-light">Yakınlaştır</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelCrop}
              className="rounded-lg border border-cardline px-4 py-2 text-sm font-medium text-espresso hover:bg-cream-dark"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              disabled={isSaving || !croppedAreaPixels}
              className="rounded-lg bg-espresso px-4 py-2 text-sm font-semibold text-cream hover:bg-espresso-light disabled:opacity-60"
            >
              {isSaving ? "Kaydediliyor..." : "Kırpmayı Kaydet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
