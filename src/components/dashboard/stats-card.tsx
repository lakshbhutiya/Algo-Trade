import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
  const isPositive = change.startsWith("+");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            isPositive ? "text-[hsl(var(--chart-2))]" : "text-destructive"
          }`}
        >
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
