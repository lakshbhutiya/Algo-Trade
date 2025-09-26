import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const positions = [
  { symbol: "AAPL", quantity: 100, price: 175.2, value: 17520, pnl: 520.5, type: "Long" },
  { symbol: "GOOG", quantity: 50, price: 140.1, value: 7005, pnl: -150.2, type: "Long" },
  { symbol: "TSLA", quantity: 200, price: 250.8, value: 50160, pnl: 2300.0, type: "Short" },
  { symbol: "AMZN", quantity: 20, price: 130.5, value: 2610, pnl: 80.1, type: "Long" },
];

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
