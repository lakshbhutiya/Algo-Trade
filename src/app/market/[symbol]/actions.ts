
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
    const result = await getStrategySuggestion({
        strategy,
        historicalData: historicalDataCSV,
        stockSymbol
    });
    
    return { ...result, strategy };
  } catch (e: any) {
    console.error(e);
    return {
      error: e.message || "An error occurred while getting a suggestion.",
      strategy,
    };
  }
}
