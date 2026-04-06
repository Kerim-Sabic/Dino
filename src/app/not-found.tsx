import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-2xl rounded-[36px]">
        <CardContent className="p-10 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">404</p>
          <h1 className="mt-4 text-5xl text-white">Tražena stranica nije pronađena</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Vratite se na početnu, provjerite dostupne ulaznice ili pošaljite direktan zahtjev za rezervaciju.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">Početna</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/rezervacija">Rezervacija</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
