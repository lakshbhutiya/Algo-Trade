import { BacktestForm } from "@/components/backtesting/backtest-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function BacktestingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Strategy Backtesting</CardTitle>
          <CardDescription>Test your trading strategy against historical market data using AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <BacktestForm />
        </CardContent>
      </Card>
    </div>
  );
}
