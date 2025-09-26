
"use client";

import {
  Area,
  AreaChart,
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
  { date: "Jan", value: 400000 },
  { date: "Feb", value: 300000 },
  { date: "Mar", value: 500000 },
  { date: "Apr", value: 450000 },
  { date: "May", value: 600000 },
  { date: "Jun", value: 550000 },
  { date: "Jul", value: 700000 },
  { date: "Aug", value: 650000 },
  { date: "Sep", value: 720000 },
  { date: "Oct", value: 800000 },
  { date: "Nov", value: 780000 },
  { date: "Dec", value: 900000 },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const CustomTooltipCursor = (props: any) => {
  const { payload, ...rest } = props;
  return <div {...rest} className="bg-muted/30 h-full w-full" />;
};


export function OverviewChart() {
  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{stroke: 'hsl(var(--border))'}}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{stroke: 'hsl(var(--border))'}}
              tickFormatter={(value) => `₹${Number(value) / 100000}L`}
            />
            <Tooltip
              cursor={<CustomTooltipCursor />}
              content={<ChartTooltipContent
                indicator="line"
                labelFormatter={(label, payload) => {
                    return payload?.[0]?.payload.date
                }}
                 formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Number(value))}
              />}
              wrapperClassName="bg-background/80 backdrop-blur-sm rounded-lg border border-border"
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#fillValue)"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                  r: 6,
                  style: { fill: "hsl(var(--primary))", opacity: 0.25 },
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
