// "use client";

// import { Activity, IndianRupee, TrendingUp, Wallet } from "lucide-react";
// import { OverviewChart } from "./overview-chart";
// import { PositionsTable } from "./positions-table";
// import { StatsCard } from "./stats-card";
// import { TransactionsTable } from "./transcations-table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { PortfolioMetric, Position, Transaction } from "./types";

// // --- 1. DEFINE MOCK DATA ---
// const mockPortfolioHistory: PortfolioMetric[] = [
//   { date: "Jan", value: 400000 },
//   { date: "Feb", value: 450000 },
//   { date: "Mar", value: 430000 },
//   { date: "Apr", value: 500000 },
//   { date: "May", value: 600000 },
//   { date: "Jun", value: 580000 },
//   { date: "Jul", value: 700000 },
//   { date: "Aug", value: 750000 },
// ];

// const mockPositions: Position[] = [
//   {
//     id: "1",
//     symbol: "RELIANCE",
//     name: "Reliance Industries Ltd",
//     quantity: 50,
//     avgPrice: 2400,
//     currentPrice: 2450,
//     investedValue: 120000,
//     currentValue: 122500,
//     pl: 2500,
//     plPercentage: 2.08,
//   },
//   {
//     id: "2",
//     symbol: "TATASTEEL",
//     name: "Tata Steel Ltd",
//     quantity: 100,
//     avgPrice: 150,
//     currentPrice: 142,
//     investedValue: 15000,
//     currentValue: 14200,
//     pl: -800,
//     plPercentage: -5.33,
//   },
// ];

// const mockTransactions: Transaction[] = [
//   {
//     id: "t1",
//     date: "2024-08-20",
//     symbol: "RELIANCE",
//     type: "BUY",
//     quantity: 10,
//     price: 2400,
//     totalAmount: 24000,
//     status: "SUCCESS",
//   },
//   {
//     id: "t2",
//     date: "2024-08-15",
//     symbol: "INFY",
//     type: "SELL",
//     quantity: 5,
//     price: 1600,
//     totalAmount: 8000,
//     status: "SUCCESS",
//   },
// ];

// export default function DashboardPage() {
//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
//       </div>

//       {/* Top Stats Row */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatsCard
//           title="Total Value"
//           value="₹7,50,000"
//           change="+20.1% from last month"
//           icon={IndianRupee}
//         />
//         <StatsCard
//           title="Total Investment"
//           value="₹6,00,000"
//           change="+10% invested"
//           icon={Wallet}
//         />
//         <StatsCard
//           title="Total P/L"
//           value="+₹1,50,000"
//           change="+25% overall return"
//           icon={TrendingUp}
//         />
//         <StatsCard
//           title="Active Positions"
//           value="12"
//           change="+2 new this week"
//           icon={Activity}
//         />
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         {/* Main Chart Area */}
//         <Card className="col-span-4">
//           <CardHeader>
//             <CardTitle>Portfolio Performance</CardTitle>
//             <CardDescription>
//               Your portfolio value over the last 8 months.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="pl-2">
//             {/* IMPORTANT: Ensure 'data' prop is passed here */}
//             <OverviewChart data={mockPortfolioHistory} />
//           </CardContent>
//         </Card>

//         {/* Detailed Lists (Tabs for Holdings vs Transactions) */}
//         <Card className="col-span-3">
//           <CardHeader>
//             <CardTitle>Portfolio Details</CardTitle>
//             <CardDescription>
//               Manage your positions and view history.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="holdings" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="holdings">Holdings</TabsTrigger>
//                 <TabsTrigger value="transactions">Transactions</TabsTrigger>
//               </TabsList>
//               <TabsContent value="holdings">
//                 <PositionsTable positions={mockPositions} />
//               </TabsContent>
//               <TabsContent value="transactions">
//                 <TransactionsTable transactions={mockTransactions} />
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
import { Activity, IndianRupee, TrendingUp, Wallet } from "lucide-react";
import { OverviewChart } from "./overview-chart";
import { PositionsTable } from "./positions-table";
import { StatsCard } from "./stats-card";
import { TransactionsTable } from "./transactions-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioMetric, Position, Transaction } from "./types";
// FIX: Import only the functions that actually exist in your library
import { fetchUserHoldings, fetchUserTransactions, fetchMarketData } from "@/lib/groww";

// NOTE: We mock history because the API doesn't provide a "Portfolio Value over Time" endpoint.
const mockPortfolioHistory: PortfolioMetric[] = [
  { date: "Jan", value: 400000 },
  { date: "Feb", value: 450000 },
  { date: "Mar", value: 430000 },
  { date: "Apr", value: 500000 },
  { date: "May", value: 600000 },
  { date: "Jun", value: 580000 },
  { date: "Jul", value: 700000 },
  { date: "Aug", value: 750000 },
];

export const revalidate = 60; // Refresh data every 60 seconds

export default async function DashboardPage() {
  // 1. Fetch User Data (Holdings & Orders)
  const [rawHoldings, rawTransactions] = await Promise.all([
    fetchUserHoldings(),
    fetchUserTransactions()
  ]);

  // 2. Fetch Live Market Data (LTP) for the stocks we hold
  //    (Because 'Holdings' API often returns delayed or average prices)
  const holdingSymbols = rawHoldings.map((h) => h.symbol);
  const marketData = holdingSymbols.length > 0 ? await fetchMarketData(holdingSymbols) : [];

  // 3. Merge Holdings with Live Prices to create "Positions"
  const positions: Position[] = rawHoldings.map((h, index) => {
    const marketInfo = marketData.find((m) => m.symbol === h.symbol);
    const currentPrice = marketInfo?.currentPrice ?? h.avgPrice; // Fallback to avg if live fails
    const investedValue = h.quantity * h.avgPrice;
    const currentValue = h.quantity * currentPrice;
    const pl = currentValue - investedValue;
    const plPercentage = investedValue > 0 ? (pl / investedValue) * 100 : 0;

    return {
      id: `pos-${index}`,
      symbol: h.symbol,
      name: marketInfo?.companyName || h.companyName,
      quantity: h.quantity,
      avgPrice: h.avgPrice,
      currentPrice: currentPrice,
      investedValue: investedValue,
      currentValue: currentValue,
      pl: pl,
      plPercentage: plPercentage,
    };
  });

  // 4. Transform Transactions
  const transactions: Transaction[] = rawTransactions.map((t) => ({
      id: t.id,
      date: t.date,
      symbol: t.symbol,
      type: t.type === "BUY" || t.type === "SELL" ? t.type : "BUY",
      quantity: t.quantity,
      price: t.price,
      totalAmount: t.quantity * t.price,
      status: t.status === "SUCCESS" || t.status === "PENDING" ? t.status : "FAILED"
  }));

  // 5. Calculate Total Dashboard Stats
  const totalCurrentValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalInvestedValue = positions.reduce((sum, p) => sum + p.investedValue, 0);
  const totalPL = totalCurrentValue - totalInvestedValue;
  const totalPLPercent = totalInvestedValue > 0 ? (totalPL / totalInvestedValue) * 100 : 0;
  
  // Formatters
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  
  const formatPercent = (val: number) => 
    `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Top Stats Row with REAL Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Value"
          value={formatCurrency(totalCurrentValue)}
          change={`${formatPercent(totalPLPercent)} overall`}
          icon={IndianRupee}
        />
        <StatsCard
          title="Total Investment"
          value={formatCurrency(totalInvestedValue)}
          change="Invested Capital"
          icon={Wallet}
        />
        <StatsCard
          title="Total P/L"
          value={formatCurrency(totalPL)}
          change={`${formatPercent(totalPLPercent)} return`}
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Positions"
          value={positions.length.toString()}
          change="Stocks held"
          icon={Activity}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>
              Your portfolio value (Historical data is mocked).
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             {/* We pass the mock history here because we can't fetch it easily */}
            <OverviewChart data={mockPortfolioHistory} />
          </CardContent>
        </Card>

        {/* Detailed Lists */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Details</CardTitle>
            <CardDescription>
              Manage your positions and view history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="holdings" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="holdings">Holdings</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="holdings">
                <PositionsTable positions={positions} />
              </TabsContent>
              <TabsContent value="transactions">
                <TransactionsTable transactions={transactions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}