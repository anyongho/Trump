import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
              margin={{ top: 5, right: 30, left: 20, bottom: 80 }} // Increased bottom margin for rotated labels
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="category" // Changed type to category
                dataKey="keyword" // Set dataKey to keyword
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, angle: -45, textAnchor: 'end' }} // Rotated labels
                interval={0} // Show all labels
                height={70} // Adjusted height for rotated labels
                stroke="hsl(var(--border))"
              />
              <YAxis 
                type="number" // Changed type to number
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
