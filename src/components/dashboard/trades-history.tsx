import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const trades = [
  { id: "T001", symbol: "NVDA", type: "Buy", quantity: 10, price: 450.75, time: "2023-10-26 10:05:15" },
  { id: "T002", symbol: "MSFT", type: "Sell", quantity: 20, price: 330.10, time: "2023-10-26 09:45:30" },
  { id: "T003", symbol: "AAPL", type: "Buy", quantity: 50, price: 174.90, time: "2023-10-26 09:30:00" },
  { id: "T004", symbol: "GOOG", type: "Sell", quantity: 15, price: 140.50, time: "2023-10-25 15:30:45" },
  { id: "T005", symbol: "TSLA", type: "Cover", quantity: 100, price: 249.50, time: "2023-10-25 14:00:00" },
  { id: "T006", symbol: "AMZN", type: "Buy", quantity: 30, price: 129.80, time: "2023-10-25 11:00:10" },

];

export function TradesHistory() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell className="font-medium">{trade.symbol}</TableCell>
            <TableCell>
              <Badge variant="outline" className={trade.type === "Buy" || trade.type === "Cover" ? "text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]" : "text-destructive border-destructive"}>
                {trade.type}
              </Badge>
            </TableCell>
            <TableCell>{trade.quantity}</TableCell>
            <TableCell className="font-mono">${trade.price.toFixed(2)}</TableCell>
            <TableCell className="text-right text-muted-foreground">{trade.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
