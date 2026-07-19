"use server";

import { revalidatePath } from "next/cache";
import { createEvent, updateEvent, deleteEvent } from "@/lib/data";
import { saveUploadedImage, deleteUploadedImage } from "@/lib/uploads";

function revalidateEventPaths() {
  revalidatePath("/admin/etkinlikler");
  revalidatePath("/admin");
  revalidatePath("/etkinlikler");
  revalidatePath("/");
}

function toIsoDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function createEventAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dateRaw = String(formData.get("eventDate") ?? "");
  const isPublished = formData.get("isPublished") === "on";
  const imageFile = formData.get("image");

  const eventDate = toIsoDate(dateRaw);
  if (!title || !eventDate) return;

  let imageUrl: string | undefined;
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await saveUploadedImage(imageFile);
  }

  createEvent({
    title,
    description: description || undefined,
    eventDate,
    imageUrl,
    isPublished,
  });
  revalidateEventPaths();
}

export async function updateEventAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dateRaw = String(formData.get("eventDate") ?? "");
  const isPublished = formData.get("isPublished") === "on";
  const imageFile = formData.get("image");

  const eventDate = toIsoDate(dateRaw);
  if (!id || !title || !eventDate) return;

  const update: Parameters<typeof updateEvent>[1] = {
    title,
    description: description || null,
    eventDate,
    isPublished,
  };

  if (imageFile instanceof File && imageFile.size > 0) {
    update.imageUrl = await saveUploadedImage(imageFile);
  }

  updateEvent(id, update);
  revalidateEventPaths();
}

export async function deleteEventAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");
  if (!id) return;
  deleteEvent(id);
  if (imageUrl) await deleteUploadedImage(imageUrl);
  revalidateEventPaths();
}
