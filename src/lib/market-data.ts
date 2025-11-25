export type HistoricalData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type DayChange = {
  value: number;
  percentage: number;
};

export type Stock = {
  symbol: string;
  companyName: string;
  sector?: string | null;
  currentPrice?: number | null;
  dayChange?: DayChange | null;
  week52High?: number | null;
  week52Low?: number | null;
  marketCap?: number | null;
  peRatio?: number | null;
  dividendYield?: number | null;
  parameters?: string | null;
  ohlc?: {
    open?: number | null;
    high?: number | null;
    low?: number | null;
    close?: number | null;
  };
  historicalData?: HistoricalData[];
};

export const NIFTY50_SYMBOLS = [
  "RELIANCE",
  "HDFCBANK",
  "INFY",
  "ICICIBANK",
  "TCS",
  "BHARTIARTL",
  "ITC",
  "SBIN",
  "LICI",
  "HINDUNILVR",
  "BAJFINANCE",
  "LT",
  "AXISBANK",
  "KOTAKBANK",
  "MARUTI",
  "SUNPHARMA",
  "ADANIENT",
  "TITAN",
  "ASIANPAINT",
  "TATAMOTORS",
  "NTPC",
  "ULTRACEMCO",
  "WIPRO",
  "POWERGRID",
  "NESTLEIND",
  "BAJAJFINSV",
  "HCLTECH",
  "M&M",
  "JSWSTEEL",
  "TATASTEEL",
  "COALINDIA",
  "INDUSINDBK",
  "ADANIPORTS",
  "HINDALCO",
  "GRASIM",
  "DRREDDY",
  "CIPLA",
  "TECHM",
  "BRITANNIA",
  "EICHERMOT",
  "ONGC",
  "BAJAJ-AUTO",
  "APOLLOHOSP",
  "DIVISLAB",
  "BPCL",
  "HEROMOTOCO",
  "TATACONSUM",
  "SHREECEM",
  "UPL",
] as const;

export type SupportedSymbol = (typeof NIFTY50_SYMBOLS)[number];

export const NO_DATA_STOCK: Stock = {
  symbol: "",
  companyName: "",
  currentPrice: null,
  dayChange: null,
  week52High: null,
  week52Low: null,
  marketCap: null,
  peRatio: null,
  dividendYield: null,
};

