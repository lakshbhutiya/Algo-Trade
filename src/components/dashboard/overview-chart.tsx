"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";


const data = [
  { date: "Jan", value: 4000 },
  { date: "Feb", value: 3000 },
  { date: "Mar", value: 5000 },
  { date: "Apr", value: 4500 },
  { date: "May", value: 6000 },
  { date: "Jun", value: 5500 },
  { date: "Jul", value: 7000 },
  { date: "Aug", value: 6500 },
  { date: "Sep", value: 7200 },
  { date: "Oct", value: 8000 },
  { date: "Nov", value: 7800 },
  { date: "Dec", value: 9000 },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function OverviewChart() {
  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 2, strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
              wrapperClassName="bg-background/80 backdrop-blur-sm rounded-lg border border-border"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{
                  r: 6,
                  style: { fill: "hsl(var(--primary))", opacity: 0.25 },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
