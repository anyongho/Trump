import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Megaphone, BarChart3 } from "lucide-react";
import { StockChart } from "@/components/stock-chart";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Main Content Area */}
        <Card className="w-full text-center bg-card text-card-foreground shadow-xl border border-border py-10 px-8">
          <CardHeader>
            <img
              src="/trump.jpg"
              alt="Trump Artwork"
              className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-xl object-cover"
            />
            <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent tracking-tight leading-tight drop-shadow-lg">
              트럼프 대통령 트윗 기반 분석 시스템
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl mx-auto font-light">
              Truth Social 기반 대통령 발언 데이터를 구조화해 정책 변동, 시장 리스크, 산업별 민감도를 분석하는 전문-grade 경제 신호 시스템.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 pt-4">
            <section className="text-base text-foreground max-w-2xl mx-auto leading-relaxed font-light">
              OpenAI 기반 분석 알고리즘이 트럼프 대통령의 Truth Social 게시물을 실시간 수집 및 해석합니다. 각 발언은 감성 스코어, 정책 방향성, 산업군별 영향도, 변동성 신호 등으로 정교하게 분류되어 시장 분석에 활용됩니다.
            </section>

            <section className="grid sm:grid-cols-3 gap-4 text-left mt-6">
              <div className="p-5 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <Megaphone className="w-6 h-6 text-primary mb-2" />
                <h3 className="text-lg font-semibold text-foreground mb-1">실시간 발언 감성 분석</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">톤, 강도, 우선순위, 경제적 맥락을 실시간으로 구조화.</p>
              </div>

              <div className="p-5 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <Flag className="w-6 h-6 text-primary mb-2" />
                <h3 className="text-lg font-semibold text-foreground mb-1">정책-산업 매핑 모델</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">에너지, 방위산업, 기술주, 농업, 환율 민감 업종과 자동 연동.</p>
              </div>

              <div className="p-5 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <BarChart3 className="w-6 h-6 text-primary mb-2" />
                <h3 className="text-lg font-semibold text-foreground mb-1">시장 변동성 예측</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">역사적 상관관계 기반 변동성 트리거 및 방향성 예측 제공.</p>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/tweets">
                <Button className="w-full sm:w-auto px-8 py-4 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-primary">
                  실시간 분석보기
                </Button>
              </Link>

              <Link href="/about">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 text-base border-input text-foreground hover:bg-accent hover:text-accent-foreground font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  분석 구조 살펴보기
                </Button>
              </Link>
              <a
                href="https://www.truthsocial.com/@realDonaldTrump"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto px-8 py-4 text-base bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-foreground font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-red-400/40">
                  Trump Truth Social
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-muted-foreground text-xs opacity-80 tracking-wide pb-4">
          © 2025 대통령 발언 기반 시장 신호 분석 시스템. 연구 및 분석 목적의 데이터만 제공합니다.
        </footer>

        {/* Stock Charts Section - Moved to bottom for full width */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold px-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            시장 주요 지수
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StockChart symbol="SPY" name="S&P 500" color="#ef4444" />
            <StockChart symbol="QQQ" name="NASDAQ 100" color="#3b82f6" />
            <StockChart symbol="DIA" name="Dow Jones" color="#10b981" />
          </div>
        </div>
      </div>
    </div>
  );
}
