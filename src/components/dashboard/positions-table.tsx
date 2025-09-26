
"use client"

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { stockData } from "@/lib/market-data";

type Position = {
  symbol: string;
  pnl: number;
  type: "Long" | "Short";
};

// Select a few stocks to represent open positions
const initialPositions = [
  stockData.find(s => s.symbol === 'RELIANCE'),
  stockData.find(s => s.symbol === 'TCS'),
  stockData.find(s => s.symbol === 'INFY'),
  stockData.find(s => s.symbol === 'HDFCBANK'),
  stockData.find(s => s.symbol === 'TATAMOTORS'),
].filter((stock): stock is NonNullable<typeof stock> => !!stock);


export function PositionsTable() {
  const [positions, setPositions] = React.useState<Position[]>([]);

  React.useEffect(() => {
    // Generate random data on the client-side to avoid hydration mismatch
    const generatedPositions = initialPositions.map(stock => ({
        symbol: stock.symbol,
        pnl: (Math.random() - 0.4) * stock.currentPrice * 0.1 * 100, // Random P&L in Rupees
        type: Math.random() > 0.5 ? "Long" : "Short",
    }));
    setPositions(generatedPositions);
  }, []);


  if (positions.length === 0) {
    return <div className="text-center text-muted-foreground p-4">Loading positions...</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">P/L (₹)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((pos) => (
            <TableRow key={pos.symbol}>
              <TableCell className="font-medium">{pos.symbol}</TableCell>
              <TableCell>
                <Badge variant="outline" className={pos.type === "Long" ? "text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))] bg-[hsl(var(--chart-2))]/10" : "text-[hsl(var(--chart-5))] border-[hsl(var(--chart-5))] bg-[hsl(var(--chart-5))]/10"}>
                  {pos.type}
                </Badge>
              </TableCell>
              <TableCell
                className={`text-right font-mono ${
                  pos.pnl >= 0 ? "text-[hsl(var(--chart-2))]" : "text-destructive"
                }`}
              >
                {pos.pnl >= 0 ? "+" : ""}₹{pos.pnl.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
