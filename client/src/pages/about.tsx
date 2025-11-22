import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FaSmile, FaChartLine, FaBolt, FaTags, FaIndustry } from "react-icons/fa";

export default function About() {
  const metrics = [
    {
      icon: <FaSmile className="text-yellow-500 w-6 h-6" />,
      title: "감성 점수 (Sentiment Score)",
      description: `트윗의 긍정/부정 정도를 -1.0 ~ 1.0 범위로 평가합니다. 
      -1.0: 매우 부정적, 0: 중립, 1.0: 매우 긍정적.
      예: "경제가 매우 강하다" → +0.8, "주식시장이 불안하다" → -0.7`
    },
    {
      icon: <FaChartLine className="text-primary w-6 h-6" />,
      title: "시장 영향도 (Market Impact Score)",
      description: `트윗이 시장에 미치는 영향 강도를 0.0 ~ 1.0 범위로 평가합니다.
      0.0: 영향 없음, 1.0: 매우 큰 영향. 단기 주가 변동, 섹터 민감도, 투자자 반응 기반 계산.`
    },
    {
      icon: <FaBolt className="text-destructive w-6 h-6" />,
      title: "직접/간접 영향 (Impact on Market)",
      description: `트윗이 시장에 미치는 방식 구분.
      Direct: 특정 기업/CEO/자산 직접 언급
      Indirect: 산업 또는 경제 전반 영향
      No: 영향 없음`
    },
    {
      icon: <FaTags className="text-accent w-6 h-6" />,
      title: "키워드 (Keywords)",
      description: `트윗에서 중요 기업, 인물, 경제 용어를 최대 5개 추출합니다.
      예: "Apple, Elon Musk, AI, Inflation, Fed"`
    },
    {
      icon: <FaIndustry className="text-purple-500 w-6 h-6" />,
      title: "섹터 (Sector)",
      description: `트윗이 영향을 미칠 수 있는 11개의 주요 산업군으로 분류합니다. 각 섹터별 상세 설명은 하단을 참고하세요.`
    }
  ];

  const sectorsData = [
    {
      name: "기술 (Technology)",
      description: "소프트웨어, 하드웨어, AI, 반도체 등을 포함한 기술 관련 기업을 포함합니다.",
      companies: "엔비디아, 애플, 마이크로소프트 등",
      etfs: [
        { ticker: "XLK", name: "Technology Select Sector SPDR Fund" },
        { ticker: "VGT", name: "Vanguard Information Technology ETF" },
        { ticker: "IYW", name: "iShares U.S. Technology ETF" }
      ]
    },
    {
      name: "금융 (Financials)",
      description: "은행, 보험사, 증권회사, 자산 운용사 관련 기업이 포함됩니다.",
      companies: "JP모건, 뱅크오브아메리카, 골드만삭스 등",
      etfs: [
        { ticker: "XLF", name: "Financial Select Sector SPDR Fund" },
        { ticker: "VFH", name: "Vanguard Financials ETF" },
        { ticker: "IYF", name: "iShares U.S. Financials ETF" }
      ]
    },
    {
      name: "산업재 (Industrials)",
      description: "항공, 기계, 운송 등의 산업과 관련된 기업이 포함됩니다.",
      companies: "3M, 캐터필러, 보잉 등",
      etfs: [
        { ticker: "XLI", name: "Industrial Select Sector SPDR Fund" },
        { ticker: "VIS", name: "Vanguard Industrials ETF" },
        { ticker: "IYJ", name: "iShares U.S. Industrials ETF" }
      ]
    },
    {
      name: "에너지 (Energy)",
      description: "석유, 전기, 화석, 천연가스 등 에너지 자원과 관련된 기업이 포함됩니다.",
      companies: "엑손모빌, 옥시덴탈 페트롤리움, 셰브론 등",
      etfs: [
        { ticker: "XLE", name: "Energy Select Sector SPDR Fund" },
        { ticker: "VDE", name: "Vanguard Energy ETF" },
        { ticker: "IYE", name: "iShares U.S. Energy ETF" }
      ]
    },
    {
      name: "임의소비재 (Consumer Discretionary)",
      description: "자동차, 가구, 가전, 패스트푸드 등 필수적이지 않은 소비재를 생산하는 기업이 포함됩니다.",
      companies: "아마존, 테슬라, 홈디포, 맥도날드 등",
      etfs: [
        { ticker: "XLY", name: "Consumer Discretionary Select Sector SPDR Fund" },
        { ticker: "VCR", name: "Vanguard Consumer Discretionary ETF" },
        { ticker: "IYC", name: "iShares U.S. Consumer Discretionary ETF" }
      ]
    },
    {
      name: "필수소비재 (Consumer Staples)",
      description: "생활 필수품, 식품 등 기본적인 소비재를 생산하는 기업이 포함됩니다.",
      companies: "월마트, 코카콜라, 프록터앤갬블 등",
      etfs: [
        { ticker: "XLP", name: "Consumer Staples Select Sector SPDR Fund" },
        { ticker: "VDC", name: "Vanguard Consumer Staples ETF" },
        { ticker: "IYK", name: "iShares U.S. Consumer Staples ETF" }
      ]
    },
    {
      name: "커뮤니케이션 (Communication Services)",
      description: "인터넷, 통신, 엔터 관련 기업들이 포함됩니다.",
      companies: "AT&T, 디즈니, 넷플릭스, 버라이즌 등",
      etfs: [
        { ticker: "XLC", name: "Communication Services Select Sector SPDR Fund" },
        { ticker: "VOX", name: "Vanguard Communication Services ETF" },
        { ticker: "IYZ", name: "iShares U.S. Telecommunications ETF" }
      ]
    },
    {
      name: "소재 (Materials)",
      description: "금속, 건축 자재물 등 원자재를 생산, 가공하는 기업이 포함됩니다.",
      companies: "듀폰, 뉴몬트, 프리포트 맥모란 등",
      etfs: [
        { ticker: "XLB", name: "Materials Select Sector SPDR Fund" },
        { ticker: "VAW", name: "Vanguard Materials ETF" },
        { ticker: "IYM", name: "iShares U.S. Basic Materials ETF" }
      ]
    },
    {
      name: "헬스케어 (Health Care)",
      description: "바이오, 제약, 의료, 헬스케어 서비스 등을 제공하는 기업이 포함됩니다.",
      companies: "일라이릴리, 유나이티드헬스, 존슨앤존슨 등",
      etfs: [
        { ticker: "XLV", name: "Health Care Select Sector SPDR Fund" },
        { ticker: "VHT", name: "Vanguard Health Care ETF" },
        { ticker: "IYH", name: "iShares U.S. Healthcare ETF" }
      ]
    },
    {
      name: "유틸리티 (Utilities)",
      description: "전력, 가스, 물 공급과 같은 필수 공공재 기업이 포함됩니다.",
      companies: "넥스트에라 에너지, 도미니언 에너지, 서던 컴퍼니 등",
      etfs: [
        { ticker: "XLU", name: "Utilities Select Sector SPDR Fund" },
        { ticker: "VPU", name: "Vanguard Utilities ETF" },
        { ticker: "IDU", name: "iShares U.S. Utilities ETF" }
      ]
    },
    {
      name: "부동산 (Real Estate)",
      description: "상업용, 주거용 리츠, 부동산 개발, 관리 기업이 포함됩니다.",
      companies: "리얼티 인컴, 에퀴닉스, 아메리칸 타워 등",
      etfs: [
        { ticker: "XLRE", name: "The Real Estate Select Sector SPDR Fund" },
        { ticker: "VNQ", name: "Vanguard Real Estate ETF" },
        { ticker: "IYR", name: "iShares U.S. Real Estate ETF" }
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-background text-foreground">
      <Card className="w-full max-w-6xl text-center bg-card text-card-foreground shadow-xl border border-border py-14 px-12">
        <CardHeader>
          <CardTitle className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-400 drop-shadow-xl tracking-tight">
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
              <div key={idx} className="flex flex-col p-6 bg-muted text-secondary-foreground rounded-xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4 space-x-3">
                  {m.icon}
                  <h3 className="text-xl font-semibold text-foreground">{m.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{m.description}</p>
              </div>
            ))}
          </section>

          {/* 섹터별 상세 설명 */}
          <section>
            <h3 className="text-2xl font-semibold text-foreground mb-4 text-center">섹터별 상세 설명</h3>
            <Accordion type="single" collapsible className="w-full">
              {sectorsData.map((sector, idx) => (
                <AccordionItem value={`item-${idx}`} key={idx}>
                  <AccordionTrigger className="text-lg">{sector.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-4 bg-background rounded-lg border">
                      <p className="text-base text-foreground">{sector.description}</p>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">대표 기업:</h4>
                        <p className="text-sm text-foreground">{sector.companies}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">대표 ETF:</h4>
                        <div className="flex flex-wrap gap-2">
                          {sector.etfs.map(etf => (
                            <a 
                              href={`https://finance.yahoo.com/quote/${etf.ticker}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              key={etf.ticker}
                              title={etf.name}
                              className="transition-transform transform hover:scale-110"
                            >
                              <Badge variant="secondary" className="text-base py-1 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground">
                                {etf.ticker}
                              </Badge>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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

