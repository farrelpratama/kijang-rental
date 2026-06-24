import RegisterForm from "@/src/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <RegisterForm />
    </main>
  );
}