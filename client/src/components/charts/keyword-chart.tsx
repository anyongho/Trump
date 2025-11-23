import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KeywordData } from "@shared/schema";

interface KeywordChartProps {
  data: KeywordData[];
}

export function KeywordChart({ data }: KeywordChartProps) {
  const processedData = data
    .map(item => ({
      ...item,
      keyword: item.keyword.replace(/\[|\]|'/g, '').trim(),
    }))
    .filter(item => item.keyword !== '');
  const topKeywords = processedData.slice(0, 15);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">주요 키워드 빈도</CardTitle>
        <p className="text-sm text-muted-foreground">가장 많이 언급된 상위 15개 키워드</p>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]" data-testid="chart-keyword">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topKeywords}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <defs>
                <linearGradient id="keywordGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                type="number"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="keyword"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
                stroke="hsl(var(--border))"
                width={100}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" fill="url(#keywordGradient)" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
