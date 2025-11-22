import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FaSmile, FaChartLine, FaBolt, FaTags, FaIndustry } from "react-icons/fa";

export default function About() {
  const metrics = [
    {
      icon: <FaSmile className="text-yellow-400 w-6 h-6" />,
      title: "감성 점수 (Sentiment Score)",
      description: `트윗의 긍정/부정 정도를 -1.0 ~ 1.0 범위로 평가합니다. 
      -1.0: 매우 부정적, 0: 중립, 1.0: 매우 긍정적.
      예: "경제가 매우 강하다" → +0.8, "주식시장이 불안하다" → -0.7`
    },
    {
      icon: <FaChartLine className="text-blue-500 w-6 h-6" />,
      title: "시장 영향도 (Market Impact Score)",
      description: `트윗이 시장에 미치는 영향 강도를 0.0 ~ 1.0 범위로 평가합니다.
      0.0: 영향 없음, 1.0: 매우 큰 영향. 단기 주가 변동, 섹터 민감도, 투자자 반응 기반 계산.`
    },
    {
      icon: <FaBolt className="text-red-500 w-6 h-6" />,
      title: "직접/간접 영향 (Impact on Market)",
      description: `트윗이 시장에 미치는 방식 구분.
      Direct: 특정 기업/CEO/자산 직접 언급
      Indirect: 산업 또는 경제 전반 영향
      No: 영향 없음`
    },
    {
      icon: <FaTags className="text-green-400 w-6 h-6" />,
      title: "키워드 (Keywords)",
      description: `트윗에서 중요 기업, 인물, 경제 용어를 최대 5개 추출.
      예: "Apple, Elon Musk, AI, Inflation, Fed"`
    },
    {
      icon: <FaIndustry className="text-purple-500 w-6 h-6" />,
      title: "섹터 (Sector)",
      description: `트윗이 영향을 미칠 수 있는 산업군.
      선택 가능: Financials, Information Technology, Health Care, Consumer Discretionary, Communication Services, Industrials, Consumer Staples, Energy, Real Estate, Materials, Utilities
      예: "Information Technology, Energy"`
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-background text-foreground">
      <Card className="w-full max-w-6xl text-center bg-card text-card-foreground shadow-2xl border border-border py-14 px-12">
        <CardHeader>
          <CardTitle className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 drop-shadow-xl tracking-tight dark:from-blue-500 dark:via-blue-300 dark:to-purple-500">
            트럼프 트윗 기반 AI 분석 시스템
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-6 leading-relaxed max-w-2xl mx-auto font-light">
            대통령 트윗 수집부터 감정·시장 영향 분석까지, 실시간 AI 통합 분석 플랫폼
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-12 pt-8 text-left max-w-5xl mx-auto">
          <section className="text-lg text-foreground leading-relaxed font-light">
            본 시스템은 트럼프 전 대통령의 Truth Social 게시물을 자동 수집하고, 작성 시각을 한국 시간(KST)과 미국 동부 시간(ET)으로 기록합니다. 수집된 트윗은 AI 에이전트를 통해 시장·경제적 관점에서 분석되며, 핵심 지표를 추출합니다.
          </section>

          {/* 핵심 지표 카드 */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col p-6 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4 space-x-3">
                  {m.icon}
                  <h3 className="text-xl font-semibold text-foreground">{m.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{m.description}</p>
              </div>
            ))}
          </section>

          {/* 시스템 동작 프로세스 */}
          <section className="text-lg text-foreground leading-relaxed font-light mt-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">시스템 동작 프로세스</h3>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-sm">
              <li>Truth Social에서 최신 트윗 자동 수집 (중복 및 리트루스 제외)</li>
              <li>트윗 작성 시각을 KST → ET로 변환</li>
              <li>AI 에이전트를 통해 감정 점수, 시장 영향, 키워드, 섹터 추출</li>
              <li>직접/간접/무영향 여부와 영향 점수 계산</li>
              <li>분석 결과를 엑셀 파일로 저장 및 신규 트윗 알림 전송</li>
            </ol>
          </section>

          <div className="flex justify-center mt-14">
            <Link href="/">
              <Button
                variant="outline"
                className="px-10 py-4 text-lg border-input text-foreground hover:bg-accent hover:text-accent-foreground font-semibold rounded-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
