import { redirect } from "next/navigation";
import { getUserRole } from "@/src/lib/auth/get-user-role";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}