import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <Card className="rounded-[28px]">
      <CardContent className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
        <p className="mt-3 text-4xl text-white">{value}</p>
        <p className="mt-3 text-sm leading-7 text-zinc-300">{hint}</p>
      </CardContent>
    </Card>
  );
}
