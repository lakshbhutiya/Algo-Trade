"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";

const tradesBySymbol = {
  "RELIANCE": [
    { id: "T001", type: "Buy", quantity: 50, price: 2850.50, time: "2024-07-29 10:15:30" },
    { id: "T002", type: "Sell", quantity: 20, price: 2875.00, time: "2024-07-29 14:02:11" },
    { id: "T003", type: "Buy", quantity: 100, price: 2860.10, time: "2024-07-28 09:30:00" },
  ],
  "TCS": [
    { id: "T004", type: "Buy", quantity: 30, price: 3800.75, time: "2024-07-29 11:05:15" },
    { id: "T005", type: "Sell", quantity: 30, price: 3825.20, time: "2024-07-29 15:00:05" },
  ],
  "HDFCBANK": [
    { id: "T006", type: "Sell", quantity: 100, price: 1680.90, time: "2024-07-28 12:45:00" },
    { id: "T007", type: "Buy", quantity: 50, price: 1670.00, time: "2024-07-27 10:00:45" },
    { id: "T008", type: "Buy", quantity: 50, price: 1665.50, time: "2024-07-27 09:35:10" },
  ],
  "INFY": [
    { id: "T009", type: "Buy", quantity: 70, price: 1630.00, time: "2024-07-26 13:20:00" },
  ],
  "ICICIBANK": [
    { id: "T010", type: "Sell", quantity: 200, price: 1150.80, time: "2024-07-29 10:05:15" },
    { id: "T011", type: "Buy", quantity: 100, price: 1145.00, time: "2024-07-28 14:30:20" },
  ]
};

type Trade = {
    id: string;
    type: string;
    quantity: number;
    price: number;
    time: string;
};

type TradesBySymbol = Record<string, Trade[]>;

export function TradesHistory() {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredSymbols = Object.keys(tradesBySymbol).filter((symbol) =>
    symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by stock symbol (e.g., RELIANCE)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10"
        />
      </div>
      <Accordion type="multiple" className="w-full">
        {filteredSymbols.map((symbol) => (
          <AccordionItem value={symbol} key={symbol}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex w-full items-center justify-between pr-4">
                  <span className="font-semibold text-lg">{symbol}</span>
                  <span className="text-sm text-muted-foreground">{tradesBySymbol[symbol].length} trades</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price (INR)</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradesBySymbol[symbol].map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            trade.type === "Buy"
                              ? "text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]"
                              : "text-destructive border-destructive"
                          }
                        >
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell className="font-mono">₹{trade.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {trade.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {filteredSymbols.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
              No trades found for "{searchTerm}".
          </div>
      )}
    </div>
  );
}
