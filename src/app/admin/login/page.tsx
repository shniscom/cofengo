import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-cardline bg-cream p-8 shadow-sm">
        <h1 className="font-display text-center text-2xl font-bold text-espresso">
          Cofengo Admin
        </h1>
        <p className="mt-1 text-center text-sm text-espresso-light">
          Devam etmek için giriş yapın.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
