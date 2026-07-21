import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Self-hosted ortamda 'sharp' paketi kurulu olmadigi icin next/image'in
  // yerlesik optimizasyon servisini kapatiyoruz. Aksi halde bazi gorseller
  // /_next/image endpoint'i uzerinden 500 donup kirik gorsel olarak
  // gozukebiliyor. Gorseller zaten admin panelinde kirpma sirasinda
  // uygun boyuta getiriliyor, bu yuzden ekstra optimizasyona ihtiyac yok.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
