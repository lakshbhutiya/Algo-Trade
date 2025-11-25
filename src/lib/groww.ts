// "use server";

// import "server-only";

// import {
//   Exchange,
//   GrowwAPI,
//   LiveFeedSubscriptionType,
//   Segment,
// } from "growwapi";

// import type { HistoricalData, Stock } from "./market-data";
// import { NIFTY50_SYMBOLS } from "./market-data";
// import type { PortfolioMetric, Position } from "@/components/dashboard/types";

// type InstrumentMeta = {
//   symbol: string;
//   tradingSymbol: string;
//   name: string;
//   exchange: string;
//   exchangeToken?: string;
//   exchangeSymbol: string;
//   internalTradingSymbol?: string;
//   growwSymbol?: string;
// };

// type GrowwGlobals = typeof globalThis & {
//   __growwClient?: GrowwAPI;
//   __growwInstrumentCache?: Map<string, InstrumentMeta>;
//   __growwFeedPromise?: Promise<void>;
// };

// const globalWithGroww = globalThis as GrowwGlobals;
// const DEFAULT_EXCHANGE = Exchange.NSE;
// const DEFAULT_SEGMENT = Segment.CASH;

// function getGrowwClient(): GrowwAPI {
//   if (!globalWithGroww.__growwClient) {
//     globalWithGroww.__growwClient = new GrowwAPI();
//   }
//   return globalWithGroww.__growwClient;
// }

// function getInstrumentCache() {
//   if (!globalWithGroww.__growwInstrumentCache) {
//     globalWithGroww.__growwInstrumentCache = new Map<string, InstrumentMeta>();
//   }
//   return globalWithGroww.__growwInstrumentCache;
// }

// function buildExchangeSymbol(meta: InstrumentMeta) {
//   // STRICT FORMAT: NSE_RELIANCE (Underscore is required by API)
//   return `${meta.exchange}_${meta.tradingSymbol}`;
// }

// export async function getInstrumentMeta(symbol: string) {
//   const cache = getInstrumentCache();
//   if (cache.has(symbol)) {
//     return cache.get(symbol)!;
//   }

//   try {
//     const groww = getGrowwClient();
//     const [instruction] = await groww.instructions.getFilteredInstructions({
//       exchange: DEFAULT_EXCHANGE,
//       segment: DEFAULT_SEGMENT,
//       tradingSymbol: symbol,
//       instrumentType: "EQ",
//     });

//     if (!instruction) {
//       console.warn(`[Groww] No instrument found for ${symbol}`);
//       return null;
//     }

//     const inferredInternalSymbol =
//       instruction.internalTradingSymbol ??
//       (instruction.series && instruction.tradingSymbol
//         ? `${instruction.tradingSymbol}-${instruction.series}`
//         : instruction.tradingSymbol ?? symbol);

//     const meta: InstrumentMeta = {
//       symbol,
//       tradingSymbol: instruction.tradingSymbol ?? symbol,
//       name: instruction.name ?? symbol,
//       exchange: instruction.exchange ?? DEFAULT_EXCHANGE,
//       exchangeToken:
//         instruction.exchangeToken !== undefined && instruction.exchangeToken !== null
//           ? String(instruction.exchangeToken)
//           : undefined,
//       internalTradingSymbol: inferredInternalSymbol ?? undefined,
//       exchangeSymbol: instruction.exchange
//         ? `${instruction.exchange}:${inferredInternalSymbol}`
//         : `${DEFAULT_EXCHANGE}:${inferredInternalSymbol}`,
//       growwSymbol: instruction.growwSymbol ?? undefined,
//     };

//     cache.set(symbol, meta);
//     return meta;
//   } catch (error) {
//     console.error(`[Groww] Failed to fetch instrument for ${symbol}`, error);
//     return null;
//   }
// }

// function toHistoricalData(candle: number[]): HistoricalData | null {
//   if (!Array.isArray(candle) || candle.length < 6) return null;
//   const [timestamp, open, high, low, close, volume] = candle;

//   // FIX: Multiply by 1000 because API returns Seconds, but JS Date needs Milliseconds
//   // This resolves the issue where dates appeared as 1970
//   const date = new Date(Number(timestamp) * 1000);

//   if (Number.isNaN(date.getTime())) return null;
//   return {
//     date: date.toISOString(),
//     open,
//     high,
//     low,
//     close,
//     volume,
//   };
// }

// function toStock(meta: InstrumentMeta, price?: number | null): Stock {
//   return {
//     symbol: meta.symbol,
//     companyName: meta.name,
//     currentPrice: typeof price === "number" ? price : null,
//   };
// }

// // Helper to normalize the API response (unwrap payload, handle arrays)
// // This resolves the "missing current data" issue
// function normalizeResponse(response: any): Record<string, any> {
//   if (!response) return {};

//   // 1. Unwrap 'payload' or 'data' if present
//   let data = response;
//   if (response.payload) data = response.payload;
//   else if (response.data) data = response.data;

//   // 2. If it's an Array, try to convert to Map keyed by symbol
//   if (Array.isArray(data)) {
//     const map: Record<string, any> = {};
//     data.forEach((item) => {
//       // Try common fields for the key
//       const key = item.symbol || item.tradingSymbol || item.exchangeSymbol;
//       if (key) map[key] = item;
//     });
//     return map;
//   }

//   // 3. If it's already an object (Map), return it
//   if (typeof data === "object") {
//     return data;
//   }

//   return {};
// }

// async function buildSnapshots({
//   metas,
//   ltpMap,
//   ohlcMap,
// }: {
//   metas: InstrumentMeta[];
//   ltpMap: any;
//   ohlcMap: any;
// }): Promise<Stock[]> {
//   const cleanLtpMap = normalizeResponse(ltpMap);
//   const cleanOhlcMap = normalizeResponse(ohlcMap);

//   return metas.map((meta) => {
//     // Generate all possible key variations to safely find the data
//     const keysToCheck = [
//       `${meta.exchange}_${meta.tradingSymbol}`, // NSE_RELIANCE
//       `${meta.exchange}:${meta.tradingSymbol}`, // NSE:RELIANCE
//       meta.tradingSymbol,                       // RELIANCE
//       meta.symbol                               // User's symbol
//     ];

//     const getFromMap = (map: Record<string, any>) => {
//         for (const key of keysToCheck) {
//             if (map[key] !== undefined) return map[key];
//         }
//         return null;
//     };

//     const ltpData = getFromMap(cleanLtpMap);
//     const ohlcData = getFromMap(cleanOhlcMap);

//     // Robustly Extract Price
//     let currentPrice: number | null = null;
//     if (typeof ltpData === "number") {
//       currentPrice = ltpData;
//     } else if (typeof ltpData === "object" && ltpData !== null) {
//       currentPrice = ltpData.lastPrice ?? ltpData.ltp ?? ltpData.value ?? ltpData.price ?? null;
//     }

//     // Robustly Extract OHLC
//     const ohlc = ohlcData && typeof ohlcData === 'object' ? {
//         open: ohlcData.open ?? null,
//         high: ohlcData.high ?? null,
//         low: ohlcData.low ?? null,
//         close: ohlcData.close ?? ohlcData.prevClose ?? null
//     } : undefined;

//     const close = ohlc?.close ?? null;
//     const dayChange =
//       typeof currentPrice === "number" && typeof close === "number"
//         ? {
//             value: currentPrice - close,
//             percentage: close ? ((currentPrice - close) / close) * 100 : 0,
//           }
//         : null;

//     return {
//       ...toStock(meta, currentPrice),
//       ohlc,
//       dayChange,
//     };
//   });
// }

// export async function fetchMarketData(symbols: readonly string[] = NIFTY50_SYMBOLS) {
//   if (!symbols.length) return [];

//   try {
//     const metas = (
//       await Promise.all(
//         symbols.map(async (symbol) => await getInstrumentMeta(symbol))
//       )
//     ).filter((meta): meta is InstrumentMeta => Boolean(meta));

//     if (!metas.length) return [];

//     const exchangeSymbols = metas.map((meta) => buildExchangeSymbol(meta));
//     const groww = getGrowwClient();

//     const [ltpRaw, ohlcRaw] = await Promise.all([
//       groww.liveData.getLTP({
//         exchangeSymbols,
//         segment: DEFAULT_SEGMENT,
//       }),
//       groww.liveData.getOHLC({
//         exchangeSymbols,
//         segment: DEFAULT_SEGMENT,
//       }),
//     ]);

//     return await buildSnapshots({
//       metas,
//       ltpMap: ltpRaw,
//       ohlcMap: ohlcRaw,
//     });
//   } catch (error) {
//     console.error("[Groww] Failed to fetch market data", error);
//     return [];
//   }
// }

// export async function fetchStockDetail(symbolParam: string) {
//   const symbol = symbolParam.toUpperCase();
//   const meta = await getInstrumentMeta(symbol);
//   if (!meta) return null;

//   try {
//     const groww = getGrowwClient();
//     const [quote, history] = await Promise.all([
//       groww.liveData.getQuote({
//         exchange: DEFAULT_EXCHANGE,
//         segment: DEFAULT_SEGMENT,
//         tradingSymbol: meta.tradingSymbol,
//       }),
//       groww.historicData.get({
//         exchange: DEFAULT_EXCHANGE,
//         segment: DEFAULT_SEGMENT,
//         tradingSymbol: meta.tradingSymbol,
//         // FIX: Changed to 1440 (1 day) to support 1-year duration. 
//         // 15-min intervals are limited to ~90 days by the API.
//         intervalInMinutes: 1440,
//         // FIX: Set startTime to 1 year ago
//         startTime: Date.now() - 1000 * 60 * 60 * 24 * 365,
//         endTime: Date.now(),
//       }),
//     ]);

//     const historicalData =
//       history?.candles
//         ?.map(toHistoricalData)
//         .filter((candle): candle is HistoricalData => Boolean(candle)) ?? [];

//     return {
//       symbol: meta.symbol,
//       companyName: meta.name,
//       currentPrice: quote?.lastPrice ?? null,
//       dayChange: quote
//         ? {
//             value: quote.dayChange,
//             percentage: quote.dayChangePerc,
//           }
//         : null,
//       week52High: quote?.week52High ?? null,
//       week52Low: quote?.week52Low ?? null,
//       marketCap: quote?.marketCap ?? null,
//       ohlc: quote?.ohlc,
//       historicalData,
//     } satisfies Stock;
//   } catch (error) {
//     console.error(`[Groww] Failed to fetch stock detail for ${symbol}`, error);
//     return null;
//   }
// }

// async function startLiveFeed(symbols: readonly string[]) {
//   if (typeof window !== "undefined") return;
//   try {
//     const groww = getGrowwClient();
//     await groww.liveFeed.connect();

//     await Promise.all(
//       symbols.map(async (symbol) => {
//         const meta = await getInstrumentMeta(symbol);
//         if (!meta?.exchangeToken) return;
//         const subscription = await groww.liveFeed.subscribe(
//           LiveFeedSubscriptionType.Price,
//           meta.exchangeToken
//         );
//         subscription?.consume((payload) => {
//           console.log("[Groww WS]", symbol, payload);
//         });
//       })
//     );
//   } catch (error) {
//     console.error("[Groww] Live feed error", error);
//   }
// }

// export async function ensureLiveFeed(symbols: readonly string[] = NIFTY50_SYMBOLS) {
//   if (globalWithGroww.__growwFeedPromise) {
//     return globalWithGroww.__growwFeedPromise;
//   }
//   const feedPromise = startLiveFeed(symbols);
//   globalWithGroww.__growwFeedPromise = feedPromise;
//   return feedPromise;
// }

// /**
//  * Fetches portfolio performance data from Groww API
//  * Calculates portfolio value over the last 8 months based on holdings and historical prices
//  */
// export async function fetchPortfolioPerformance(): Promise<PortfolioMetric[]> {
//   try {
//     const groww = getGrowwClient();

//     // Fetch current holdings
//     const holdings = await groww.holdings.list();

//     if (!holdings || holdings.length === 0) {
//       console.log("[Groww] No holdings found");
//       return [];
//     }

//     // Get current positions for quantity data
//     let positions: any[] = [];
//     try {
//       const positionsResponse = await groww.position.user({
//         segment: DEFAULT_SEGMENT,
//       });
//       positions = Array.isArray(positionsResponse) ? positionsResponse : [];
//     } catch (error) {
//       console.warn("[Groww] Could not fetch positions, using holdings only", error);
//     }

//     // Create a map of symbol -> quantity from positions or holdings
//     const holdingsMap = new Map<string, { quantity: number; avgPrice: number }>();

//     for (const holding of holdings) {
//       const symbol = holding.tradingSymbol?.toUpperCase();
//       if (symbol && holding.quantity && holding.quantity > 0) {
//         holdingsMap.set(symbol, {
//           quantity: holding.quantity,
//           avgPrice: holding.averagePrice || 0,
//         });
//       }
//     }

//     // Also add from positions if available
//     for (const pos of positions) {
//       const symbol = pos.tradingSymbol?.toUpperCase();
//       if (symbol && pos.quantity && pos.quantity > 0) {
//         const existing = holdingsMap.get(symbol);
//         if (!existing || existing.quantity < pos.quantity) {
//           holdingsMap.set(symbol, {
//             quantity: pos.quantity,
//             avgPrice: pos.averagePrice || 0,
//           });
//         }
//       }
//     }

//     if (holdingsMap.size === 0) {
//       console.log("[Groww] No valid holdings with quantities found");
//       return [];
//     }

//     // Generate last 8 months of dates
//     const months: PortfolioMetric[] = [];
//     const now = new Date();
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     for (let i = 7; i >= 0; i--) {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const monthKey = `${monthNames[date.getMonth()]}`;

//       // Calculate portfolio value for this month
//       let totalValue = 0;
//       const symbols = Array.from(holdingsMap.keys());

//       // Fetch historical prices for all holdings for this month
//       const historicalPromises = symbols.map(async (symbol) => {
//         const holding = holdingsMap.get(symbol)!;
//         const meta = await getInstrumentMeta(symbol);
//         if (!meta) return null;

//         try {
//           // Get historical data for this specific month
//           const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
//           const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();

//           const history = await groww.historicData.get({
//             exchange: DEFAULT_EXCHANGE,
//             segment: DEFAULT_SEGMENT,
//             tradingSymbol: meta.tradingSymbol,
//             intervalInMinutes: 1440, // Daily candles
//             startTime: monthStart,
//             endTime: monthEnd,
//           });

//           // Get the last available price in this month, or use average price as fallback
//           const candles = history?.candles || [];
//           if (candles.length > 0) {
//             const lastCandle = candles[candles.length - 1];
//             // Candle format: [timestamp, open, high, low, close, volume]
//             const price = lastCandle[4] || lastCandle[1] || holding.avgPrice;
//             return { symbol, quantity: holding.quantity, price };
//           }

//           // Fallback to average price if no historical data
//           return { symbol, quantity: holding.quantity, price: holding.avgPrice };
//         } catch (error) {
//           console.warn(`[Groww] Failed to fetch history for ${symbol}`, error);
//           // Use average price as fallback
//           return { symbol, quantity: holding.quantity, price: holding.avgPrice };
//         }
//       });

//       const priceData = await Promise.all(historicalPromises);

//       // Calculate total portfolio value for this month
//       for (const data of priceData) {
//         if (data) {
//           totalValue += data.quantity * data.price;
//         }
//       }

//       months.push({
//         date: monthKey,
//         value: Math.round(totalValue),
//       });
//     }

//     return months;
//   } catch (error) {
//     console.error("[Groww] Failed to fetch portfolio performance", error);
//     return [];
//   }
// }


// "use server";

// import "server-only";

// import {
//   Exchange,
//   GrowwAPI,
//   LiveFeedSubscriptionType,
//   Segment,
// } from "growwapi";

// import type { HistoricalData, Stock } from "./market-data";
// import { NIFTY50_SYMBOLS } from "./market-data";

// type InstrumentMeta = {
//   symbol: string;
//   tradingSymbol: string;
//   name: string;
//   exchange: string;
//   exchangeToken?: string;
//   exchangeSymbol: string;
//   internalTradingSymbol?: string;
//   growwSymbol?: string;
// };

// type GrowwGlobals = typeof globalThis & {
//   __growwClient?: GrowwAPI;
//   __growwInstrumentCache?: Map<string, InstrumentMeta>;
//   __growwFeedPromise?: Promise<void>;
// };

// const globalWithGroww = globalThis as GrowwGlobals;
// const DEFAULT_EXCHANGE = Exchange.NSE;
// const DEFAULT_SEGMENT = Segment.CASH;

// function getGrowwClient(): GrowwAPI {
//   if (!globalWithGroww.__growwClient) {
//     // NOTE: For user data (Holdings/Orders), the API client must be authenticated.
//     // Ensure you have your auth token set in your environment variables if required by your specific library version.
//     globalWithGroww.__growwClient = new GrowwAPI();
//   }
//   return globalWithGroww.__growwClient;
// }

// function getInstrumentCache() {
//   if (!globalWithGroww.__growwInstrumentCache) {
//     globalWithGroww.__growwInstrumentCache = new Map<string, InstrumentMeta>();
//   }
//   return globalWithGroww.__growwInstrumentCache;
// }

// function buildExchangeSymbol(meta: InstrumentMeta) {
//   return `${meta.exchange}_${meta.tradingSymbol}`;
// }

// // --- NEW FUNCTIONS FOR USER DATA ---

// export async function fetchUserHoldings() {
//   const groww = getGrowwClient();
//   try {
//     // Attempt to fetch holdings. 
//     // We try common method names as wrappers can vary.
//     // NOTE: This requires a valid authenticated session.
//     const response = await (groww as any).getHoldingsForUser ? 
//                      await (groww as any).getHoldingsForUser() : 
//                      await (groww as any).getHoldings();

//     // Normalize response (handle different API return shapes)
//     const rawHoldings = response.payload?.holdings || response.holdings || response || [];

//     if(!Array.isArray(rawHoldings)) return [];

//     return rawHoldings.map((h: any) => ({
//       symbol: h.tradingSymbol || h.symbol,
//       quantity: Number(h.quantity || h.qty || 0),
//       avgPrice: Number(h.avgPrice || h.averagePrice || 0),
//       companyName: h.companyName || h.symbol,
//     }));
//   } catch (error) {
//     console.error("[Groww] Failed to fetch user holdings", error);
//     return [];
//   }
// }

// export async function fetchUserTransactions() {
//   const groww = getGrowwClient();
//   try {
//      const response = await (groww as any).getOrderList ? 
//                       await (groww as any).getOrderList() : 
//                       await (groww as any).getOrders();

//      const rawOrders = response.payload?.orders || response.orders || response || [];

//      if(!Array.isArray(rawOrders)) return [];

//      return rawOrders.map((o: any) => ({
//         id: o.growwOrderId || o.orderId || Math.random().toString(),
//         date: o.creationDateTime || o.orderDate || new Date().toISOString(),
//         symbol: o.tradingSymbol || o.symbol,
//         type: (o.transactionType || "BUY").toUpperCase(),
//         quantity: Number(o.quantity || o.qty || 0),
//         price: Number(o.price || o.avgPrice || 0),
//         status: o.orderStatus || "UNKNOWN"
//      }));
//   } catch (error) {
//     console.error("[Groww] Failed to fetch user transactions", error);
//     return [];
//   }
// }

// // -----------------------------------

// export async function getInstrumentMeta(symbol: string) {
//   const cache = getInstrumentCache();
//   if (cache.has(symbol)) {
//     return cache.get(symbol)!;
//   }

//   try {
//     const groww = getGrowwClient();
//     const [instruction] = await groww.instructions.getFilteredInstructions({
//       exchange: DEFAULT_EXCHANGE,
//       segment: DEFAULT_SEGMENT,
//       tradingSymbol: symbol,
//       instrumentType: "EQ",
//     });

//     if (!instruction) {
//       console.warn(`[Groww] No instrument found for ${symbol}`);
//       return null;
//     }

//     const inferredInternalSymbol =
//       instruction.internalTradingSymbol ??
//       (instruction.series && instruction.tradingSymbol
//         ? `${instruction.tradingSymbol}-${instruction.series}`
//         : instruction.tradingSymbol ?? symbol);

//     const meta: InstrumentMeta = {
//       symbol,
//       tradingSymbol: instruction.tradingSymbol ?? symbol,
//       name: instruction.name ?? symbol,
//       exchange: instruction.exchange ?? DEFAULT_EXCHANGE,
//       exchangeToken:
//         instruction.exchangeToken !== undefined && instruction.exchangeToken !== null
//           ? String(instruction.exchangeToken)
//           : undefined,
//       internalTradingSymbol: inferredInternalSymbol ?? undefined,
//       exchangeSymbol: instruction.exchange
//         ? `${instruction.exchange}:${inferredInternalSymbol}`
//         : `${DEFAULT_EXCHANGE}:${inferredInternalSymbol}`,
//       growwSymbol: instruction.growwSymbol ?? undefined,
//     };

//     cache.set(symbol, meta);
//     return meta;
//   } catch (error) {
//     console.error(`[Groww] Failed to fetch instrument for ${symbol}`, error);
//     return null;
//   }
// }

// function toHistoricalData(candle: number[]): HistoricalData | null {
//   if (!Array.isArray(candle) || candle.length < 6) return null;
//   const [timestamp, open, high, low, close, volume] = candle;
//   const date = new Date(Number(timestamp) * 1000); 
//   if (Number.isNaN(date.getTime())) return null;
//   return {
//     date: date.toISOString(),
//     open,
//     high,
//     low,
//     close,
//     volume,
//   };
// }

// function toStock(meta: InstrumentMeta, price?: number | null): Stock {
//   return {
//     symbol: meta.symbol,
//     companyName: meta.name,
//     currentPrice: typeof price === "number" ? price : null,
//   };
// }

// function normalizeResponse(response: any): Record<string, any> {
//   if (!response) return {};
//   let data = response;
//   if (response.payload) data = response.payload;
//   else if (response.data) data = response.data;

//   if (Array.isArray(data)) {
//     const map: Record<string, any> = {};
//     data.forEach((item) => {
//       const key = item.symbol || item.tradingSymbol || item.exchangeSymbol;
//       if (key) map[key] = item;
//     });
//     return map;
//   }
//   if (typeof data === "object") return data;
//   return {};
// }

// async function buildSnapshots({
//   metas,
//   ltpMap,
//   ohlcMap,
// }: {
//   metas: InstrumentMeta[];
//   ltpMap: any;
//   ohlcMap: any;
// }): Promise<Stock[]> {
//   const cleanLtpMap = normalizeResponse(ltpMap);
//   const cleanOhlcMap = normalizeResponse(ohlcMap);

//   return metas.map((meta) => {
//     const keysToCheck = [
//       `${meta.exchange}_${meta.tradingSymbol}`,
//       `${meta.exchange}:${meta.tradingSymbol}`,
//       meta.tradingSymbol,
//       meta.symbol
//     ];

//     const getFromMap = (map: Record<string, any>) => {
//         for (const key of keysToCheck) {
//             if (map[key] !== undefined) return map[key];
//         }
//         return null;
//     };

//     const ltpData = getFromMap(cleanLtpMap);
//     const ohlcData = getFromMap(cleanOhlcMap);

//     let currentPrice: number | null = null;
//     if (typeof ltpData === "number") {
//       currentPrice = ltpData;
//     } else if (typeof ltpData === "object" && ltpData !== null) {
//       currentPrice = ltpData.lastPrice ?? ltpData.ltp ?? ltpData.value ?? ltpData.price ?? null;
//     }

//     const ohlc = ohlcData && typeof ohlcData === 'object' ? {
//         open: ohlcData.open,
//         high: ohlcData.high,
//         low: ohlcData.low,
//         close: ohlcData.close ?? ohlcData.prevClose
//     } : null;

//     const close = ohlc?.close ?? null;
//     const dayChange =
//       typeof currentPrice === "number" && typeof close === "number"
//         ? {
//             value: currentPrice - close,
//             percentage: close ? ((currentPrice - close) / close) * 100 : 0,
//           }
//         : null;

//     return {
//       ...toStock(meta, currentPrice),
//       ohlc,
//       dayChange,
//     };
//   });
// }

// export async function fetchMarketData(symbols: readonly string[] = NIFTY50_SYMBOLS) {
//   if (!symbols.length) return [];

//   try {
//     const metas = (
//       await Promise.all(
//         symbols.map(async (symbol) => await getInstrumentMeta(symbol))
//       )
//     ).filter((meta): meta is InstrumentMeta => Boolean(meta));

//     if (!metas.length) return [];

//     const exchangeSymbols = metas.map((meta) => buildExchangeSymbol(meta));
//     const groww = getGrowwClient();

//     const [ltpRaw, ohlcRaw] = await Promise.all([
//       groww.liveData.getLTP({
//         exchangeSymbols,
//         segment: DEFAULT_SEGMENT,
//       }),
//       groww.liveData.getOHLC({
//         exchangeSymbols,
//         segment: DEFAULT_SEGMENT,
//       }),
//     ]);

//     return await buildSnapshots({
//       metas,
//       ltpMap: ltpRaw,
//       ohlcMap: ohlcRaw,
//     });
//   } catch (error) {
//     console.error("[Groww] Failed to fetch market data", error);
//     return [];
//   }
// }

// export async function fetchStockDetail(symbolParam: string) {
//   const symbol = symbolParam.toUpperCase();
//   const meta = await getInstrumentMeta(symbol);
//   if (!meta) return null;

//   try {
//     const groww = getGrowwClient();
//     const [quote, history] = await Promise.all([
//       groww.liveData.getQuote({
//         exchange: DEFAULT_EXCHANGE,
//         segment: DEFAULT_SEGMENT,
//         tradingSymbol: meta.tradingSymbol,
//       }),
//       groww.historicData.get({
//         exchange: DEFAULT_EXCHANGE,
//         segment: DEFAULT_SEGMENT,
//         tradingSymbol: meta.tradingSymbol,
//         intervalInMinutes: 1440,
//         startTime: Date.now() - 1000 * 60 * 60 * 24 * 365,
//         endTime: Date.now(),
//       }),
//     ]);

//     const historicalData =
//       history?.candles
//         ?.map(toHistoricalData)
//         .filter((candle): candle is HistoricalData => Boolean(candle)) ?? [];

//     return {
//       symbol: meta.symbol,
//       companyName: meta.name,
//       currentPrice: quote?.lastPrice ?? null,
//       dayChange: quote
//         ? {
//             value: quote.dayChange,
//             percentage: quote.dayChangePerc,
//           }
//         : null,
//       week52High: quote?.week52High ?? null,
//       week52Low: quote?.week52Low ?? null,
//       marketCap: quote?.marketCap ?? null,
//       ohlc: quote?.ohlc,
//       historicalData,
//     } satisfies Stock;
//   } catch (error) {
//     console.error(`[Groww] Failed to fetch stock detail for ${symbol}`, error);
//     return null;
//   }
// }

// async function startLiveFeed(symbols: readonly string[]) {
//   if (typeof window !== "undefined") return;
//   try {
//     const groww = getGrowwClient();
//     await groww.liveFeed.connect();
//     // Live feed logic...
//   } catch (error) {
//     console.error("[Groww] Live feed error", error);
//   }
// }

// export async function ensureLiveFeed(symbols: readonly string[] = NIFTY50_SYMBOLS) {
//   if (globalWithGroww.__growwFeedPromise) {
//     return globalWithGroww.__growwFeedPromise;
//   }
//   const feedPromise = startLiveFeed(symbols);
//   globalWithGroww.__growwFeedPromise = feedPromise;
//   return feedPromise;
// }


"use server";

import "server-only";

import {
  Exchange,
  GrowwAPI,
  LiveFeedSubscriptionType,
  Segment,
} from "growwapi";

import type { HistoricalData, Stock } from "./market-data";
import { NIFTY50_SYMBOLS } from "./market-data";
import type { Position } from "@/components/dashboard/types";

type InstrumentMeta = {
  symbol: string;
  tradingSymbol: string;
  name: string;
  exchange: string;
  exchangeToken?: string;
  exchangeSymbol: string;
  internalTradingSymbol?: string;
  growwSymbol?: string;
};

type GrowwGlobals = typeof globalThis & {
  __growwClient?: GrowwAPI;
  __growwInstrumentCache?: Map<string, InstrumentMeta>;
  __growwFeedPromise?: Promise<void>;
};

const globalWithGroww = globalThis as GrowwGlobals;
const DEFAULT_EXCHANGE = Exchange.NSE;
const DEFAULT_SEGMENT = Segment.CASH;

// Get the token from environment variables
const ACCESS_TOKEN = process.env.GROWW_ACCESS_TOKEN;

function getGrowwClient(): GrowwAPI {
  if (!globalWithGroww.__growwClient) {
    // Attempt to initialize with token if the library supports it
    // Most wrappers accept the token as the first argument
    globalWithGroww.__growwClient = new GrowwAPI(ACCESS_TOKEN);
  }
  return globalWithGroww.__growwClient;
}

function getInstrumentCache() {
  if (!globalWithGroww.__growwInstrumentCache) {
    globalWithGroww.__growwInstrumentCache = new Map<string, InstrumentMeta>();
  }
  return globalWithGroww.__growwInstrumentCache;
}

function buildExchangeSymbol(meta: InstrumentMeta) {
  return `${meta.exchange}_${meta.tradingSymbol}`;
}

// --- NEW FUNCTIONS FOR USER DATA (USING DIRECT FETCH) ---

// Helper to make authenticated requests
async function fetchGrowwAPI(endpoint: string) {
  if (!ACCESS_TOKEN) {
    console.warn("[Groww] Missing GROWW_ACCESS_TOKEN. User data cannot be fetched.");
    return null;
  }

  try {
    const res = await fetch(`https://api.groww.in${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-API-VERSION": "1.0"
      },
      next: { revalidate: 30 } // Cache for 30s
    });

    if (!res.ok) {
      console.error(`[Groww] API Error ${res.status} for ${endpoint}:`, await res.text());
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[Groww] Network error for ${endpoint}:`, error);
    return null;
  }
}

export async function fetchUserHoldings() {
  // Direct endpoint for holdings
  const response = await fetchGrowwAPI("/v1/holdings/user");

  if (!response) return [];

  // Normalize response structure
  const rawHoldings = response.payload?.holdings || response.holdings || response || [];

  if (!Array.isArray(rawHoldings)) return [];

  return rawHoldings.map((h: any) => ({
    symbol: h.tradingSymbol || h.symbol,
    quantity: Number(h.quantity || h.qty || 0),
    avgPrice: Number(h.avgPrice || h.averagePrice || 0),
    companyName: h.companyName || h.symbol,
  }));
}

export async function fetchUserTransactions() {
  // Try to fetch orders/transactions
  const response = await fetchGrowwAPI("/v1/order/v1/orders");

  if (!response) return [];

  const rawOrders = response.payload?.orders || response.orders || response || [];

  if (!Array.isArray(rawOrders)) return [];

  return rawOrders.map((o: any) => ({
    id: o.growwOrderId || o.orderId || Math.random().toString(),
    date: o.creationDateTime || o.orderDate || new Date().toISOString(),
    symbol: o.tradingSymbol || o.symbol,
    type: (o.transactionType || "BUY").toUpperCase(),
    quantity: Number(o.quantity || o.qty || 0),
    price: Number(o.price || o.avgPrice || 0),
    status: o.orderStatus || "UNKNOWN"
  }));
}

// Added function to handle Portfolio History
export async function fetchPortfolioPerformance() {
  // Mock data for demonstration
  return [
    { date: "Jan", value: 4000 },
    { date: "Feb", value: 4200 },
    { date: "Mar", value: 4150 },
    { date: "Apr", value: 4500 },
    { date: "May", value: 4800 },
    { date: "Jun", value: 4700 },
    { date: "Jul", value: 5100 },
    { date: "Aug", value: 5400 },
    { date: "Sep", value: 5300 },
    { date: "Oct", value: 5600 },
    { date: "Nov", value: 5900 },
    { date: "Dec", value: 6173 }, // Matches sum of current values in mock positions roughly
  ];
}

// -----------------------------------

export async function getInstrumentMeta(symbol: string) {
  const cache = getInstrumentCache();
  if (cache.has(symbol)) {
    return cache.get(symbol)!;
  }

  try {
    const groww = getGrowwClient();
    const [instruction] = await groww.instructions.getFilteredInstructions({
      exchange: DEFAULT_EXCHANGE,
      segment: DEFAULT_SEGMENT,
      tradingSymbol: symbol,
      instrumentType: "EQ",
    });

    if (!instruction) {
      console.warn(`[Groww] No instrument found for ${symbol}`);
      return null;
    }

    const inferredInternalSymbol =
      instruction.internalTradingSymbol ??
      (instruction.series && instruction.tradingSymbol
        ? `${instruction.tradingSymbol}-${instruction.series}`
        : instruction.tradingSymbol ?? symbol);

    const meta: InstrumentMeta = {
      symbol,
      tradingSymbol: instruction.tradingSymbol ?? symbol,
      name: instruction.name ?? symbol,
      exchange: instruction.exchange ?? DEFAULT_EXCHANGE,
      exchangeToken:
        instruction.exchangeToken !== undefined && instruction.exchangeToken !== null
          ? String(instruction.exchangeToken)
          : undefined,
      internalTradingSymbol: inferredInternalSymbol ?? undefined,
      exchangeSymbol: instruction.exchange
        ? `${instruction.exchange}:${inferredInternalSymbol}`
        : `${DEFAULT_EXCHANGE}:${inferredInternalSymbol}`,
      growwSymbol: instruction.growwSymbol ?? undefined,
    };

    cache.set(symbol, meta);
    return meta;
  } catch (error) {
    console.error(`[Groww] Failed to fetch instrument for ${symbol}`, error);
    return null;
  }
}

function toHistoricalData(candle: number[]): HistoricalData | null {
  if (!Array.isArray(candle) || candle.length < 6) return null;
  const [timestamp, open, high, low, close, volume] = candle;
  const date = new Date(Number(timestamp) * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return {
    date: date.toISOString(),
    open,
    high,
    low,
    close,
    volume,
  };
}

function toStock(meta: InstrumentMeta, price?: number | null): Stock {
  return {
    symbol: meta.symbol,
    companyName: meta.name,
    currentPrice: typeof price === "number" ? price : null,
  };
}

function normalizeResponse(response: any): Record<string, any> {
  if (!response) return {};
  let data = response;
  if (response.payload) data = response.payload;
  else if (response.data) data = response.data;

  if (Array.isArray(data)) {
    const map: Record<string, any> = {};
    data.forEach((item) => {
      const key = item.symbol || item.tradingSymbol || item.exchangeSymbol;
      if (key) map[key] = item;
    });
    return map;
  }
  if (typeof data === "object") return data;
  return {};
}

async function buildSnapshots({
  metas,
  ltpMap,
  ohlcMap,
}: {
  metas: InstrumentMeta[];
  ltpMap: any;
  ohlcMap: any;
}): Promise<Stock[]> {
  const cleanLtpMap = normalizeResponse(ltpMap);
  const cleanOhlcMap = normalizeResponse(ohlcMap);

  return metas.map((meta) => {
    const keysToCheck = [
      `${meta.exchange}_${meta.tradingSymbol}`,
      `${meta.exchange}:${meta.tradingSymbol}`,
      meta.tradingSymbol,
      meta.symbol
    ];

    const getFromMap = (map: Record<string, any>) => {
      for (const key of keysToCheck) {
        if (map[key] !== undefined) return map[key];
      }
      return null;
    };

    const ltpData = getFromMap(cleanLtpMap);
    const ohlcData = getFromMap(cleanOhlcMap);

    let currentPrice: number | null = null;
    if (typeof ltpData === "number") {
      currentPrice = ltpData;
    } else if (typeof ltpData === "object" && ltpData !== null) {
      currentPrice = ltpData.lastPrice ?? ltpData.ltp ?? ltpData.value ?? ltpData.price ?? null;
    }

    const ohlc = ohlcData && typeof ohlcData === 'object' ? {
      open: ohlcData.open,
      high: ohlcData.high,
      low: ohlcData.low,
      close: ohlcData.close ?? ohlcData.prevClose
    } : null;

    const close = ohlc?.close ?? null;
    const dayChange =
      typeof currentPrice === "number" && typeof close === "number"
        ? {
          value: currentPrice - close,
          percentage: close ? ((currentPrice - close) / close) * 100 : 0,
        }
        : null;

    return {
      ...toStock(meta, currentPrice),
      ohlc,
      dayChange,
    };
  });
}

export async function fetchMarketData(symbols: readonly string[] = NIFTY50_SYMBOLS) {
  if (!symbols.length) return [];

  try {
    const metas = (
      await Promise.all(
        symbols.map(async (symbol) => await getInstrumentMeta(symbol))
      )
    ).filter((meta): meta is InstrumentMeta => Boolean(meta));

    if (!metas.length) return [];

    const exchangeSymbols = metas.map((meta) => buildExchangeSymbol(meta));
    const groww = getGrowwClient();

    const [ltpRaw, ohlcRaw] = await Promise.all([
      groww.liveData.getLTP({
        exchangeSymbols,
        segment: DEFAULT_SEGMENT,
      }),
      groww.liveData.getOHLC({
        exchangeSymbols,
        segment: DEFAULT_SEGMENT,
      }),
    ]);

    return await buildSnapshots({
      metas,
      ltpMap: ltpRaw,
      ohlcMap: ohlcRaw,
    });
  } catch (error) {
    console.error("[Groww] Failed to fetch market data", error);
    return [];
  }
}

export async function fetchStockDetail(symbolParam: string) {
  const symbol = symbolParam.toUpperCase();
  const meta = await getInstrumentMeta(symbol);
  if (!meta) return null;

  try {
    const groww = getGrowwClient();
    const [quote, history] = await Promise.all([
      groww.liveData.getQuote({
        exchange: DEFAULT_EXCHANGE,
        segment: DEFAULT_SEGMENT,
        tradingSymbol: meta.tradingSymbol,
      }),
      groww.historicData.get({
        exchange: DEFAULT_EXCHANGE,
        segment: DEFAULT_SEGMENT,
        tradingSymbol: meta.tradingSymbol,
        intervalInMinutes: 1440,
        startTime: Date.now() - 1000 * 60 * 60 * 24 * 365,
        endTime: Date.now(),
      }),
    ]);

    const historicalData =
      history?.candles
        ?.map(toHistoricalData)
        .filter((candle): candle is HistoricalData => Boolean(candle)) ?? [];

    return {
      symbol: meta.symbol,
      companyName: meta.name,
      currentPrice: quote?.lastPrice ?? null,
      dayChange: quote
        ? {
          value: quote.dayChange,
          percentage: quote.dayChangePerc,
        }
        : null,
      week52High: quote?.week52High ?? null,
      week52Low: quote?.week52Low ?? null,
      marketCap: quote?.marketCap ?? null,
      ohlc: quote?.ohlc,
      historicalData,
    } satisfies Stock;
  } catch (error) {
    console.error(`[Groww] Failed to fetch stock detail for ${symbol}`, error);
    return null;
  }
}

async function startLiveFeed(symbols: readonly string[]) {
  if (typeof window !== "undefined") return;
  try {
    const groww = getGrowwClient();
    await groww.liveFeed.connect();
    // Live feed logic...
  } catch (error) {
    console.error("[Groww] Live feed error", error);
  }
}

export async function ensureLiveFeed(symbols: readonly string[] = NIFTY50_SYMBOLS) {
  if (globalWithGroww.__growwFeedPromise) {
    return globalWithGroww.__growwFeedPromise;
  }
  const feedPromise = startLiveFeed(symbols);
  globalWithGroww.__growwFeedPromise = feedPromise;
  return feedPromise;
}

export async function fetchPortfolioPositions(): Promise<Position[]> {
  // Mock data for demonstration
  return [
    {
      id: "pos-1",
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd.",
      quantity: 50,
      avgPrice: 2450.00,
      currentPrice: 2520.50,
      investedValue: 122500,
      currentValue: 126025,
      pl: 3525,
      plPercentage: 2.88
    },
    {
      id: "pos-2",
      symbol: "TCS",
      name: "Tata Consultancy Services",
      quantity: 20,
      avgPrice: 3600.00,
      currentPrice: 3580.00,
      investedValue: 72000,
      currentValue: 71600,
      pl: -400,
      plPercentage: -0.56
    },
    {
      id: "pos-3",
      symbol: "INFY",
      name: "Infosys Limited",
      quantity: 100,
      avgPrice: 1450.00,
      currentPrice: 1520.00,
      investedValue: 145000,
      currentValue: 152000,
      pl: 7000,
      plPercentage: 4.83
    },
    {
      id: "pos-4",
      symbol: "HDFCBANK",
      name: "HDFC Bank Limited",
      quantity: 75,
      avgPrice: 1600.00,
      currentPrice: 1650.00,
      investedValue: 120000,
      currentValue: 123750,
      pl: 3750,
      plPercentage: 3.12
    },
    {
      id: "pos-5",
      symbol: "TATAMOTORS",
      name: "Tata Motors Limited",
      quantity: 200,
      avgPrice: 650.00,
      currentPrice: 720.00,
      investedValue: 130000,
      currentValue: 144000,
      pl: 14000,
      plPercentage: 10.77
    }
  ];
}