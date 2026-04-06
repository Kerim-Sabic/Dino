import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions/auth";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-xl rounded-[36px]">
        <CardContent className="p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Admin prijava</p>
          <h1 className="mt-4 text-5xl text-white">Interni operativni sistem</h1>
          <p className="mt-4 text-sm leading-8 text-zinc-300">
            Zaštićeni pristup za CRM, inventar, cijene, sadržaj i audit logove.
          </p>

          <form action={loginAction} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="admin@dino-kosevo.ba" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <Button className="w-full" size="lg" type="submit">
              Prijava
            </Button>
          </form>

          <div className="mt-8 text-sm text-zinc-400">
            <Link href="/" className="text-primary transition hover:text-white">
              Nazad na javni sajt
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
