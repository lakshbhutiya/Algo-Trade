
'use server';

/**
 * @fileOverview A strategy backtesting AI agent.
 *
 * - backtestStrategy - A function that handles the strategy backtesting process.
 */

import {ai} from '@/ai/genkit';
import { BacktestStrategyInput, BacktestStrategyOutput, BacktestStrategyInputSchema, BacktestStrategyOutputSchema } from '@/lib/definitions';

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
