"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "border border-white/10 bg-zinc-950/95 text-zinc-50 shadow-2xl shadow-black/40",
          title: "text-sm font-semibold",
          description: "text-sm text-zinc-300",
        },
      }}
    />
  );
}
