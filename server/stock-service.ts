import { log } from "./log";
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new (YahooFinance as any)();

interface StockData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    data: {
        time: string;
        value: number;
    }[];
    lastUpdated: number;
}

// In-memory cache
const cache: Record<string, { daily: StockData | null; intraday: StockData | null }> = {
    SPY: { daily: null, intraday: null },
    QQQ: { daily: null, intraday: null },
    DIA: { daily: null, intraday: null },
};

// Cache durations (in milliseconds) - Yahoo is free but let's be polite
const CACHE_DURATION_DAILY = 12 * 60 * 60 * 1000; // 12 hours
const CACHE_DURATION_INTRADAY = 15 * 60 * 1000; // 15 minutes

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class StockService {
    async getStockData(symbol: string, interval: 'daily' | 'intraday' = 'daily'): Promise<StockData | null> {

        const cached = cache[symbol]?.[interval];
        const now = Date.now();
        const duration = interval === 'daily' ? CACHE_DURATION_DAILY : CACHE_DURATION_INTRADAY;

        if (cached && (now - cached.lastUpdated < duration)) {
            // log(`Serving ${symbol} (${interval}) from cache`);
            return cached;
        }

        log(`Fetching ${symbol} (${interval}) from Yahoo Finance`);

        try {
            const endDate = new Date();
            const startDate = new Date(endDate);
            if (interval === 'daily') {
                startDate.setDate(endDate.getDate() - 7); // 1 week
            } else {
                startDate.setTime(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours
            }

            const queryOptions = {
                period1: startDate, // Yahoo Finance accepts Date objects
                interval: interval === 'daily' ? '1d' : '60m',
                includePrePost: true,
            };

            // Cast to any because TypeScript infers 'never' with the conditional queryOptions
            const result = await yahooFinance.chart(symbol, queryOptions) as any;
            const quotes = result.quotes;

            if (!quotes || quotes.length === 0) {
                log(`No data found for ${symbol}`);
                return cached || null;
            }

            // Map data
            const points: { time: string; value: number }[] = [];

            // For daily, just take last 7 days (1W)
            // For intraday, take last 24 points (24h)
            const limit = interval === 'daily' ? 7 : 24;
            const recentQuotes = quotes.slice(-limit);

            for (const quote of recentQuotes) {
                if (quote.close) {
                    points.push({
                        time: quote.date.toISOString(),
                        value: quote.close,
                    });
                }
            }

            const meta = result.meta;
            const currentPrice = meta.regularMarketPrice || quotes[quotes.length - 1].close || 0;
            const previousClose = meta.chartPreviousClose || quotes[0].close || 0;

            // Yahoo meta data usually has the accurate "regularMarketPrice" and "previousClose"
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;

            const stockData: StockData = {
                symbol,
                price: currentPrice,
                change: change,
                changePercent: changePercent,
                data: points,
                lastUpdated: now,
            };

            // Update cache
            if (!cache[symbol]) cache[symbol] = { daily: null, intraday: null };
            cache[symbol][interval] = stockData;

            return stockData;

        } catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
            // Return stale cache if request fails
            return cached || null;
        }
    }

    startPolling() {
        log("Starting stock data polling service (Yahoo Finance)...");
        const symbols = ["SPY", "QQQ", "DIA"];

        const fetchAll = async () => {
            log("Running scheduled stock update...");
            for (const symbol of symbols) {
                try {
                    // Yahoo is fast and allows concurrent requests usually, but we stick to sequential for safety
                    await this.getStockData(symbol, 'daily');
                    await delay(2000);
                    await this.getStockData(symbol, 'intraday'); // Now safe to fetch intraday!
                    await delay(2000);
                } catch (e) {
                    console.error(`Polling error for ${symbol}:`, e);
                }
            }
            log("Scheduled stock update completed.");
        };

        // Initial fetch
        fetchAll();

        // Schedule every 30 minutes
        setInterval(fetchAll, 30 * 60 * 1000);
    }
}

export const stockService = new StockService();
