"use client";

import { useFormState, useFormStatus } from "react-dom";
import { runBacktest, type FormState } from "@/app/backtesting/actions";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { BacktestResults } from "./backtest-results";

const initialState: FormState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Run Backtest
    </Button>
  );
}

function LoadingState({children}: {children: React.ReactNode}) {
    const { pending } = useFormStatus();
    if (!pending) return <>{children}</>;
    return (
        <>
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center mt-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing your strategy... this may take a moment.</p>
            </div>
            {children}
        </>
    )
}

export function BacktestForm() {
  const [state, formAction] = useFormState(runBacktest, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-8">
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="strategy">Trading Strategy</Label>
                <Select name="strategy" required>
                    <SelectTrigger id="strategy">
                        <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Trend Following">Trend Following</SelectItem>
                        <SelectItem value="Arbitrage">Arbitrage</SelectItem>
                        <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                        <SelectItem value="Market Timing">Market Timing</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="historicalData">Historical Market Data</Label>
                <Textarea
                    name="historicalData"
                    id="historicalData"
                    required
                    placeholder="Paste your historical data in CSV format..."
                    className="min-h-[200px] font-mono"
                    defaultValue="Date,Open,High,Low,Close,Volume\n2023-01-01,150,155,149,153,100000\n2023-01-02,153,156,152,155,120000"
                />
                <p className="text-sm text-muted-foreground">Provide data including Date, Open, High, Low, Close, and Volume.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="parameters">Parameters (JSON)</Label>
                    <Input name="parameters" id="parameters" required placeholder='e.g., {"short_window": 20, "long_window": 50}' defaultValue={`{"moving_average_short": 20, "moving_average_long": 50}`} />
                    <p className="text-sm text-muted-foreground">Parameters to be optimized by the AI.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="optimizationObjective">Optimization Objective</Label>
                    <Input name="optimizationObjective" id="optimizationObjective" required placeholder="e.g., Maximize profit" defaultValue="Maximize Sharpe Ratio"/>
                    <p className="text-sm text-muted-foreground">The goal for the AI to optimize towards.</p>
                </div>
            </div>
        </div>
        
        <SubmitButton />
        
        <LoadingState>
            {state.data && <BacktestResults results={state.data} />}
        </LoadingState>

    </form>
  );
}
