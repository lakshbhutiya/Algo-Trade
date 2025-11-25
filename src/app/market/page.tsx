import { MarketView } from "@/components/market/market-view";
import { fetchMarketData, ensureLiveFeed } from "@/lib/groww";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const stocks = await fetchMarketData();
  void ensureLiveFeed().catch((error) =>
    console.error("[Groww] failed to start live feed", error)
  );

  return <MarketView stocks={stocks} />;
}
