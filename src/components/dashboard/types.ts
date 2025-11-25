// src/app/dashboard/types.ts

export type PortfolioMetric = {
    date: string;
    value: number;
  };
  
  export type Position = {
    id: string;
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    investedValue: number;
    currentValue: number;
    pl: number; // Profit/Loss value
    plPercentage: number;
  };
  
  export type Transaction = {
    id: string;
    date: string;
    symbol: string;
    type: "BUY" | "SELL";
    quantity: number;
    price: number;
    totalAmount: number;
    status: "SUCCESS" | "PENDING" | "FAILED";
  };