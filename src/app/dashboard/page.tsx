import { DollarSign, Percent, TrendingUp, TrendingDown } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { TradesHistory } from "@/components/dashboard/trades-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total P&L"
          value="$45,231.89"
          change="+20.1% from last month"
          icon={DollarSign}
        />
        <StatsCard
          title="Win Rate"
          value="63.5%"
          change="+2.8% from last month"
          icon={Percent}
        />
        <StatsCard
          title="Winning Trades"
          value="1,204"
          change="+150 from last month"
          icon={TrendingUp}
        />
        <StatsCard
          title="Losing Trades"
          value="702"
          change="-30 from last month"
          icon={TrendingDown}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <PositionsTable />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <TradesHistory />
        </CardContent>
      </Card>
    </div>
  );
}
