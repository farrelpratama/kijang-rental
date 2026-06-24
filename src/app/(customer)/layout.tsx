import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth/get-current-user";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}