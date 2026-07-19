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
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      dialogRef.current?.showModal();
    };
    reader.readAsDataURL(file);
    // Ayni dosyayi tekrar secebilmek icin input'u sifirla
    e.target.value = "";
  };

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCancelCrop = () => {
    dialogRef.current?.close();
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
      dialogRef.current?.close();
      setRawSrc(null);
    } catch {
      // sessizce yut, kullanici tekrar deneyebilir
    } finally {
      setIsSaving(false);
    }
  };

  const displayUrl = previewUrl ?? initialImageUrl;

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
        <button
          type="button"
          id={inputId}
          onClick={handlePickClick}
          className="rounded-lg border border-cardline px-3 py-1.5 text-xs font-medium text-espresso hover:bg-cream-dark"
        >
          {displayUrl ? "Fotoğrafı Değiştir" : "Fotoğraf Seç"}
        </button>
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

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) handleCancelCrop();
        }}
        className="w-full max-w-lg rounded-2xl border border-cardline bg-cream p-0 backdrop:bg-espresso/50"
      >
        <div className="p-4">
          <h3 className="font-display text-lg font-bold text-espresso">Görseli Kırp</h3>
          <p className="mt-1 text-xs text-espresso-light">
            Görseli sürükleyip yakınlaştırarak kırpma alanını ayarlayın.
          </p>

          {rawSrc && (
            <div className="relative mt-3 h-72 w-full overflow-hidden rounded-xl bg-espresso/10">
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
          )}

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

          <div className="mt-4 flex justify-end gap-2">
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
      </dialog>
    </div>
  );
}
