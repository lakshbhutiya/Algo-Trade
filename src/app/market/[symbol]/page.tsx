import { StockDetail } from "@/components/market/stock-detail";
import { fetchStockDetail } from "@/lib/groww";

export const dynamic = "force-dynamic";

type StockDetailPageProps = {
  params: { symbol: string };
};

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const stock = await fetchStockDetail(params.symbol);

  if (!stock) {
    return (
      <div className="container mx-auto max-w-3xl py-24 text-center text-muted-foreground">
        <h1 className="text-2xl font-semibold mb-4">No data found</h1>
        <p>
          We could not load realtime data for "{params.symbol.toUpperCase()}". Please
          verify your Groww API configuration and try again.
        </p>
      </div>
    );
  }

  return <StockDetail stock={stock} />;
}
