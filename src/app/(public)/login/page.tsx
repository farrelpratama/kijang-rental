import LoginForm from "@/src/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <LoginForm />
    </main>
  );
}