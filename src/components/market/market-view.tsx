"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { Stock } from "@/lib/market-data";
import { cn } from "@/lib/utils";

export function MarketView({ stocks }: { stocks: Stock[] }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-7xl py-10">
      <h1 className="text-3xl font-bold mb-6">Indian Stock Market (Nifty 50)</h1>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by symbol or company name (e.g., RELIANCE)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10"
        />
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {filteredStocks.map((stock) => (
          <motion.div
            key={stock.symbol}
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
            className="cursor-pointer"
            onClick={() => router.push(`/market/${stock.symbol}`)}
          >
            <Card className="h-full hover:border-primary transition-colors duration-300 shadow-sm hover:shadow-primary/20 hover:shadow-lg">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                    <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">{stock.symbol}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-[150px]">{stock.companyName}</p>
                    </div>
                    <div
                        className={cn(
                        "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
                        (stock.dayChange?.value ?? 0) >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}
                    >
                        {(stock.dayChange?.value ?? 0) >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {stock.dayChange?.percentage.toFixed(2)}%
                    </div>
                    </div>
                </div>
                <div className="mt-4 text-right">
                  <p className="text-2xl font-bold">₹{stock.currentPrice.toFixed(2)}</p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      (stock.dayChange?.value ?? 0) >= 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {(stock.dayChange?.value ?? 0) >= 0 ? "+" : ""}
                    {stock.dayChange?.value.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {filteredStocks.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No stocks found for "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
}
