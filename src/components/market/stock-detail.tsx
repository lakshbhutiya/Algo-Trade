"use client";

import type { Stock } from "@/lib/market-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
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

type StockDetailProps = {
  stock: Stock;
};

const chartConfig = {
  close: {
    label: "Close Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

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
            <div className={cn("flex items-center justify-end text-lg", isPositiveChange ? "text-green-500" : "text-red-500")}>
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
                <LineChart
                  data={reversedHistoricalData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                  <YAxis 
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => `₹${value}`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    wrapperClassName="bg-background/80 backdrop-blur-sm rounded-lg border border-border"
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <Card>
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-xl font-bold">₹{(stock.marketCap / 100).toFixed(2)}T</p>
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
      </div>

    </div>
  );
}
