"use client";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/form/FormField";
import { useAdminLogin } from "@/components/admin/hooks/useAdminLogin";

export default function AdminLoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    formError,
    submitting,
    onSubmit,
  } = useAdminLogin();

  return (
    <div className="flex min-h-mobile-vp flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="section-label mb-2 text-center text-(--red-mid)">Вход</p>
        <h1 className="mb-8 text-center font-cormorant-garamond text-2xl text-(--red-deep)">
          Админ-панель
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            label="Email"
            name="email"
            required
            placeholder="you@example.com"
            inputType="email"
            textTone="dark"
            value={email}
            onChange={setEmail}
          />
          <FormField
            label="Пароль"
            name="password"
            required
            placeholder="••••••••"
            inputType="password"
            textTone="dark"
            value={password}
            onChange={setPassword}
          />

          {formError ? (
            <p className="text-sm text-red-700" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="pt-2">
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="w-full justify-center"
            >
              {submitting ? "Вход…" : "Войти"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
