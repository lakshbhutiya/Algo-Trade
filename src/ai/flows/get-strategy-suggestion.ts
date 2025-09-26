'use server';

/**
 * @fileOverview An AI agent for getting trading strategy suggestions.
 *
 * - getStrategySuggestion - A function that provides a buy, sell, or hold suggestion based on a strategy.
 * - StrategySuggestionInput - The input type for the getStrategySuggestion function.
 * - StrategySuggestionOutput - The return type for the getStrategySuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrategySuggestionInputSchema = z.object({
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

const StrategySuggestionOutputSchema = z.object({
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

export async function getStrategySuggestion(
  input: StrategySuggestionInput
): Promise<StrategySuggestionOutput> {
  return strategySuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'strategySuggestionPrompt',
  input: {schema: StrategySuggestionInputSchema},
  output: {schema: StrategySuggestionOutputSchema},
  prompt: `You are an expert trading analyst. Based on the trading strategy and the historical data for the stock, provide a clear "Buy", "Sell", or "Hold" recommendation.

Stock: {{{stockSymbol}}}
Trading Strategy: {{{strategy}}}

Historical Data:
{{{historicalData}}}

Your task is to analyze the recent trends in the provided data in the context of the selected strategy.
- For "Trend Following", look for established upward or downward trends.
- For "Mean Reversion", identify if the stock price has deviated significantly from its recent average.
- For "Market Timing", consider broader market indicators, although the data is for a single stock, so focus on volatility and volume as proxies.
- For "Arbitrage", this strategy is not applicable to a single stock's historical data, so state that and recommend 'Hold'.

Provide a concise reasoning for your final suggestion.`,
});

const strategySuggestionFlow = ai.defineFlow(
  {
    name: 'strategySuggestionFlow',
    inputSchema: StrategySuggestionInputSchema,
    outputSchema: StrategySuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
