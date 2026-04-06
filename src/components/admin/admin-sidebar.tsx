import Link from "next/link";
import { adminNavigation } from "@/lib/constants";
import type { SessionUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";
import { canManageContent, canManageOperations, canManageSensitiveSettings } from "@/lib/permissions";

interface AdminSidebarProps {
  session: SessionUser;
}

export function AdminSidebar({ session }: AdminSidebarProps) {
  const items = adminNavigation.filter((item) => {
    if (item.href === "/admin/leadovi" || item.href === "/admin/inventar" || item.href === "/admin/cijene") {
      return canManageOperations(session.role);
    }

    if (item.href === "/admin/postavke" || item.href === "/admin/revizija") {
      return canManageSensitiveSettings(session.role);
    }

    return canManageContent(session.role);
  });

  return (
    <aside className="surface-card flex h-full flex-col rounded-[30px] border border-white/10 p-5">
      <div className="border-b border-white/8 pb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Sarajevo Rezervacije OS</p>
        <h2 className="mt-3 text-3xl text-white">Admin</h2>
        <p className="mt-2 text-sm text-zinc-400">
          {session.name} · {session.role}
        </p>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <form action={logoutAction}>
        <Button className="mt-6 w-full" variant="secondary" type="submit">
          Odjava
        </Button>
      </form>
    </aside>
  );
}
