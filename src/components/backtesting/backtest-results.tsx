import { Lightbulb, Settings, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormState } from "@/app/backtesting/actions";

type BacktestResultsProps = {
  results: NonNullable<FormState['data']>;
};

export function BacktestResults({ results }: BacktestResultsProps) {
    let formattedParams = "Invalid JSON format";
    try {
        formattedParams = JSON.stringify(JSON.parse(results.optimizedParameters), null, 2);
    } catch(e) {
        console.error("Failed to parse optimized parameters:", e);
    }
  return (
    <div className="space-y-6 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight">AI Backtest Results</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Settings className="h-6 w-6 text-primary"/>
                    <CardTitle>Optimized Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="mt-2 rounded-md bg-muted p-4 text-sm text-muted-foreground overflow-auto">
                        <code>{formattedParams}</code>
                    </pre>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <BarChart3 className="h-6 w-6 text-primary"/>
                    <CardTitle>Backtesting Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{results.backtestingResults}</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Lightbulb className="h-6 w-6 text-primary"/>
                <CardTitle>Suggested Improvements</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{results.suggestedImprovements}</p>
            </CardContent>
        </Card>
    </div>
  );
}
