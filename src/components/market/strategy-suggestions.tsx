
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
        <p className="text-muted-foreground">Analyzing market data...</p>
      </div>
    );
  }

  if (!state.suggestion) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
        <BrainCircuit className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Select a strategy and click "Get Suggestion" to see the analysis.</p>
      </div>
    )
  }

  const suggestionColor = {
    "STRONG BUY": "text-green-600",
    "BUY": "text-green-500",
    "HOLD": "text-yellow-500",
    "SELL": "text-red-500",
    "STRONG SELL": "text-red-600",
  }[state.suggestion] || "text-foreground";

  const suggestionIcon = {
    "STRONG BUY": <CheckCircle className="h-12 w-12 text-green-600" />,
    "BUY": <CheckCircle className="h-12 w-12 text-green-500" />,
    "HOLD": <MinusCircle className="h-12 w-12 text-yellow-500" />,
    "SELL": <AlertCircle className="h-12 w-12 text-red-500" />,
    "STRONG SELL": <AlertCircle className="h-12 w-12 text-red-600" />,
  }[state.suggestion] || <BrainCircuit className="h-12 w-12" />;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-muted/50 border">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="flex-shrink-0">
            {suggestionIcon}
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold">Recommendation: <span className={suggestionColor}>{state.suggestion}</span></p>
            <p className="text-sm text-muted-foreground mt-1">Based on mathematical analysis of historical data.</p>
          </div>
          {state.score !== undefined && (
            <div className="text-center bg-background p-3 rounded-md border">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Score</div>
              <div className={`text-2xl font-bold ${state.score > 0 ? 'text-green-500' : state.score < 0 ? 'text-red-500' : ''}`}>
                {state.score.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>

      {state.signals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-sm text-muted-foreground mb-1">Trend (EMA)</div>
            <div className="font-semibold text-lg">{state.signals.trend}</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-sm text-muted-foreground mb-1">RSI (14)</div>
            <div className="font-semibold text-lg flex items-center gap-2">
              {state.signals.rsi}
              <span className={`text-xs px-2 py-0.5 rounded-full ${state.signals.rsi < 30 ? 'bg-green-100 text-green-800' :
                  state.signals.rsi > 70 ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                {state.signals.rsi < 30 ? 'Oversold' : state.signals.rsi > 70 ? 'Overbought' : 'Neutral'}
              </span>
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-sm text-muted-foreground mb-1">Momentum (ROC)</div>
            <div className={`font-semibold text-lg ${state.signals.momentum > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {state.signals.momentum}%
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg border bg-muted/30">
        <h4 className="font-semibold mb-2">Detailed Analysis</h4>
        <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {state.reasoning}
        </div>
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
        <CardTitle>Strategy Suggestion</CardTitle>
        <CardDescription>
          Get a buy, sell, or hold suggestion based on a trading strategy.
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
