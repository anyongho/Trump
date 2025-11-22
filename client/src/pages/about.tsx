import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-background text-foreground">
      <Card className="w-full max-w-4xl text-center bg-card text-card-foreground shadow-2xl border border-border py-14 px-12">
        <CardHeader>
          <CardTitle className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 drop-shadow-xl tracking-tight dark:from-blue-500 dark:via-blue-300 dark:to-purple-500">
            트럼프 트윗 기반 분석 시스템
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-6 leading-relaxed max-w-2xl mx-auto font-light">
            대통령 커뮤니케이션 분석과 시장 영향 평가를 위한 체계적 분석 방법론
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10 pt-4 text-left max-w-3xl mx-auto">
          <section className="text-lg text-foreground leading-relaxed font-light">
            본 시스템은 Truth Social에 게시된 트럼프 전 대통령의 메시지를 구조화된 분석 신호로 변환합니다.
            게시글은 지속적으로 수집되며, 도메인 최적화된 대형 언어 모델을 활용하여 분류 및 분석됩니다. 
            각 트윗은 감정 점수, 경제적 연관성, 정책 영역, 잠재적 시장 변동 요인으로 분해됩니다.
          </section>

          <section className="text-lg text-foreground leading-relaxed font-light">
            분석 파이프라인은 연구자, 트레이더, 정책 분석가 등에게 원시 데이터가 아닌
            해석 가능한 통찰을 제공하도록 설계되었습니다. 추출된 모든 특징은
            과거 이벤트 패턴, 산업별 민감도, 거시 경제 주기와 교차 검증되어
            단기 신호 분석과 장기 전략 수립 모두에 활용될 수 있습니다.
          </section>

          <section className="grid sm:grid-cols-2 gap-6 mt-10">
            <div className="p-6 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-2">신호 추출 파이프라인</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                LLM 기반으로 감정, 정책 주제, 긴급성, 대상, 경제 영향 벡터를 파싱합니다.
              </p>
            </div>

            <div className="p-6 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-2">맥락 상관 모델</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                트윗 내용을 과거 시장 반응과 지정학적 사건 시퀀스와 매핑합니다.
              </p>
            </div>

            <div className="p-6 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-2">산업 민감도 지수</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                특정 커뮤니케이션 패턴에 반복적으로 반응하는 산업군을 식별합니다.
              </p>
            </div>

            <div className="p-6 bg-secondary text-secondary-foreground rounded-xl border border-border shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-2">예측 영향 분석</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                단기 변동성 신호와 자산 간 영향도를 확률 모델링하여 예측합니다.
              </p>
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
