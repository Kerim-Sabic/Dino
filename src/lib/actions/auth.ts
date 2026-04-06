"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, loginAdmin } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect(`/admin/prijava?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Neispravan unos.")}`);
  }

  try {
    const user = await loginAdmin(parsed.data.email, parsed.data.password);

    if (!user) {
      redirect("/admin/prijava?error=Neispravni+podaci+za+prijavu.");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "DATABASE_NOT_CONFIGURED") {
      redirect("/admin/prijava?error=Baza+jo%C5%A1+nije+konfigurirana.");
    }

    throw error;
  }

  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/prijava");
}
