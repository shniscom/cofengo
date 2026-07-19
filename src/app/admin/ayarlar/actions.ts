"use server";

import { revalidatePath } from "next/cache";
import { updateSettings } from "@/lib/data";

export async function updateSettingsAction(formData: FormData) {
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  updateSettings({
    siteName: get("siteName"),
    heroTitle: get("heroTitle"),
    heroSubtitle: get("heroSubtitle"),
    aboutText: get("aboutText"),
    address: get("address"),
    phone: get("phone"),
    whatsapp: get("whatsapp"),
    email: get("email"),
    instagram: get("instagram"),
    facebook: get("facebook"),
    openingHours: get("openingHours"),
    mapEmbedUrl: get("mapEmbedUrl"),
  });

  revalidatePath("/admin/ayarlar");
  revalidatePath("/", "layout");
}
