"use client";

import { useRef, useTransition, type ReactNode, type FormEvent } from "react";

export default function EditModal({
  trigger,
  title,
  action,
  children,
  submitLabel = "Kaydet",
}: {
  trigger: ReactNode;
  title: string;
  action: (formData: FormData) => Promise<void> | void;
  children: ReactNode;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(formData);
      close();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="rounded-lg border border-cardline px-3 py-1.5 text-xs font-medium text-espresso-light hover:bg-cream-dark"
      >
        {trigger}
      </button>
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        onCancel={() => close()}
        className="w-full max-w-md rounded-2xl border border-cardline bg-cream p-0 backdrop:bg-espresso/50"
      >
        <form onSubmit={handleSubmit} className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-espresso">{title}</h3>
            <button
              type="button"
              onClick={close}
              aria-label="Kapat"
              className="text-espresso-light hover:text-espresso"
            >
              ✕
            </button>
          </div>
          {children}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-espresso px-3 py-2 text-sm font-semibold text-cream hover:bg-espresso-light disabled:opacity-60"
          >
            {isPending ? "Kaydediliyor..." : submitLabel}
          </button>
        </form>
      </dialog>
    </>
  );
}
