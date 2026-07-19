"use client";

import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/lib/auth-actions";

const initialState: LoginFormState = { error: null };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-espresso">
          Kullanıcı adı
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="mt-1 w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-espresso outline-none focus:border-caramel"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-espresso">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-cardline bg-cream px-3 py-2 text-espresso outline-none focus:border-caramel"
        />
      </div>

      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-espresso px-4 py-2 font-semibold text-cream transition-colors hover:bg-espresso-light disabled:opacity-60"
      >
        {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}
