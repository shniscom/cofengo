import { getSettings } from "@/lib/data";

export default async function WhatsAppButton() {
  const settings = getSettings();
  if (!settings.whatsapp) return null;

  const digitsOnly = settings.whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${digitsOnly}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geçin"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.373 3 4 8.373 4 15.004c0 2.32.641 4.49 1.756 6.348L4 29l7.822-1.72a11.94 11.94 0 0 0 4.182.744C22.635 28.024 28 22.652 28 16.02 28 9.388 22.635 3 16.004 3Zm0 21.6a9.6 9.6 0 0 1-4.9-1.35l-.35-.207-4.64 1.02 1.04-4.52-.23-.37a9.55 9.55 0 0 1-1.48-5.17c0-5.3 4.31-9.6 9.6-9.6 5.29 0 9.6 4.3 9.6 9.6 0 5.29-4.31 9.6-9.64 9.6Zm5.27-7.19c-.29-.145-1.71-.845-1.975-.94-.265-.096-.458-.145-.65.144-.193.29-.747.94-.916 1.132-.169.193-.337.217-.626.072-.29-.144-1.223-.45-2.33-1.436-.862-.768-1.444-1.716-1.613-2.005-.169-.29-.018-.446.127-.59.13-.13.29-.338.434-.507.145-.169.193-.29.29-.482.096-.193.048-.362-.024-.507-.072-.144-.65-1.566-.89-2.145-.235-.564-.474-.487-.65-.496l-.554-.01c-.193 0-.507.072-.772.362-.265.29-1.012.99-1.012 2.412 0 1.423 1.036 2.797 1.18 2.99.145.193 2.04 3.12 4.945 4.375.691.298 1.23.476 1.65.61.693.22 1.323.19 1.822.115.556-.083 1.71-.699 1.951-1.373.24-.674.24-1.252.169-1.373-.072-.12-.265-.193-.554-.338Z" />
      </svg>
    </a>
  );
}
