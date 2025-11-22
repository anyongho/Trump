import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-gradient-to-b from-black to-gray-950 text-white">
      <Card className="w-full max-w-4xl text-center bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10 py-14 px-12">
        <CardHeader>
          <CardTitle className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 drop-shadow-xl tracking-tight">
            Analytical Framework
          </CardTitle>
          <CardDescription className="text-xl text-gray-300 mt-6 leading-relaxed max-w-2xl mx-auto font-light">
            The methodology behind presidential communication analysis and its market implications.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10 pt-4 text-left max-w-3xl mx-auto">
          <section className="text-lg text-gray-200 leading-relaxed font-light">
            This system transforms Truth Social communications into structured intelligence signals. Statements
            made by former President Trump are continuously collected, classified, and analyzed using domain-tuned
            large-language-model agents. Each post is decomposed into sentiment vectors, economic relevance scores,
            targeted policy domains, and potential volatility triggers.
          </section>

          <section className="text-lg text-gray-200 leading-relaxed font-light">
            Our analytical pipeline is designed for researchers, traders, and policy analysts who require clean,
            interpretable insights rather than raw noise. Every extracted feature is cross-referenced with
            historical event patterns, sector-level sensitivities, and macro-economic cycles, enabling both
            short-term signal interpretation and longer-horizon thesis development.
          </section>

          <section className="grid sm:grid-cols-2 gap-6 mt-10">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">Signal Extraction Pipeline</h3>
              <p className="text-gray-300 text-sm leading-relaxed">LLM-driven parsing of sentiment, policy themes, urgency, targets, and economic impact vectors.</p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">Contextual Correlation Models</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Mapping statements against historical market reactions and geopolitical timelines.</p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">Sector Sensitivity Indexing</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Identifying which industries exhibit repeatable reactions to specific communication patterns.</p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">Predictive Impact Forecasts</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Probabilistic modeling of short-term volatility signals and cross-asset implications.</p>
            </div>
          </section>

          <div className="flex justify-center mt-14">
            <Link href="/">
              <Button
                variant="outline"
                className="px-10 py-4 text-lg border-gray-300 text-gray-200 hover:bg-gray-200 hover:text-gray-900 font-semibold rounded-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}