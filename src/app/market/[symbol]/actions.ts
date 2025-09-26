"use server";

import { z } from "zod";
import { getStrategySuggestion } from "@/ai/flows/get-strategy-suggestion";
import type { Stock } from "@/lib/market-data";

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

  try {
    const result = await getStrategySuggestion(validatedFields.data);
    return { ...result, strategy: validatedFields.data.strategy };
  } catch (e: any) {
    console.error(e);
    return {
      error: e.message || "An error occurred while getting a suggestion.",
    };
  }
}
