
"use client";

import type { Stock } from "@/lib/market-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { StrategySuggestions } from "./strategy-suggestions";

type StockDetailProps = {
  stock: Stock;
};

const chartConfig = {
  close: {
    label: "Close Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const CustomTooltipCursor = (props: any) => {
    const { payload, ...rest } = props;
    return <div {...rest} className="bg-muted/50 h-full w-full" />;
};


export function StockDetail({ stock }: StockDetailProps) {
    const reversedHistoricalData = stock.historicalData ? [...stock.historicalData].reverse() : [];
    
    const isPositiveChange = (stock.dayChange?.value ?? 0) >= 0;

  return (
    <div className="container mx-auto max-w-7xl py-10 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-bold">{stock.companyName}</h1>
            <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="text-lg">{stock.symbol}</Badge>
                <p className="text-muted-foreground text-lg">{stock.sector}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-4xl font-bold">₹{stock.currentPrice.toFixed(2)}</p>
            <div className={cn("flex items-center justify-end text-lg", isPositiveChange ? "text-[hsl(var(--chart-2))]" : "text-[hsl(var(--destructive))]")}>
                {isPositiveChange ? <ArrowUp className="h-5 w-5"/> : <ArrowDown className="h-5 w-5"/>}
                <span className="font-semibold ml-1">{stock.dayChange?.value.toFixed(2)} ({stock.dayChange?.percentage.toFixed(2)}%)</span>
            </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={reversedHistoricalData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -10,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="fillClose" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                     <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { year: '2-digit', month: 'short' })}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{stroke: 'hsl(var(--border))'}}
                    />
                  <YAxis 
                    domain={['dataMin - (dataMax-dataMin)*0.1', 'dataMax + (dataMax-dataMin)*0.1']}
                    tickFormatter={(value) => `₹${Number(value).toFixed(0)}`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{stroke: 'hsl(var(--border))'}}
                    />
                  <Tooltip
                    cursor={<CustomTooltipCursor />}
                    content={<ChartTooltipContent
                        indicator="dot"
                        labelFormatter={(value, payload) => {
                            return new Date(payload?.[0]?.payload.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                        }}
                        formatter={(value, name) => [`₹${Number(value).toFixed(2)}`, 'Close']}
                    />}
                    wrapperClassName="bg-background/80 backdrop-blur-sm rounded-lg border border-border"
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="hsl(var(--primary))"
                    fill="url(#fillClose)"
                    strokeWidth={2}
                    filter="url(#glow)"
                    activeDot={{
                      r: 6,
                      style: { fill: "hsl(var(--primary))", stroke: "hsl(var(--primary))" },
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <StrategySuggestions stock={stock} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <Card>
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-xl font-bold">₹{(stock.marketCap / 1000000).toFixed(2)}T</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">P/E Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-xl font-bold">{stock.peRatio.toFixed(2)}</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Div. Yield</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-xl font-bold">{stock.dividendYield.toFixed(2)}%</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">52-Wk High</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-xl font-bold">₹{stock["52WeekHigh"].toFixed(2)}</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">52-Wk Low</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-xl font-bold">₹{stock["52WeekLow"].toFixed(2)}</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{((stock.historicalData?.[0].volume ?? 0) / 1_000_000).toFixed(2)}M</p>
              </CardContent>
          </Card>
      </div>

    </div>
  );
}
