import { DollarSign, Percent, TrendingUp, TrendingDown } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPortfolioPerformance, fetchPortfolioPositions } from "@/lib/groww";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [portfolioData, positions] = await Promise.all([
    fetchPortfolioPerformance(),
    fetchPortfolioPositions()
  ]);

  // Calculate stats from portfolio data
  const currentValue = portfolioData.length > 0 ? portfolioData[portfolioData.length - 1].value : 0;
  const previousValue = portfolioData.length > 1 ? portfolioData[portfolioData.length - 2].value : currentValue;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : "0.0";
  const changeText = change >= 0 ? `+${changePercent}%` : `${changePercent}%`;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Portfolio Value"
          value={formatCurrency(currentValue)}
          change={portfolioData.length > 1 ? `${changeText} from last month` : "No historical data"}
          icon={DollarSign}
        />
        <StatsCard
          title="Win Rate"
          value="—"
          change="Connect trading account to see stats"
          icon={Percent}
        />
        <StatsCard
          title="Winning Trades"
          value="—"
          change="Connect trading account to see stats"
          icon={TrendingUp}
        />
        <StatsCard
          title="Losing Trades"
          value="—"
          change="Connect trading account to see stats"
          icon={TrendingDown}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart data={portfolioData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <PositionsTable positions={positions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
