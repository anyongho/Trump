import { useState, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface StockChartProps {
    symbol: string;
    name: string;
    color?: string;
}

export function StockChart({ symbol, name, color = "#2563eb" }: StockChartProps) {
    const [data, setData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [interval, setInterval] = useState<'daily' | 'intraday'>('daily');
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/stocks/${symbol}?interval=${interval}`);
            if (!res.ok) {
                if (res.status === 503) {
                    // Check if we have response text
                    const text = await res.text();
                    try {
                        const json = JSON.parse(text);
                        throw new Error(json.error || "Service busy");
                    } catch {
                        throw new Error("Service busy");
                    }
                }
                throw new Error("Failed to fetch data");
            }
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Data unavailable");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [symbol, interval]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (interval === 'daily') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        }
    };

    return (
        <Card className="shadow-md border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="py-3 px-4 space-y-0">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{name}</CardTitle>
                        {!loading && data ? (
                            <div className="flex items-baseline space-x-2 mt-1">
                                <span className="text-xl font-bold tracking-tight">{formatPrice(data.price)}</span>
                                <span className={cn(
                                    "flex items-center text-xs font-bold px-1.5 py-0.5 rounded",
                                    data.change >= 0
                                        ? "text-emerald-500 bg-emerald-500/10"
                                        : "text-rose-500 bg-rose-500/10"
                                )}>
                                    {data.change >= 0 ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                                    {Math.abs(data.changePercent).toFixed(2)}%
                                </span>
                            </div>
                        ) : (
                            <Skeleton className="h-7 w-24 mt-1" />
                        )}
                    </div>

                    <div className="flex bg-muted/50 rounded-lg p-0.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-6 text-[10px] px-2 rounded-md transition-all",
                                interval === 'daily' ? "bg-background shadow-sm text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => setInterval('daily')}
                        >
                            1W
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-6 text-[10px] px-2 rounded-md transition-all",
                                interval === 'intraday' ? "bg-background shadow-sm text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => setInterval('intraday')}
                        >
                            1D
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 relative">
                <div className="h-[300px] w-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <RefreshCw className="w-5 h-5 animate-spin opacity-50" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-xs text-muted-foreground px-4 text-center">
                            <AlertCircle className="w-4 h-4 mb-2 opacity-50" />
                            <p>{error}</p>
                            <Button variant="link" size="sm" className="h-6 text-xs mt-1" onClick={fetchData}>
                                Retry
                            </Button>
                        </div>
                    ) : data ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={formatDate}
                                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tickFormatter={(val) => `$${val}`}
                                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={40}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-popover/95 backdrop-blur border border-border px-3 py-2 rounded-lg shadow-xl text-xs">
                                                    <p className="text-muted-foreground mb-1 font-mono">{formatDate(label)}</p>
                                                    <p className="font-bold text-base" style={{ color: color }}>
                                                        {formatPrice(payload[0].value as number)}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${symbol})`}
                                    animationDuration={1000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : null}
                </div>
            </CardContent>
            {/* Last updated indicator moved to footer area for better spacing */}
            {!loading && !error && data && (
                <div className="px-4 pb-3 pt-1 text-[10px] text-muted-foreground/50 font-mono text-right">
                    Last updated: {new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </Card>
    );
}
