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

// Select a few stocks to represent open positions
const positions = [
  stockData.find(s => s.symbol === 'RELIANCE'),
  stockData.find(s => s.symbol === 'TCS'),
  stockData.find(s => s.symbol === 'INFY'),
  stockData.find(s => s.symbol === 'HDFCBANK'),
  stockData.find(s => s.symbol === 'TATAMOTORS'),
].filter(Boolean).map(stock => ({
    symbol: stock!.symbol,
    pnl: (Math.random() - 0.4) * stock!.currentPrice * 0.1, // Random P&L
    type: Math.random() > 0.5 ? "Long" : "Short",
}));


export function PositionsTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">P/L</TableHead>
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
                {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
