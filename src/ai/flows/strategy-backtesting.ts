'use server';

/**
 * @fileOverview A strategy backtesting AI agent.
 *
 * - backtestStrategy - A function that handles the strategy backtesting process.
 * - BacktestStrategyInput - The input type for the backtestStrategy function.
 * - BacktestStrategyOutput - The return type for the backtestStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BacktestStrategyInputSchema = z.object({
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

const BacktestStrategyOutputSchema = z.object({
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

export async function backtestStrategy(input: BacktestStrategyInput): Promise<BacktestStrategyOutput> {
  return backtestStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'backtestStrategyPrompt',
  input: {schema: BacktestStrategyInputSchema},
  output: {schema: BacktestStrategyOutputSchema},
  prompt: `You are an expert in trading strategy backtesting and optimization.

You will use the provided historical market data to backtest the given trading strategy and optimize its parameters based on the specified objective.

Trading Strategy: {{{strategy}}}
Historical Data: {{{historicalData}}}
Parameters to Optimize: {{{parameters}}}
Optimization Objective: {{{optimizationObjective}}}

Based on the backtesting results, you will suggest improvements to the strategy.

Output the optimized parameters, backtesting results, and suggested improvements in the specified JSON format. Remember that the parameters are already in JSON format, so you need to output them as a string.

{{#if historicalData}}
  The historical data has been provided.
{{else}}
  No historical data has been provided.
{{/if}}
`,
});

const backtestStrategyFlow = ai.defineFlow(
  {
    name: 'backtestStrategyFlow',
    inputSchema: BacktestStrategyInputSchema,
    outputSchema: BacktestStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
