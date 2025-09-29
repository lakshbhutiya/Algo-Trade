
"use server";

import { z } from "zod";
import { backtestStrategy } from "@/ai/flows/strategy-backtesting";
import type { BacktestFormState } from "@/lib/definitions";

export async function runBacktest(
  prevState: BacktestFormState,
  formData: FormData
): Promise<BacktestFormState> {
  const formSchema = z.object({
    strategy: z.string().min(1, "Strategy is required."),
    historicalData: z.string().min(1, "Historical data is required."),
    parameters: z.string().min(1, "Parameters are required."),
    optimizationObjective: z.string().min(1, "Optimization objective is required."),
  });

  const validatedFields = formSchema.safeParse({
    strategy: formData.get("strategy"),
    historicalData: formData.get("historicalData"),
    parameters: formData.get("parameters"),
    optimizationObjective: formData.get("optimizationObjective"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data. Please check your inputs.",
      error: true,
    };
  }

  try {
    const result = await backtestStrategy(validatedFields.data);
    return {
      message: "Backtest completed successfully.",
      data: result,
      error: false,
    };
  } catch (e) {
    console.error(e);
    return {
      message: "An error occurred during backtesting. Please try again.",
      error: true,
    };
  }
}
