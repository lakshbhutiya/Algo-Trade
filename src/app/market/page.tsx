import { MarketView } from "@/components/market/market-view";
import { stockData } from "@/lib/market-data";

export default function MarketPage() {
  return <MarketView stocks={stockData} />;
}
