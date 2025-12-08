import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { StockChart } from "@/components/stock-chart";
import type { Analyze, Report } from "@shared/schema";

export default function Home() {
  const [analysis, setAnalysis] = useState<Analyze | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockChanges, setStockChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analysisRes, reportRes] = await Promise.all([
          fetch('/api/analysis/latest'),
          fetch('/api/report/latest'),
        ]);

        const analysisData = await analysisRes.json();
        const reportData = await reportRes.json();

        setAnalysis(analysisData);
        setReport(reportData);

        // Fetch stock price changes for report stocks
        if (reportData && reportData.stock) {
          const stocks = parseStockList(reportData.stock);
          const changes: Record<string, number> = {};

          await Promise.all(
            stocks.map(async (stock) => {
              try {
                const res = await fetch(`/api/stocks/${stock.trim()}?interval=daily`);
                if (res.ok) {
                  const data = await res.json();
                  changes[stock] = data.changePercent || 0;
                }
              } catch (err) {
                console.error(`Failed to fetch data for ${stock}:`, err);
                changes[stock] = 0;
              }
            })
          );

          setStockChanges(changes);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parseStockList = (stockString: string): string[] => {
    return stockString.split(',').map(s => s.trim()).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-full mx-auto px-2">
        {/* 3 Column Layout: Analysis | Trump Images | Report+Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-4">
          {/* Left Column: Analysis Section */}
          <div>
            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md border-slate-700/50 shadow-2xl h-full">
              <CardHeader className="border-b border-slate-700/50 pb-4">
                <CardTitle className="text-4xl font-bold text-white leading-tight">
                  트럼프 정책 언급...
                  <br />
                  AI 제조 패러다임이 미국으로 이동한다
                </CardTitle>
                <p className="text-lg text-slate-400 mt-3">
                  {analysis?.time || '2025.11.19'}
                </p>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {loading ? (
                  <div className="text-slate-400 text-center py-8">Loading...</div>
                ) : analysis ? (
                  <>
                    <div className="text-slate-300 leading-relaxed text-xl">
                      {analysis.forecast}
                    </div>

                    <div className="text-slate-400 text-lg space-y-2">
                      <p>{analysis.posts}</p>
                    </div>

                    <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 rounded-lg border border-red-500/30">
                      <div className="flex items-center gap-2 text-red-400 font-semibold text-lg">
                        <TrendingUp className="w-7 h-7" />
                        평소 시장 호흡 대비 {analysis.model}% 변동 가능성 관측
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-white font-semibold text-xl">관련주</h4>
                      <div className="space-y-2">
                        {parseStockList(analysis.stock).map((stock, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-green-400 text-lg">• {stock}</span>
                            <a
                              href={`https://finance.yahoo.com/quote/${stock.trim()}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-base hover:underline"
                            >
                              실시간 주가 확인 &gt;
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href={`/tweets?id=${analysis.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-6 text-lg">
                        분석 내용 자세히 보기 &gt;
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-slate-400 text-center py-8">No analysis data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center Column: Trump Images */}
          <div className="flex flex-col items-center justify-start space-y-6 px-4">
            {/* Trump Logo - Top */}
            <div className="relative">
              <img
                src="/trump.jpg"
                alt="Trump Logo"
                className="w-48 h-48 rounded-full border-4 border-slate-700/50 shadow-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-red-500/20 pointer-events-none"></div>
            </div>

            {/* Trump Photo - Bottom */}
            <div className="relative overflow-hidden rounded-lg border-2 border-slate-700/50 shadow-2xl">
              <img
                src="/trump2.png"
                alt="Trump Speech"
                className="w-80 h-96 object-cover"
              />
            </div>
          </div>

          {/* Right Column: Report + Charts */}
          <div className="space-y-4">
            {/* Report Section */}
            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardHeader className="border-b border-slate-700/50 pb-4">
                <CardTitle className="text-4xl font-bold text-white">
                  오늘의 이슈 리포트
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {loading ? (
                  <div className="text-slate-400 text-center py-8">Loading...</div>
                ) : report ? (
                  <>
                    <div className="space-y-2">
                      {parseStockList(report.stock).map((stock, idx) => {
                        const colors = [
                          { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
                          { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
                          { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
                        ];
                        const color = colors[idx % colors.length];
                        const change = stockChanges[stock] || 0;
                        const isPositive = change >= 0;

                        return (
                          <div key={idx} className={`${color.bg} border ${color.border} p-3 rounded flex items-center justify-between`}>
                            <span className={`${color.text} font-semibold text-lg`}>• {stock}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {isPositive ? (
                                  <ArrowUp className="w-4 h-4 text-red-500" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 text-blue-500" />
                                )}
                                <span className={`${isPositive ? 'text-red-500' : 'text-blue-500'} text-lg font-bold`}>
                                  {change > 0 ? '+' : ''}{change.toFixed(2)}%
                                </span>
                              </div>
                              <span className="text-slate-400 text-sm">전날 대비 주가 변동</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                      {report.report}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 text-center py-8">No report data available</div>
                )}
              </CardContent>
            </Card>

            {/* Stock Charts Section - Horizontal Layout */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white px-1">
                * 해외 증시
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <StockChart symbol="SPY" name="S&P 500" color="#ef4444" />
                <StockChart symbol="QQQ" name="NASDAQ 100" color="#3b82f6" />
                <StockChart symbol="DIA" name="Dow Jones" color="#10b981" />
              </div>
            </div>

            {/* Buttons below charts */}
            <div className="flex gap-2">
              <a
                href="https://finance.yahoo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1 py-5">
                  Yahoo finance
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </a>
              <a
                href="https://truthsocial.com/@realDonaldTrump"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1 py-5">
                  Truth Social
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
