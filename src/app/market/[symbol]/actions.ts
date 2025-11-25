
"use server";

import { z } from "zod";
import { getStrategySuggestion } from "@/ai/flows/get-strategy-suggestion";
import type { SuggestionFormState } from "@/lib/definitions";

export async function runGetSuggestion(
  prevState: SuggestionFormState,
  formData: FormData
): Promise<SuggestionFormState> {
  const formSchema = z.object({
    strategy: z.string().min(1, "Strategy is required."),
    historicalData: z.string().min(1, "Historical data is required."),
    stockSymbol: z.string().min(1, "Stock symbol is required."),
  });

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
    // Parse CSV data back to HistoricalData[]
    const lines = historicalDataCSV.trim().split('\n');
    // Skip header row
    const dataRows = lines.slice(1);

    const history = dataRows.map(line => {
      const [date, open, high, low, close, volume] = line.split(',');
      return {
        date,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume)
      };
    });

    // We need current price for analysis. 
    // Since we don't have live price here easily without re-fetching, 
    // we can use the last close price from history as a proxy for "currentPriceNSE".
    // For BSE price, we'll pass undefined for now unless we fetch it.
    const lastCandle = history[history.length - 1];
    const currentPriceNSE = lastCandle ? lastCandle.close : 0;

    const { analyzeStock } = await import("@/lib/analysis");
    const result = analyzeStock(history, currentPriceNSE);

    // Construct reasoning string based on signals
    const reasoning = `
**Trend**: ${result.signals.trend}
**RSI**: ${result.signals.rsi} (${result.signals.rsi < 30 ? 'Oversold' : result.signals.rsi > 70 ? 'Overbought' : 'Neutral'})
**Momentum (ROC)**: ${result.signals.momentum}
${result.signals.arbitrageOpportunity ? `**Arbitrage**: Opportunity detected (Spread: ${result.signals.arbitrageSpread}%)` : ''}

Composite Score: ${result.score.toFixed(2)}
    `.trim();

    return {
      suggestion: result.recommendation,
      reasoning,
      strategy,
      signals: result.signals,
      score: result.score
    };
  } catch (e: any) {
    console.error(e);
    return {
      error: e.message || "An error occurred while getting a suggestion.",
      strategy,
    };
  }
}
