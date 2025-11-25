
// "use client"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// export function PositionsTable() {
//   return (
//     <div className="w-full overflow-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Symbol</TableHead>
//             <TableHead>Type</TableHead>
//             <TableHead className="text-right">P/L (₹)</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           <TableRow>
//             <TableCell colSpan={3}>
//               <div className="text-center text-muted-foreground py-6">
//                 No live positions available. Connect your Groww trading account to
//                 see realtime holdings and P/L updates.
//               </div>
//             </TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </div>
//   );
// }



"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Position } from "./types";

interface PositionsTableProps {
  // Make optional just in case, or keep required but default it below
  positions?: Position[]; 
}

// FIX: Add "positions = []" here
export function PositionsTable({ positions = [] }: PositionsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Avg Price</TableHead>
            <TableHead className="text-right">LTP</TableHead>
            <TableHead className="text-right">Current Value</TableHead>
            <TableHead className="text-right">P/L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Now this won't crash because positions is always at least [] */}
          {positions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No active positions found.
              </TableCell>
            </TableRow>
          ) : (
            positions.map((pos) => (
              <TableRow key={pos.id}>
                <TableCell>
                  <div className="font-medium">{pos.symbol}</div>
                  <div className="text-xs text-muted-foreground">{pos.name}</div>
                </TableCell>
                <TableCell className="text-right">{pos.quantity}</TableCell>
                <TableCell className="text-right">₹{pos.avgPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">₹{pos.currentPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium">
                  ₹{pos.currentValue.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-2 ${pos.pl >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <span>
                      {pos.pl >= 0 ? "+" : ""}
                      {pos.pl.toLocaleString("en-IN")}
                    </span>
                    <Badge variant={pos.pl >= 0 ? "default" : "destructive"} className="text-[10px] px-1 py-0 h-5">
                      {pos.plPercentage.toFixed(2)}%
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}