import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Megaphone, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-background text-foreground">
      <Card className="w-full max-w-5xl text-center bg-card text-card-foreground shadow-2xl border border-border py-14 px-10">
        <CardHeader>
          {/* public 폴더 기준 루트 경로 사용 */}
          <img
            src="/trump.jpg"
            alt="Trump Artwork"
            className="w-48 h-48 rounded-full mx-auto mb-6 border border-border shadow-lg object-cover"
          />
          <CardTitle
  className="
    text-5xl font-extrabold
    text-transparent bg-clip-text
    bg-gradient-to-r
      from-blue-400 via-blue-200 to-red-400
    tracking-tight leading-tight
    drop-shadow-lg
    dark:from-blue-500 dark:via-blue-300 dark:to-red-500
    dark:drop-shadow-xl
  "
> 트럼프 대통령 트윗 기반 분석 시스템
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-6 leading-relaxed max-w-3xl mx-auto font-light">
            Truth Social 기반 대통령 발언 데이터를 구조화해 정책 변동, 시장 리스크, 산업별 민감도를 분석하는 전문-grade 경제 신호 시스템.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-12 pt-4">
          <section className="text-lg text-foreground max-w-3xl mx-auto leading-relaxed font-light">
            OpenAI 기반 분석 알고리즘이 트럼프 대통령의 Truth Social 게시물을 실시간 수집 및 해석합니다. 각 발언은 감성 스코어, 정책 방향성, 산업군별 영향도, 변동성 신호 등으로 정교하게 분류되어 시장 분석에 활용됩니다.
            <br /><br />
            연구자, 트레이더, 정책 분석가가 필요로 하는 신뢰도 높은 구조화된 정보를 제공합니다.
          </section>

          <section className="grid sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-8">
            <div className="p-6 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-lg">
              <Megaphone className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold text-foreground mb-2">실시간 발언 감성 분석</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">톤, 강도, 우선순위, 경제적 맥락을 실시간으로 구조화.</p>
            </div>

            <div className="p-6 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-lg">
              <Flag className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold text-foreground mb-2">정책-산업 매핑 모델</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">에너지, 방위산업, 기술주, 농업, 환율 민감 업종과 자동 연동.</p>
            </div>

            <div className="p-6 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-lg">
              <BarChart3 className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold text-foreground mb-2">시장 변동성 예측</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">역사적 상관관계 기반 변동성 트리거 및 방향성 예측 제공.</p>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-12">
            <Link href="/tweets">
              <Button className="w-full sm:w-auto px-12 py-5 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-primary">
                실시간 분석보기
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-12 py-5 text-lg border-input text-foreground hover:bg-accent hover:text-accent-foreground font-semibold rounded-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                분석 구조 살펴보기
              </Button>
            </Link>
            <a
              href="https://www.truthsocial.com/@realDonaldTrump"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full sm:w-auto px-12 py-5 text-lg bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-foreground font-semibold rounded-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-red-400/40">
                Trump Truth Social
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-20 text-muted-foreground text-sm opacity-80 tracking-wide">
        © 2025 대통령 발언 기반 시장 신호 분석 시스템. 연구 및 분석 목적의 데이터만 제공합니다.
      </footer>
    </div>
  );
}
