import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KeywordData } from "@shared/schema";

interface KeywordChartProps {
  data: KeywordData[];
}

export function KeywordChart({ data }: KeywordChartProps) {
  const topKeywords = data.slice(0, 15);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">주요 키워드 빈도</CardTitle>
        <p className="text-sm text-muted-foreground">가장 많이 언급된 상위 15개 키워드</p>
      </CardHeader>
      <CardContent>
        <div className="h-64" data-testid="chart-keyword">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topKeywords} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                type="category"
                dataKey="keyword"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
                width={90}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
