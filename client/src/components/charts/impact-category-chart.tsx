import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  const translatedData = data.map(d => ({
    ...d,
    displayCategory: d.category === 'Direct' ? '직접' : 
                     d.category === 'Indirect' ? '간접' : 
                     d.category === 'No' ? '영향없음' : d.category,
  }));

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">시장 영향도 카테고리</CardTitle>
        <p className="text-xs text-muted-foreground">카테고리별 트윗 수</p>
      </CardHeader>
      <CardContent>
        <div className="h-80" data-testid="chart-impact-category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={translatedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="displayCategory"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
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
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {translatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
