import { stockData } from "@/lib/market-data";
import { StockDetail } from "@/components/market/stock-detail";
import { notFound } from "next/navigation";

export default function StockDetailPage({ params }: { params: { symbol: string } }) {
  const stock = stockData.find(s => s.symbol === params.symbol.toUpperCase());

  if (!stock) {
    notFound();
  }

  return <StockDetail stock={stock} />;
}

export function generateStaticParams() {
  return stockData.map((stock) => ({
    symbol: stock.symbol,
  }));
}
