"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "./types";

interface TransactionsTableProps {
  transactions?: Transaction[];
}

// FIX: Add "transactions = []" here
export function TransactionsTable({ transactions = [] }: TransactionsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Safe check for length */}
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(txn.date).toLocaleDateString("en-IN")}
                </TableCell>
                <TableCell className="font-medium">{txn.symbol}</TableCell>
                <TableCell>
                  <span
                    className={`font-semibold ${
                      txn.type === "BUY" ? "text-blue-500" : "text-orange-500"
                    }`}
                  >
                    {txn.type}
                  </span>
                </TableCell>
                <TableCell className="text-right">{txn.quantity}</TableCell>
                <TableCell className="text-right">₹{txn.price.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-right font-medium">
                    ₹{txn.totalAmount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right">
                    <span className="text-xs text-muted-foreground capitalize">{txn.status.toLowerCase()}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}