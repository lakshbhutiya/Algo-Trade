
"use server";

import { z } from "zod";
import { getStrategySuggestion } from "@/ai/flows/get-strategy-suggestion";

export interface SuggestionFormState {
  suggestion?: 'Buy' | 'Sell' | 'Hold';
  reasoning?: string;
  error?: string;
  strategy?: string;
}

const formSchema = z.object({
  strategy: z.string().min(1, "Strategy is required."),
  historicalData: z.string().min(1, "Historical data is required."),
  stockSymbol: z.string().min(1, "Stock symbol is required."),
});

// --- Formula-based Strategy Implementations ---

type HistoricalDataPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function parseHistoricalData(csv: string): HistoricalDataPoint[] {
  const lines = csv.trim().split('\n');
  const headers = lines.shift()?.split(',');
  if (!headers) return [];

  return lines.map(line => {
    const values = line.split(',');
    const dataPoint: any = {};
    headers.forEach((header, index) => {
      const key = header.trim();
      const value = values[index];
      dataPoint[key] = isNaN(Number(value)) ? value : Number(value);
    });
    return dataPoint as HistoricalDataPoint;
  });
}

function getMeanReversionSuggestion(historicalData: HistoricalDataPoint[]): Omit<SuggestionFormState, 'strategy'> {
  const period = 20;
  if (historicalData.length < period) {
    return {
      suggestion: 'Hold',
      reasoning: `Not enough historical data to apply Mean Reversion strategy (requires at least ${period} days).`,
    };
  }

  const recentData = historicalData.slice(-period);
  const currentPrice = recentData[recentData.length - 1].close;
  const prices = recentData.map(d => d.close);
  
  const mean = prices.reduce((sum, price) => sum + price, 0) / period;
  const stdDev = Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period);

  const upperBand = mean + 2 * stdDev;
  const lowerBand = mean - 2 * stdDev;

  if (currentPrice > upperBand) {
    return {
      suggestion: 'Sell',
      reasoning: `The current price (₹${currentPrice.toFixed(2)}) is significantly above the recent average (₹${mean.toFixed(2)}), suggesting it's overvalued and likely to revert downwards. The price is above the upper Bollinger Band (₹${upperBand.toFixed(2)}).`,
    };
  } else if (currentPrice < lowerBand) {
    return {
      suggestion: 'Buy',
      reasoning: `The current price (₹${currentPrice.toFixed(2)}) is significantly below the recent average (₹${mean.toFixed(2)}), suggesting it's undervalued and likely to revert upwards. The price is below the lower Bollinger Band (₹${lowerBand.toFixed(2)}).`,
    };
  } else {
    return {
      suggestion: 'Hold',
      reasoning: `The current price (₹${currentPrice.toFixed(2)}) is within its normal range around the recent average (₹${mean.toFixed(2)}). There is no strong signal for a price reversion at this moment.`,
    };
  }
}

function getArbitrageSuggestion(): Omit<SuggestionFormState, 'strategy'> {
  return {
    suggestion: 'Hold',
    reasoning: 'Arbitrage involves exploiting price differences for the same asset across different markets. This strategy is not applicable when analyzing a single stock\'s historical data from one market.',
  };
}


export async function runGetSuggestion(
  prevState: SuggestionFormState,
  formData: FormData
): Promise<SuggestionFormState> {
  
  const validatedFields = formSchema.safeParse({
    strategy: formData.get("strategy"),
    historicalData: formData.get("historicalData"),
    stockSymbol: formData.get("stockSymbol"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check your inputs.",
    };
  }

  const { strategy, historicalData: historicalDataCSV, stockSymbol } = validatedFields.data;

  try {
    let result: Omit<SuggestionFormState, 'strategy'>;

    if (strategy === "Mean Reversion") {
      const historicalData = parseHistoricalData(historicalDataCSV);
      result = getMeanReversionSuggestion(historicalData);
    } else if (strategy === "Arbitrage") {
      result = getArbitrageSuggestion();
    } else {
      // For other strategies, use the AI flow
      result = await getStrategySuggestion({
          strategy,
          historicalData: historicalDataCSV,
          stockSymbol
      });
    }
    
    return { ...result, strategy };
  } catch (e: any) {
    console.error(e);
    return {
      error: e.message || "An error occurred while getting a suggestion.",
      strategy,
    };
  }
}
