export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[linear-gradient(180deg,_#09080b_0%,_#121015_100%)]">{children}</div>;
}
