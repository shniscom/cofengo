"use server";

import { revalidatePath } from "next/cache";
import {
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuWithItems,
} from "@/lib/data";
import { saveUploadedImage, deleteUploadedImage } from "@/lib/uploads";

function revalidateMenuPaths() {
  revalidatePath("/admin/menu");
  revalidatePath("/admin");
  revalidatePath("/menu");
  revalidatePath("/");
}

export async function createCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const existing = getMenuWithItems();
  createMenuCategory(name, existing.length);
  revalidateMenuPaths();
}

export async function updateCategoryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  updateMenuCategory(id, { name });
  revalidateMenuPaths();
}

export async function deleteCategoryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  deleteMenuCategory(id);
  revalidateMenuPaths();
}

export async function createItemAction(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const allergens = String(formData.get("allergens") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "");
  const price = Number(priceRaw.replace(",", "."));
  const isAvailable = formData.get("isAvailable") === "on";
  const imageFile = formData.get("image");

  if (!categoryId || !name || Number.isNaN(price)) return;

  let imageUrl: string | undefined;
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await saveUploadedImage(imageFile);
  }

  createMenuItem({
    categoryId,
    name,
    description: description || undefined,
    price,
    imageUrl,
    allergens: allergens || undefined,
    isAvailable,
  });
  revalidateMenuPaths();
}

export async function updateItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const allergens = String(formData.get("allergens") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "");
  const price = Number(priceRaw.replace(",", "."));
  const isAvailable = formData.get("isAvailable") === "on";
  const imageFile = formData.get("image");

  if (!id || !name || Number.isNaN(price)) return;

  const update: Parameters<typeof updateMenuItem>[1] = {
    name,
    description: description || null,
    price,
    allergens: allergens || null,
    isAvailable,
  };

  if (imageFile instanceof File && imageFile.size > 0) {
    update.imageUrl = await saveUploadedImage(imageFile);
  }

  updateMenuItem(id, update);
  revalidateMenuPaths();
}

export async function deleteItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");
  if (!id) return;
  deleteMenuItem(id);
  if (imageUrl) await deleteUploadedImage(imageUrl);
  revalidateMenuPaths();
}
