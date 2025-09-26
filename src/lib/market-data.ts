export type HistoricalData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Stock = {
  symbol: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  dayChange?: {
    value: number;
    percentage: number;
  };
  "52WeekHigh": number;
  "52WeekLow": number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  historicalData?: HistoricalData[];
};

export const stockData: Stock[] = [
  {
    "symbol": "RELIANCE",
    "companyName": "Reliance Industries Ltd.",
    "sector": "Oil & Gas",
    "currentPrice": 2950.75,
    "dayChange": {
      "value": 15.20,
      "percentage": 0.52
    },
    "52WeekHigh": 3100.00,
    "52WeekLow": 2250.45,
    "marketCap": 2000000,
    "peRatio": 28.5,
    "dividendYield": 0.35,
    "historicalData": [
      { "date": "2025-09-25", "open": 2935.55, "high": 2960.10, "low": 2930.00, "close": 2950.75, "volume": 5800000 },
      { "date": "2025-09-24", "open": 2940.10, "high": 2945.50, "low": 2930.20, "close": 2935.55, "volume": 6100000 },
      { "date": "2020-09-26", "open": 1350.00, "high": 1355.75, "low": 1342.50, "close": 1348.20, "volume": 8500000 }
    ]
  },
  {
    "symbol": "HDFCBANK",
    "companyName": "HDFC Bank Ltd.",
    "sector": "Financial Services",
    "currentPrice": 1680.40,
    "dayChange": {
      "value": -5.10,
      "percentage": -0.30
    },
    "52WeekHigh": 1750.00,
    "52WeekLow": 1450.80,
    "marketCap": 1280000,
    "peRatio": 19.8,
    "dividendYield": 1.15,
    "historicalData": [
      { "date": "2025-09-25", "open": 1685.50, "high": 1690.00, "low": 1678.20, "close": 1680.40, "volume": 9500000 },
      { "date": "2025-09-24", "open": 1682.00, "high": 1688.30, "low": 1680.10, "close": 1685.50, "volume": 8900000 },
      { "date": "2020-09-26", "open": 1080.15, "high": 1085.00, "low": 1075.40, "close": 1082.90, "volume": 12000000 }
    ]
  },
  {
    "symbol": "INFY",
    "companyName": "Infosys Ltd.",
    "sector": "IT - Software",
    "currentPrice": 1550.25,
    "dayChange": {
      "value": 20.70,
      "percentage": 1.35
    },
    "52WeekHigh": 1700.50,
    "52WeekLow": 1300.00,
    "marketCap": 650000,
    "peRatio": 25.1,
    "dividendYield": 2.10,
    "historicalData": [
      { "date": "2025-09-25", "open": 1530.00, "high": 1555.80, "low": 1528.50, "close": 1550.25, "volume": 7200000 },
      { "date": "2020-09-26", "open": 980.40, "high": 990.00, "low": 978.60, "close": 988.75, "volume": 9800000 }
    ]
  },
  { "symbol": "ICICIBANK", "companyName": "ICICI Bank Ltd.", "sector": "Financial Services", "currentPrice": 995.60, "marketCap": 700000, "peRatio": 18.2, "dividendYield": 0.80, "52WeekHigh": 1200, "52WeekLow": 800, dayChange: { value: 10, percentage: 1.01 } },
  { "symbol": "TCS", "companyName": "Tata Consultancy Services Ltd.", "sector": "IT - Software", "currentPrice": 3850.10, "marketCap": 1400000, "peRatio": 30.5, "dividendYield": 1.20, "52WeekHigh": 4000, "52WeekLow": 3000, dayChange: { value: -20, percentage: -0.52 } },
  { "symbol": "BHARTIARTL", "companyName": "Bharti Airtel Ltd.", "sector": "Telecommunication", "currentPrice": 1050.45, "marketCap": 600000, "peRatio": 60.1, "dividendYield": 0.40, "52WeekHigh": 1200, "52WeekLow": 700, dayChange: { value: 5, percentage: 0.48 } },
  { "symbol": "ITC", "companyName": "ITC Ltd.", "sector": "FMCG - Tobacco", "currentPrice": 440.80, "marketCap": 550000, "peRatio": 26.3, "dividendYield": 2.80, "52WeekHigh": 500, "52WeekLow": 400, dayChange: { value: 2, percentage: 0.45 } },
  { "symbol": "SBIN", "companyName": "State Bank of India", "sector": "Financial Services", "currentPrice": 610.20, "marketCap": 545000, "peRatio": 10.1, "dividendYield": 1.85, "52WeekHigh": 700, "52WeekLow": 500, dayChange: { value: -3, percentage: -0.49 } },
  { "symbol": "LICI", "companyName": "Life Insurance Corporation of India", "sector": "Insurance", "currentPrice": 670.00, "marketCap": 425000, "peRatio": 15.5, "dividendYield": 0.50, "52WeekHigh": 800, "52WeekLow": 600, dayChange: { value: 1, percentage: 0.15 } },
  { "symbol": "HINDUNILVR", "companyName": "Hindustan Unilever Ltd.", "sector": "FMCG", "currentPrice": 2550.90, "marketCap": 600000, "peRatio": 56.8, "dividendYield": 1.50, "52WeekHigh": 2800, "52WeekLow": 2200, dayChange: { value: 12, percentage: 0.47 } },
  { "symbol": "BAJFINANCE", "companyName": "Bajaj Finance Ltd.", "sector": "Financial Services", "currentPrice": 7500.50, "marketCap": 450000, "peRatio": 35.2, "dividendYield": 0.40, "52WeekHigh": 8000, "52WeekLow": 6000, dayChange: { value: 50, percentage: 0.67 } },
  { "symbol": "LT", "companyName": "Larsen & Toubro Ltd.", "sector": "Construction", "currentPrice": 2980.00, "marketCap": 415000, "peRatio": 30.1, "dividendYield": 1.00, "52WeekHigh": 3200, "52WeekLow": 2500, dayChange: { value: -10, percentage: -0.33 } },
  { "symbol": "AXISBANK", "companyName": "Axis Bank Ltd.", "sector": "Financial Services", "currentPrice": 1020.70, "marketCap": 315000, "peRatio": 15.6, "dividendYield": 0.10, "52WeekHigh": 1100, "52WeekLow": 900, dayChange: { value: 8, percentage: 0.79 } },
  { "symbol": "KOTAKBANK", "companyName": "Kotak Mahindra Bank Ltd.", "sector": "Financial Services", "currentPrice": 1850.30, "marketCap": 368000, "peRatio": 20.3, "dividendYield": 0.75, "52WeekHigh": 2000, "52WeekLow": 1600, dayChange: { value: -5, percentage: -0.27 } },
  { "symbol": "MARUTI", "companyName": "Maruti Suzuki India Ltd.", "sector": "Automobile", "currentPrice": 10600.00, "marketCap": 320000, "peRatio": 32.4, "dividendYield": 0.85, "52WeekHigh": 11000, "52WeekLow": 9000, dayChange: { value: 100, percentage: 0.95 } },
  { "symbol": "SUNPHARMA", "companyName": "Sun Pharmaceutical Industries Ltd.", "sector": "Pharmaceuticals", "currentPrice": 1150.80, "marketCap": 275000, "peRatio": 34.9, "dividendYield": 0.95, "52WeekHigh": 1200, "52WeekLow": 1000, dayChange: { value: 15, percentage: 1.32 } },
  { "symbol": "ADANIENT", "companyName": "Adani Enterprises Ltd.", "sector": "Metals & Mining", "currentPrice": 2500.20, "marketCap": 285000, "peRatio": 101.5, "dividendYield": 0.05, "52WeekHigh": 3000, "52WeekLow": 2000, dayChange: { value: -25, percentage: -0.99 } },
  { "symbol": "TITAN", "companyName": "Titan Company Ltd.", "sector": "Consumer Durables", "currentPrice": 3300.60, "marketCap": 293000, "peRatio": 88.2, "dividendYield": 0.30, "52WeekHigh": 3500, "52WeekLow": 3000, dayChange: { value: 30, percentage: 0.92 } },
  { "symbol": "ASIANPAINT", "companyName": "Asian Paints Ltd.", "sector": "Chemicals", "currentPrice": 3200.40, "marketCap": 307000, "peRatio": 65.7, "dividendYield": 0.70, "52WeekHigh": 3500, "52WeekLow": 2800, dayChange: { value: 20, percentage: 0.63 } },
  { "symbol": "TATAMOTORS", "companyName": "Tata Motors Ltd.", "sector": "Automobile", "currentPrice": 640.15, "marketCap": 213000, "peRatio": 18.1, "dividendYield": 0.00, "52WeekHigh": 700, "52WeekLow": 500, dayChange: { value: -5, percentage: -0.78 } },
  { "symbol": "NTPC", "companyName": "NTPC Ltd.", "sector": "Power", "currentPrice": 240.50, "marketCap": 233000, "peRatio": 11.3, "dividendYield": 3.10, "52WeekHigh": 260, "52WeekLow": 200, dayChange: { value: 1, percentage: 0.42 } },
  { "symbol": "ULTRACEMCO", "companyName": "UltraTech Cement Ltd.", "sector": "Cement", "currentPrice": 8500.00, "marketCap": 245000, "peRatio": 38.6, "dividendYield": 0.45, "52WeekHigh": 9000, "52WeekLow": 7000, dayChange: { value: 50, percentage: 0.59 } },
  { "symbol": "WIPRO", "companyName": "Wipro Ltd.", "sector": "IT - Software", "currentPrice": 420.75, "marketCap": 220000, "peRatio": 20.9, "dividendYield": 1.40, "52WeekHigh": 450, "52WeekLow": 350, dayChange: { value: 2, percentage: 0.48 } },
  { "symbol": "POWERGRID", "companyName": "Power Grid Corporation of India Ltd.", "sector": "Power", "currentPrice": 205.90, "marketCap": 191000, "peRatio": 10.2, "dividendYield": 4.80, "52WeekHigh": 220, "52WeekLow": 180, dayChange: { value: -1, percentage: -0.48 } },
  { "symbol": "NESTLEIND", "companyName": "Nestle India Ltd.", "sector": "FMCG", "currentPrice": 22000.50, "marketCap": 212000, "peRatio": 75.3, "dividendYield": 1.25, "52WeekHigh": 24000, "52WeekLow": 20000, dayChange: { value: 100, percentage: 0.46 } },
  { "symbol": "BAJAJFINSV", "companyName": "Bajaj Finserv Ltd.", "sector": "Financial Services", "currentPrice": 1530.00, "marketCap": 243000, "peRatio": 32.7, "dividendYield": 0.05, "52WeekHigh": 1700, "52WeekLow": 1300, dayChange: { value: 10, percentage: 0.66 } },
  { "symbol": "HCLTECH", "companyName": "HCL Technologies Ltd.", "sector": "IT - Software", "currentPrice": 1280.90, "marketCap": 348000, "peRatio": 22.4, "dividendYield": 3.75, "52WeekHigh": 1400, "52WeekLow": 1000, dayChange: { value: 20, percentage: 1.58 } },
  { "symbol": "M&M", "companyName": "Mahindra & Mahindra Ltd.", "sector": "Automobile", "currentPrice": 1600.25, "marketCap": 199000, "peRatio": 17.8, "dividendYield": 1.00, "52WeekHigh": 1700, "52WeekLow": 1300, dayChange: { value: -15, percentage: -0.93 } },
  { "symbol": "JSWSTEEL", "companyName": "JSW Steel Ltd.", "sector": "Metals & Mining", "currentPrice": 820.50, "marketCap": 200000, "peRatio": 15.9, "dividendYield": 1.50, "52WeekHigh": 900, "52WeekLow": 700, dayChange: { value: 10, percentage: 1.23 } },
  { "symbol": "TATASTEEL", "companyName": "Tata Steel Ltd.", "sector": "Metals & Mining", "currentPrice": 130.40, "marketCap": 162000, "peRatio": -50.0, "dividendYield": 2.75, "52WeekHigh": 150, "52WeekLow": 100, dayChange: { value: -2, percentage: -1.51 } },
  { "symbol": "COALINDIA", "companyName": "Coal India Ltd.", "sector": "Metals & Mining", "currentPrice": 300.10, "marketCap": 185000, "peRatio": 7.1, "dividendYield": 8.00, "52WeekHigh": 350, "52WeekLow": 250, dayChange: { value: 3, percentage: 1.01 } },
  { "symbol": "INDUSINDBK", "companyName": "IndusInd Bank Ltd.", "sector": "Financial Services", "currentPrice": 1450.65, "marketCap": 113000, "peRatio": 13.4, "dividendYield": 1.10, "52WeekHigh": 1600, "52WeekLow": 1200, dayChange: { value: 5, percentage: 0.35 } },
  { "symbol": "ADANIPORTS", "companyName": "Adani Ports and Special Economic Zone Ltd.", "sector": "Services", "currentPrice": 810.00, "marketCap": 175000, "peRatio": 33.1, "dividendYield": 0.60, "52WeekHigh": 900, "52WeekLow": 700, dayChange: { value: -10, percentage: -1.22 } },
  { "symbol": "HINDALCO", "companyName": "Hindalco Industries Ltd.", "sector": "Metals & Mining", "currentPrice": 480.25, "marketCap": 108000, "peRatio": 10.5, "dividendYield": 2.70, "52WeekHigh": 550, "52WeekLow": 400, dayChange: { value: 5, percentage: 1.05 } },
  { "symbol": "GRASIM", "companyName": "Grasim Industries Ltd.", "sector": "Cement", "currentPrice": 1950.80, "marketCap": 128000, "peRatio": 18.3, "dividendYield": 2.05, "52WeekHigh": 2100, "52WeekLow": 1700, dayChange: { value: -20, percentage: -1.01 } },
  { "symbol": "DRREDDY", "companyName": "Dr. Reddy's Laboratories Ltd.", "sector": "Pharmaceuticals", "currentPrice": 5600.40, "marketCap": 93000, "peRatio": 24.6, "dividendYield": 0.70, "52WeekHigh": 6000, "52WeekLow": 5000, dayChange: { value: 40, percentage: 0.72 } },
  { "symbol": "CIPLA", "companyName": "Cipla Ltd.", "sector": "Pharmaceuticals", "currentPrice": 1250.10, "marketCap": 101000, "peRatio": 28.9, "dividendYield": 0.70, "52WeekHigh": 1300, "52WeekLow": 1000, dayChange: { value: 10, percentage: 0.81 } },
  { "symbol": "TECHM", "companyName": "Tech Mahindra Ltd.", "sector": "IT - Software", "currentPrice": 1270.70, "marketCap": 124000, "peRatio": 25.8, "dividendYield": 3.50, "52WeekHigh": 1400, "52WeekLow": 1100, dayChange: { value: 15, percentage: 1.19 } },
  { "symbol": "BRITANNIA", "companyName": "Britannia Industries Ltd.", "sector": "FMCG", "currentPrice": 4700.00, "marketCap": 113000, "peRatio": 60.2, "dividendYield": 1.50, "52WeekHigh": 5000, "52WeekLow": 4000, dayChange: { value: -50, percentage: -1.05 } },
  { "symbol": "EICHERMOT", "companyName": "Eicher Motors Ltd.", "sector": "Automobile", "currentPrice": 3450.90, "marketCap": 94000, "peRatio": 35.1, "dividendYield": 1.05, "52WeekHigh": 3800, "52WeekLow": 3000, dayChange: { value: 30, percentage: 0.88 } },
  { "symbol": "ONGC", "companyName": "Oil & Natural Gas Corporation Ltd.", "sector": "Oil & Gas", "currentPrice": 190.15, "marketCap": 239000, "peRatio": 6.5, "dividendYield": 5.90, "52WeekHigh": 220, "52WeekLow": 150, dayChange: { value: 2, percentage: 1.06 } },
  { "symbol": "BAJAJ-AUTO", "companyName": "Bajaj Auto Ltd.", "sector": "Automobile", "currentPrice": 5100.80, "marketCap": 145000, "peRatio": 21.7, "dividendYield": 2.75, "52WeekHigh": 5500, "52WeekLow": 4500, dayChange: { value: -80, percentage: -1.54 } },
  { "symbol": "APOLLOHOSP", "companyName": "Apollo Hospitals Enterprise Ltd.", "sector": "Healthcare", "currentPrice": 5400.20, "marketCap": 77000, "peRatio": 80.4, "dividendYield": 0.20, "52WeekHigh": 6000, "52WeekLow": 5000, dayChange: { value: 50, percentage: 0.93 } },
  { "symbol": "DIVISLAB", "companyName": "Divi's Laboratories Ltd.", "sector": "Pharmaceuticals", "currentPrice": 3750.50, "marketCap": 100000, "peRatio": 65.1, "dividendYield": 0.80, "52WeekHigh": 4000, "52WeekLow": 3500, dayChange: { value: 25, percentage: 0.67 } },
  { "symbol": "BPCL", "companyName": "Bharat Petroleum Corporation Ltd.", "sector": "Oil & Gas", "currentPrice": 360.70, "marketCap": 78000, "peRatio": 4.1, "dividendYield": 1.10, "52WeekHigh": 400, "52WeekLow": 300, dayChange: { value: -3, percentage: -0.83 } },
  { "symbol": "HEROMOTOCO", "companyName": "Hero MotoCorp Ltd.", "sector": "Automobile", "currentPrice": 3100.00, "marketCap": 62000, "peRatio": 20.3, "dividendYield": 3.20, "52WeekHigh": 3300, "52WeekLow": 2800, dayChange: { value: 20, percentage: 0.65 } },
  { "symbol": "TATACONSUM", "companyName": "Tata Consumer Products Ltd.", "sector": "FMCG", "currentPrice": 880.45, "marketCap": 82000, "peRatio": 85.9, "dividendYield": 0.95, "52WeekHigh": 950, "52WeekLow": 750, dayChange: { value: -5, percentage: -0.56 } },
  { "symbol": "SHREECEM", "companyName": "Shree Cement Ltd.", "sector": "Cement", "currentPrice": 25500.00, "marketCap": 92000, "peRatio": 50.1, "dividendYield": 0.40, "52WeekHigh": 28000, "52WeekLow": 22000, dayChange: { value: 200, percentage: 0.79 } },
  { "symbol": "UPL", "companyName": "UPL Ltd.", "sector": "Chemicals", "currentPrice": 650.30, "marketCap": 49000, "peRatio": 12.5, "dividendYield": 1.50, "52WeekHigh": 700, "52WeekLow": 600, dayChange: { value: -10, percentage: -1.51 } }
]
