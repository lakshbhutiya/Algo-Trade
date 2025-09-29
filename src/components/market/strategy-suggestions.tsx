
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { runGetSuggestion } from "@/app/market/[symbol]/actions";
import type { SuggestionFormState } from "@/lib/definitions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, BrainCircuit, CheckCircle, Loader2, MinusCircle } from "lucide-react";
import type { Stock } from "@/lib/market-data";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState: SuggestionFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Get Suggestion
    </Button>
  );
}

function SuggestionResult({ state }: { state: SuggestionFormState }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">AI is analyzing the strategy... this may take a moment.</p>
      </div>
    );
  }

  if (!state.suggestion) {
    return (
         <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
            <BrainCircuit className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Select a strategy and click "Get Suggestion" to see the AI's analysis.</p>
        </div>
    )
  }

  const suggestionIcon = {
    Buy: <CheckCircle className="h-12 w-12 text-green-500" />,
    Sell: <AlertCircle className="h-12 w-12 text-red-500" />,
    Hold: <MinusCircle className="h-12 w-12 text-yellow-500" />,
  }[state.suggestion];

  return (
    <div className="p-6 rounded-lg bg-muted/50 border">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-shrink-0">
                {suggestionIcon}
            </div>
            <div className="flex-1">
                <p className="text-2xl font-bold">AI Suggestion: <span className={cn(
                    state.suggestion === 'Buy' && 'text-green-500',
                    state.suggestion === 'Sell' && 'text-red-500',
                    state.suggestion === 'Hold' && 'text-yellow-500',
                )}>{state.suggestion}</span></p>
                <p className="text-sm text-muted-foreground mt-1">Based on the "{state.strategy}" strategy.</p>
            </div>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold">Reasoning:</h4>
            <p className="text-muted-foreground text-sm mt-1 whitespace-pre-wrap">{state.reasoning}</p>
        </div>
    </div>
  );
}

export function StrategySuggestions({ stock }: { stock: Stock }) {
  const [state, formAction] = useActionState(runGetSuggestion, initialState);
  const { toast } = useToast();

   useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  const historicalDataCSV = stock.historicalData
    ? [
        "Date,Open,High,Low,Close,Volume",
        ...stock.historicalData.map(d => `${d.date},${d.open},${d.high},${d.low},${d.close},${d.volume}`)
      ].join("\n")
    : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Strategy Suggestion</CardTitle>
        <CardDescription>
          Get an AI-powered buy, sell, or hold suggestion based on a trading strategy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="flex flex-col sm:flex-row items-center gap-4">
          <input type="hidden" name="historicalData" value={historicalDataCSV} />
          <input type="hidden" name="stockSymbol" value={stock.symbol} />
          <Select name="strategy" required defaultValue="Trend Following">
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select a strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Trend Following">Trend Following</SelectItem>
              <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
              <SelectItem value="Market Timing">Market Timing</SelectItem>
              <SelectItem value="Arbitrage">Arbitrage</SelectItem>
            </SelectContent>
          </Select>
          <SubmitButton />
        </form>
        
        <SuggestionResult state={state} />

      </CardContent>
    </Card>
  );
}
