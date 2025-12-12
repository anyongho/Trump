import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FaSmile, FaChartLine, FaBolt, FaTags, FaIndustry } from "react-icons/fa";


import { useState } from "react";

export default function About() {
  const [currentCreator, setCurrentCreator] = useState(0);

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
      title: "기업/시장 영향 (Impact on Market)",
      description: `트윗이 시장에 미치는 방식 구분.
      기업영향: 특정 기업/CEO/자산 직접 언급
      시장영향: 산업 또는 경제 전반 영향
      영향없음: 영향 없음`
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

  const creators = [
    {
      name: "안용호",
      role: "KAIST DFMBA 6기",
      description: "농협은행 IT시스템부 네트워크 관리",
      description2: "TRUMP SIGNAL AI 제작 및 유지보수",
      image: "/안용호.jpg",
      bgColor: "bg-[#cfdd8e]", // Lime green shade from example
      label: "1"
    },
    {
      name: "김진영",
      role: "KAIST DFMBA 6기",
      description: "BC카드 신규고객사 유치 RM",
      description2: "TRUMP SIGNAL AI 주가 변동 예측 모형 설계",
      image: "/김진영.png",
      bgColor: "bg-[#f59e0b]", // Orange
      label: "2"
    },
    {
      name: "이소연",
      role: "KAIST DFMBA 6기",
      description: "키움증권 플랫폼 서비스 기획자",
      description2: "TRUMP SIGNAL AI 서비스 디자인 기획",
      image: "/이소연.jpg",
      bgColor: "bg-[#7dd3fc]", // Light blue
      label: "3"
    },
    {
      name: "박정환",
      role: "KAIST DFMBA 6기",
      description: "키움증권 DCM 발행영업",
      description2: "TRUMP SIGNAL AI 서비스 발표 및 비즈니스 영업",
      image: "/박정환.png",
      bgColor: "bg-[#d1d5db]", // Grey
      label: "4"
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
            본 시스템은 트럼프 전 대통령의 Truth Social 게시물을 자동 수집하고, 작성 시각을 미국 동부 시간(ET)으로 기록합니다. 수집된 트윗은 AI 에이전트를 통해 기업·시장·경제적 관점에서 분석되며, 핵심 지표를 추출합니다.
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

          {/* Creator Introduction Section */}
          <section className="mt-20 pt-10 border-t border-border">
            <h3 className="text-3xl font-bold text-center mb-10">Creator Introduction</h3>

            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-border/50 shadow-sm transition-all duration-500">

              {/* Left: Image */}
              <div className="w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0 rounded-full overflow-hidden shadow-2xl border-4 border-background ring-4 ring-border/30 transition-all duration-500">
                <img
                  src={creators[currentCreator].image}
                  alt={creators[currentCreator].name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Right: Content */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-grow space-y-4">
                <h4 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                  {creators[currentCreator].name}
                </h4>

                <h5 className="text-xl font-bold text-muted-foreground">
                  {creators[currentCreator].role}
                </h5>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  {creators[currentCreator].description}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  {creators[currentCreator].description2}
                </p>

                {/* Toggle Buttons */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                  {creators.map((creator, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentCreator(idx)}
                      className={`
                        w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center
                        transition-all duration-300 transform font-semibold text-xs lg:text-sm shadow-md
                        ${creator.bgColor} text-black
                        ${currentCreator === idx
                          ? 'ring-4 ring-offset-4 ring-offset-background ring-primary scale-10'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'}
                      `}
                    >
                      {creator.label || idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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


