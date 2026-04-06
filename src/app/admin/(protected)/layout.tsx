import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireSession } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireSession();

  return (
    <div className="container-shell grid gap-6 py-6 xl:grid-cols-[280px_1fr]">
      <AdminSidebar session={session} />
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
}
