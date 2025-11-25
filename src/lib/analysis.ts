import { HistoricalData } from "./market-data";

// --- Types ---
export type AnalysisResult = {
    score: number; // -1 to 1
    recommendation: "STRONG BUY" | "BUY" | "HOLD" | "SELL" | "STRONG SELL";
    signals: {
        trend: "BULLISH" | "BEARISH" | "NEUTRAL";
        rsi: number;
        momentum: number;
        arbitrageOpportunity: boolean;
        arbitrageSpread: number;
    };
};

// --- Mathematical Helper Functions ---

/**
 * Calculates the Exponential Moving Average (EMA)
 * Formula: [Close - Previous EMA] * (2 / n + 1) + Previous EMA
 */
function calculateEMA(data: number[], period: number): number[] {
    const k = 2 / (period + 1);
    let emaArray = [data[0]];

    for (let i = 1; i < data.length; i++) {
        const ema = data[i] * k + emaArray[i - 1] * (1 - k);
        emaArray.push(ema);
    }
    return emaArray;
}

/**
 * Calculates Relative Strength Index (RSI)
 * A momentum oscillator measuring the speed and change of price movements.
 */
function calculateRSI(data: number[], period: number = 14): number {
    if (data.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain/loss
    for (let i = 1; i <= period; i++) {
        const diff = data[i] - data[i - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Smoothed averages
    for (let i = period + 1; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        const currentGain = diff > 0 ? diff : 0;
        const currentLoss = diff < 0 ? Math.abs(diff) : 0;

        avgGain = (avgGain * (period - 1) + currentGain) / period;
        avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

/**
 * Calculates Rate of Change (ROC) for Market Timing
 * Formula: ((CurrentPrice - Price_n_periods_ago) / Price_n_periods_ago) * 100
 */
function calculateROC(data: number[], period: number = 10): number {
    if (data.length < period) return 0;
    const currentPrice = data[data.length - 1];
    const pastPrice = data[data.length - 1 - period];
    return ((currentPrice - pastPrice) / pastPrice) * 100;
}

// --- Main Analysis Function ---

export function analyzeStock(
    history: HistoricalData[],
    currentPriceNSE: number,
    currentPriceBSE?: number
): AnalysisResult {

    if (!history || history.length < 50) {
        return {
            score: 0,
            recommendation: "HOLD",
            signals: { trend: "NEUTRAL", rsi: 50, momentum: 0, arbitrageOpportunity: false, arbitrageSpread: 0 }
        };
    }

    // Extract closing prices (Sorted oldest to newest assumed)
    const closes = history.map(h => h.close);

    // 1. TREND FOLLOWING (EMA Crossover)
    // Weight: 40%
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    const lastEMA20 = ema20[ema20.length - 1];
    const lastEMA50 = ema50[ema50.length - 1];

    let trendScore = 0;
    if (lastEMA20 > lastEMA50) trendScore = 1; // Bullish
    else if (lastEMA20 < lastEMA50) trendScore = -1; // Bearish

    // 2. MEAN REVERSION (RSI)
    // Weight: 30%
    const rsi = calculateRSI(closes);
    let rsiScore = 0;

    // Logic: Buy when oversold (<30), Sell when overbought (>70)
    if (rsi < 30) rsiScore = 1;       // Strong buy signal
    else if (rsi < 40) rsiScore = 0.5; // Mild buy signal
    else if (rsi > 70) rsiScore = -1;  // Strong sell signal
    else if (rsi > 60) rsiScore = -0.5;// Mild sell signal

    // 3. MARKET TIMING (Momentum/ROC)
    // Weight: 20%
    const roc = calculateROC(closes, 10);
    let momentumScore = 0;
    if (roc > 2) momentumScore = 1;      // Strong Upward Momentum
    else if (roc > 0) momentumScore = 0.5;
    else if (roc < -2) momentumScore = -1; // Strong Downward Momentum
    else if (roc < 0) momentumScore = -0.5;

    // 4. ARBITRAGE (Bonus)
    // Weight: Additive Bonus (Does not reduce score, only adds if opportunity exists)
    let arbSpread = 0;
    let arbSignal = false;

    if (currentPriceBSE && currentPriceNSE) {
        const diff = Math.abs(currentPriceNSE - currentPriceBSE);
        const minPrice = Math.min(currentPriceNSE, currentPriceBSE);
        arbSpread = (diff / minPrice) * 100;

        // If spread > 1%, it's a significant arbitrage opportunity
        if (arbSpread > 1.0) {
            arbSignal = true;
        }
    }

    // --- FINAL COMPOSITE SCORE CALCULATION ---
    // Formula: (Trend * 0.4) + (RSI * 0.4) + (Momentum * 0.2)
    let totalScore = (trendScore * 0.4) + (rsiScore * 0.4) + (momentumScore * 0.2);

    // Arbitrage Boost: If there is free money (arbitrage), bias towards Buying the lower one
    // We strictly output the signal here; execution depends on which exchange is lower.
    if (arbSignal) {
        // Arbitrage is usually a "Buy" signal for the lower priced exchange
        // We treat it as a slight boost to conviction
        totalScore += 0.1;
    }

    // Cap score between -1 and 1
    totalScore = Math.max(-1, Math.min(1, totalScore));

    // Determine Recommendation String
    let rec: AnalysisResult["recommendation"] = "HOLD";
    if (totalScore >= 0.5) rec = "STRONG BUY";
    else if (totalScore >= 0.2) rec = "BUY";
    else if (totalScore <= -0.5) rec = "STRONG SELL";
    else if (totalScore <= -0.2) rec = "SELL";

    return {
        score: totalScore,
        recommendation: rec,
        signals: {
            trend: trendScore > 0 ? "BULLISH" : trendScore < 0 ? "BEARISH" : "NEUTRAL",
            rsi: parseFloat(rsi.toFixed(2)),
            momentum: parseFloat(roc.toFixed(2)),
            arbitrageOpportunity: arbSignal,
            arbitrageSpread: parseFloat(arbSpread.toFixed(2))
        }
    };
}
