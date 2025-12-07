import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { ImpactCategoryData } from "@shared/schema";

interface ImpactCategoryChartProps {
  data: ImpactCategoryData[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
];

export function ImpactCategoryChart({ data }: ImpactCategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const translatedData = data.map(d => ({
    ...d,
    displayCategory: d.category === 'Direct' ? '기업언급' :
      d.category === 'Indirect' ? '시장영향' :
        d.category === 'No' ? '영향없음' : d.category,
    percentage: total > 0 ? ((d.count / total) * 100).toFixed(1) : '0',
  }));

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">시장 영향도 카테고리</CardTitle>
        <p className="text-sm text-muted-foreground">카테고리별 트윗 수 및 비율</p>
      </CardHeader>
      <CardContent>
        <div className="h-80" data-testid="chart-impact-category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={translatedData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="displayCategory"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 500 }}
                stroke="hsl(var(--border))"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
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
                formatter={(value: any, name: any, props: any) => [
                  `${value} (${props.payload.percentage}%)`,
                  '트윗 수'
                ]}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={80}>
                {translatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList dataKey="percentage" position="top" formatter={(val: string) => `${val}%`} fill="hsl(var(--foreground))" fontSize={12} fontWeight={500} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
