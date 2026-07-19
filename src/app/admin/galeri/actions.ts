"use server";

import { revalidatePath } from "next/cache";
import { createGalleryImage, deleteGalleryImage, getGalleryImages } from "@/lib/data";
import { saveUploadedImage, deleteUploadedImage } from "@/lib/uploads";

function revalidateGalleryPaths() {
  revalidatePath("/admin/galeri");
  revalidatePath("/admin");
  revalidatePath("/galeri");
  revalidatePath("/");
}

export async function uploadGalleryImageAction(formData: FormData) {
  const imageFile = formData.get("image");
  const caption = String(formData.get("caption") ?? "").trim();

  if (!(imageFile instanceof File) || imageFile.size === 0) return;

  const imageUrl = await saveUploadedImage(imageFile);
  const existing = getGalleryImages();
  createGalleryImage({
    imageUrl,
    caption: caption || undefined,
    sortOrder: existing.length,
  });
  revalidateGalleryPaths();
}

export async function deleteGalleryImageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");
  if (!id) return;
  deleteGalleryImage(id);
  if (imageUrl) await deleteUploadedImage(imageUrl);
  revalidateGalleryPaths();
}
