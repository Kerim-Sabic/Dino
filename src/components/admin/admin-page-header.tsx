interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.22em] text-primary">Interni sistem</p>
      <h1 className="text-5xl leading-none text-white">{title}</h1>
      <p className="max-w-3xl text-sm leading-8 text-zinc-300">{description}</p>
    </div>
  );
}
