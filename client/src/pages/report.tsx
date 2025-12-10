import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Clock, DollarSign } from "lucide-react";

export default function Report() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-600 to-amber-700 border-4 border-yellow-500 rounded-lg p-8 mb-8 shadow-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <FileText className="w-12 h-12 text-white" />
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    "엔비디아 H200 중국 수출 가능성, 주가 상승 이끄나?"
                                </h1>
                                <p className="text-yellow-100 text-lg">
                                    NVIDIA H200 중국 수출 규제 완화에 따른 시장 반응 분석 보고서
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-white text-2xl font-bold">2025.12.11일자</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="bg-blue-900/50 backdrop-blur-sm rounded-lg p-4 border border-blue-400">
                            <p className="text-blue-200 text-sm leading-relaxed">
                                "I have informed President Xi, of China, that the United States will allow NVIDIA to ship its H200 products to approved customers in China, and other Countries, under conditions that allow for continued strong National Security."
                            </p>
                            <p className="text-blue-300 mt-2 text-xs">
                                “나는 중국의 시 주석에게, 미국이 국가 안보를 확실히 유지할 수 있는 조건 하에서, 엔비디아가 H200 제품을 중국 및 다른 국가의 ‘승인된 고객’에게 출하하도록 허용할 것임을 알렸다.”
                            </p>
                        </div>
                        <div className="bg-teal-900/50 backdrop-blur-sm rounded-lg p-4 border border-teal-400">
                            <p className="text-teal-200 text-sm leading-relaxed">
                                "The Department of Commerce is finalizing the details, and the same approach will apply to AMD, Intel, and other GREAT American Companies"
                            </p>
                            <p className="text-teal-300 mt-2 text-xs">
                                "상무부가 세부 내용을 마무리하고 있으며, 동일한 방식이 AMD, 인텔, 그리고 다른 뛰어난 미국 기업들에게도 적용될 것이다."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Executive Summary */}
                <Card className="mb-6 bg-slate-800/95 backdrop-blur-md border-slate-700 shadow-xl">
                    <CardHeader className="border-b border-slate-700">
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                            1. 요약 (Executive Summary)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 text-slate-200 space-y-4">
                        <p className="leading-relaxed">
                            2025년 12월 9일(한국시간), 미국 정부가 NVIDIA의 H200 AI GPU를 중국에 조건부 수출 허용할 것이라는 소식이 두 단계로 공개되며
                            NVIDIA 및 AI 반도체 섹터는 각각 1차·2차 급등을 기록하였다.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-blue-900/30 rounded-lg p-4 border-l-4 border-blue-500">
                                <h4 className="text-blue-300 font-semibold mb-2">1차 급등 (KST 02:56)</h4>
                                <p className="text-slate-300 text-sm">
                                    Semafor의 단독 보도로 H200 수출 허용 계획이 최초 공개되며 프리마켓에서 NVIDIA 및 AI 반도체 업종이 강세를 보임.
                                </p>
                            </div>
                            <div className="bg-green-900/30 rounded-lg p-4 border-l-4 border-green-500">
                                <h4 className="text-green-300 font-semibold mb-2">2차 급등 (KST 06:29)</h4>
                                <p className="text-slate-300 text-sm">
                                    도널드 트럼프 대통령이 Truth Social에서 이를 공식화하며 "25% 회수 구조" 및 "AMD·Intel 동일 적용" 등을 발표.
                                    정책 확정 신호로 해석되며 애프터마켓에서 추가 상승 발생.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="mb-6 bg-slate-800/95 backdrop-blur-md border-slate-700 shadow-xl">
                    <CardHeader className="border-b border-slate-700">
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                            <Clock className="w-6 h-6 text-yellow-400" />
                            2. 사건 타임라인 (한국시간 기반, 미국시간 병기)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-600">
                                        <th className="text-left p-3 text-slate-300 font-semibold">단계</th>
                                        <th className="text-left p-3 text-slate-300 font-semibold">한국시간(KST)</th>
                                        <th className="text-left p-3 text-slate-300 font-semibold">미국 동부시간(EST)</th>
                                        <th className="text-left p-3 text-slate-300 font-semibold">사건 내용</th>
                                        <th className="text-left p-3 text-slate-300 font-semibold">출처</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-700 bg-blue-900/20">
                                        <td className="p-3 text-blue-300 font-semibold">1차 급등</td>
                                        <td className="p-3 text-slate-200">12/09 02:56</td>
                                        <td className="p-3 text-slate-200">12/08 12:56 PM</td>
                                        <td className="p-3 text-slate-200">Semafor 단독: "미국 상무부, NVIDIA H200 중국 수출 허용 계획" 공개</td>
                                        <td className="p-3 text-slate-200">Semafor 기사 / MarketScreener</td>
                                    </tr>
                                    <tr className="bg-green-900/20">
                                        <td className="p-3 text-green-300 font-semibold">2차 급등</td>
                                        <td className="p-3 text-slate-200">12/09 06:29</td>
                                        <td className="p-3 text-slate-200">12/08 04:29 PM</td>
                                        <td className="p-3 text-slate-200">트럼프 Truth Social 공식 발표: "수출 허용 + 25% 회수 + AMD/Intel 동일 적용"</td>
                                        <td className="p-3 text-slate-200">Reuters 보도 / Truth Social</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Analysis Sections */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Phase 1 */}
                    <Card className="bg-slate-800/95 backdrop-blur-md border-blue-700 shadow-xl">
                        <CardHeader className="border-b border-slate-700 bg-blue-900/30">
                            <CardTitle className="text-xl text-blue-300">3. 1차 급등 분석: Semafor 단독 보도</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-slate-200 space-y-4">
                            <div>
                                <h4 className="font-semibold text-white mb-2">(1) 사건 내용</h4>
                                <p className="text-sm">
                                    Semafor는 미국 상무부가 NVIDIA H200 GPU의 중국 수출을 특정 조건 아래 허용하는 계획을 검토 중이라고 보도하였다.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">(2) 시장반응</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                    <li>프리마켓에서 NVIDIA +2%대 즉시 상승</li>
                                    <li>반도체 ETF(SMH, SOXX) 동반 상승</li>
                                    <li>중국 매출 비중이 큰 AI칩 기업들의 밸류에이션 디스카운트 축소</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">(3) 투자자 심리 변화</h4>
                                <div className="bg-slate-900/50 rounded p-3 space-y-2 text-sm">
                                    <p><span className="text-red-400">기존:</span> "미국 규제로 중국 매출 차단 → 성장 둔화"</p>
                                    <p><span className="text-green-400">변화:</span> "조건부 허용 → 매출 회복 가능성"</p>
                                    <p><span className="text-blue-400">결과:</span> 긍정적 감정 전환 (감정점수 +0.78)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Phase 2 */}
                    <Card className="bg-slate-800/95 backdrop-blur-md border-green-700 shadow-xl">
                        <CardHeader className="border-b border-slate-700 bg-green-900/30">
                            <CardTitle className="text-xl text-green-300">4. 2차 급등 분석: 트럼프 Truth Social 공식 발표</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-slate-200 space-y-4">
                            <div>
                                <h4 className="font-semibold text-white mb-2">(1) 사건 내용</h4>
                                <p className="text-sm mb-2">
                                    Semafor 보도가 나온 지 약 3시간 30분 후, 트럼프 대통령은 Truth Social에서 다음 내용을 발표:
                                </p>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                    <li>H200 중국 수출 허용</li>
                                    <li>미국 정부가 관련 매출의 25% 회수</li>
                                    <li>AMD·Intel도 동일 규제 완화 적용 예정</li>
                                    <li>고성능 AI칩(Blackwell·Rubin)은 여전히 규제 대상</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">(2) 시장 반응</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                    <li>애프터마켓에서 반도체 전섹터 강세</li>
                                    <li>기관투자자 매수량 증가</li>
                                    <li>정규장에서 추가 반영 가능성 확대</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">(3) 투자자 심리 변화</h4>
                                <div className="bg-slate-900/50 rounded p-3 space-y-2 text-sm">
                                    <p>루머 → 정책 확정으로 2단계 심리 개선</p>
                                    <p className="text-green-400 font-bold">감정점수: +0.90 (강한 긍정)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Industry Impact */}
                <Card className="mb-6 bg-slate-800/95 backdrop-blur-md border-slate-700 shadow-xl">
                    <CardHeader className="border-b border-slate-700">
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-yellow-400" />
                            6. 산업적 영향 분석
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-700">
                                <h4 className="text-green-300 font-semibold mb-3 text-lg">NVIDIA</h4>
                                <ul className="text-slate-200 text-sm space-y-2 list-disc list-inside">
                                    <li>중국 매출 복구 가능성</li>
                                    <li>Blackwell·Rubin 제외는 초고성능 AI칩 경쟁력 보호</li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg p-4 border border-blue-700">
                                <h4 className="text-blue-300 font-semibold mb-3 text-lg">AMD·Intel</h4>
                                <ul className="text-slate-200 text-sm space-y-2 list-disc list-inside">
                                    <li>동일 정책 적용 발표로 주가 호재</li>
                                    <li>AI GPU 경쟁력 시장 재평가 가능성</li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-700">
                                <h4 className="text-purple-300 font-semibold mb-3 text-lg">미국 반도체 ETF</h4>
                                <ul className="text-slate-200 text-sm space-y-2 list-disc list-inside">
                                    <li>SMH, SOXX 등 규제 리스크 완화</li>
                                    <li>멀티플 상향 요인</li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-lg p-4 border border-orange-700">
                                <h4 className="text-orange-300 font-semibold mb-3 text-lg">중국 내 AI 인프라</h4>
                                <ul className="text-slate-200 text-sm space-y-2 list-disc list-inside">
                                    <li>H200 공급 재개 가능성</li>
                                    <li>단기적 수요 개선</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Conclusion */}
                <Card className="bg-gradient-to-br from-blue/60 to-gray-900/60 backdrop-blur-md border-gray-700 shadow-xl">
                    <CardHeader className="border-b border-blue-700">
                        <CardTitle className="text-2xl text-white">7. 결론</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 text-slate-100 space-y-4">
                        <p className="leading-relaxed text-lg">
                            NVIDIA H200 중국 수출 규제 완화 소식은 한국시간 KST 기준 <span className="text-blue-300 font-bold">02:56</span>과
                            <span className="text-green-300 font-bold"> 06:29</span>의 두 단계 이벤트에서 시장에 각기 다른 성격의 충격을 주었다.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-blue-600/20 rounded-lg p-4 border-2 border-blue-500">
                                <h4 className="text-blue-300 font-bold text-lg mb-2">Semafor 기사</h4>
                                <p className="text-white text-xl font-bold">정보 충격</p>
                                <p className="text-blue-200 text-sm">(INFORMATION SHOCK)</p>
                            </div>

                            <div className="bg-green-600/20 rounded-lg p-4 border-2 border-green-500">
                                <h4 className="text-green-300 font-bold text-lg mb-2">트럼프 공식 발표</h4>
                                <p className="text-white text-xl font-bold">확정 충격</p>
                                <p className="text-green-200 text-sm">(POLICY CONFIRMATION SHOCK)</p>
                            </div>
                        </div>

                        <p className="leading-relaxed text-lg mt-6 text-center font-semibold">
                            이 두 사건은 각각 독립적인 매수 트리거를 만들었고, 결과적으로 AI칩 섹터의 구조적
                            <span className="text-green-400 text-2xl mx-2">🟢 강세</span>를 이끌었다.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
