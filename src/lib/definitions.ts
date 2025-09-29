
// This file contains shared type definitions for the application.

// From src/app/backtesting/actions.ts
export interface BacktestFormState {
  message: string;
  data?: {
    optimizedParameters: string;
    backtestingResults: string;
    suggestedImprovements: string;
  };
  error?: boolean;
}

// From src/app/market/[symbol]/actions.ts
export interface SuggestionFormState {
  suggestion?: 'Buy' | 'Sell' | 'Hold';
  reasoning?: string;
  error?: string;
  strategy?: string;
}

// From src/ai/flows/strategy-backtesting.ts
import { z } from 'zod';

export const BacktestStrategyInputSchema = z.object({
  strategy: z
    .string()
    .describe(
      'The trading strategy to backtest (Trend Following, Arbitrage, Mean Reversion, or Market Timing).'
    ),
  historicalData: z
    .string()
    .describe(
      'Historical market data as a string, including dates, open, high, low, close, and volume data. Expected format: CSV.'
    ),
  parameters: z
    .string()
    .describe(
      'Parameters to optimize for the given strategy. These should be specified in a way the AI can understand and adjust, for example, as a JSON string.'
    ),
  optimizationObjective: z
    .string()
    .describe(
      'The objective to optimize for, such as maximizing profit, minimizing risk, or Sharpe ratio.'
    ),
});
export type BacktestStrategyInput = z.infer<typeof BacktestStrategyInputSchema>;

export const BacktestStrategyOutputSchema = z.object({
  optimizedParameters: z
    .string()
    .describe(
      'The optimized parameters for the given strategy and historical data, as a JSON string.'
    ),
  backtestingResults: z
    .string()
    .describe(
      'The results of the backtesting, including key metrics such as profit, loss, Sharpe ratio, and maximum drawdown.'
    ),
  suggestedImprovements: z
    .string()
    .describe(
      'Suggested improvements to the strategy based on the backtesting results.'
    ),
});
export type BacktestStrategyOutput = z.infer<typeof BacktestStrategyOutputSchema>;


// From src/ai/flows/get-strategy-suggestion.ts
export const StrategySuggestionInputSchema = z.object({
  strategy: z
    .string()
    .describe(
      'The trading strategy to use for the suggestion (e.g., Trend Following, Mean Reversion).'
    ),
  historicalData: z
    .string()
    .describe(
      'Historical market data for a stock in CSV format, including dates, open, high, low, close, and volume.'
    ),
    stockSymbol: z.string().describe('The stock symbol (e.g., RELIANCE).'),
});
export type StrategySuggestionInput = z.infer<typeof StrategySuggestionInputSchema>;

export const StrategySuggestionOutputSchema = z.object({
  suggestion: z
    .enum(['Buy', 'Sell', 'Hold'])
    .describe('The trading suggestion: Buy, Sell, or Hold.'),
  reasoning: z
    .string()
    .describe("A detailed explanation for the suggestion based on the provided strategy and historical data.")
});
export type StrategySuggestionOutput = z.infer<
  typeof StrategySuggestionOutputSchema
>;
