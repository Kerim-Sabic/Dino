import { UserRole } from "@prisma/client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getAdminUsers } from "@/lib/admin-data";
import { upsertAdminUserAction } from "@/lib/actions/admin";
import { requireSession } from "@/lib/auth";
import { canManageSensitiveSettings } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await requireSession();
  if (!canManageSensitiveSettings(session.role)) redirect("/admin");
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Postavke i korisnici"
        description="Upravljanje internim pristupom, aktivnim admin korisnicima i njihovim rolama."
      />

      <Card className="rounded-[30px]">
        <CardContent className="p-6">
          <h2 className="text-3xl text-white">Novi admin korisnik</h2>
          <form action={upsertAdminUserAction} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Ime</Label>
              <Input name="name" />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input name="email" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Lozinka</Label>
              <Input name="password" type="password" />
            </div>
            <div className="space-y-2">
              <Label>Rola</Label>
              <Select
                name="role"
                defaultValue={UserRole.EDITOR}
                options={[
                  { label: "Super Admin", value: UserRole.SUPER_ADMIN },
                  { label: "Admin", value: UserRole.ADMIN },
                  { label: "Editor", value: UserRole.EDITOR },
                ]}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-300 sm:col-span-2">
              <input type="checkbox" name="isActive" defaultChecked />
              Aktivan korisnik
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Dodaj korisnika</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[30px]">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-3xl text-white">Postojeći korisnici</h2>
          {users.map((user) => (
            <form key={user.id} action={upsertAdminUserAction} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 space-y-3">
              <input type="hidden" name="id" value={user.id} />
              <div className="grid gap-3 sm:grid-cols-3">
                <Input name="name" defaultValue={user.name} />
                <Input name="email" type="email" defaultValue={user.email} />
                <Select
                  name="role"
                  defaultValue={user.role}
                  options={[
                    { label: "Super Admin", value: UserRole.SUPER_ADMIN },
                    { label: "Admin", value: UserRole.ADMIN },
                    { label: "Editor", value: UserRole.EDITOR },
                  ]}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input name="password" type="password" placeholder="Nova lozinka ili ostavi prazno" />
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input type="checkbox" name="isActive" defaultChecked={user.isActive} />
                  Aktivno
                </label>
              </div>
              <Button type="submit" variant="secondary">Sačuvaj korisnika</Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
