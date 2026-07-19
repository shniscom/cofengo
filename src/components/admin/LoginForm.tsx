"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginFormState } from "@/lib/auth-actions";

const initialState: LoginFormState = { error: null };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative mt-1">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-cardline bg-cream px-3 py-2 pr-10 text-espresso outline-none focus:border-caramel"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-espresso-light hover:text-espresso"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.58 10.58a2 2 0 0 0 2.83 2.83M9.88 5.09A9.77 9.77 0 0 1 12 5c5 0 9 4.5 9 7 0 1-.46 2.14-1.25 3.24M6.6 6.6C4.4 8 3 10 3 12c0 2.5 4 7 9 7 1.2 0 2.34-.24 3.36-.66"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
                />
                <circle cx="12" cy="12" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
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
