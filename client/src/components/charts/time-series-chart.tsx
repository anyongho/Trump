import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from "@shared/schema";
import { format, parseISO } from "date-fns";

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  const formattedData = data.map(d => ({
    ...d,
    displayDate: format(parseISO(d.date), 'MM/dd'),
  }));

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">시계열 트렌드</CardTitle>
        <p className="text-sm text-muted-foreground">시간에 따른 감정 점수와 시장 영향도 변화</p>
      </CardHeader>
      <CardContent>
        <div className="h-96" data-testid="chart-time-series">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="displayDate"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
                tickFormatter={(value) => value.toFixed(2)} // Format Y-axis ticks
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => { // Format Tooltip values
                  if (name === 'sentiment') return [`감정 점수: ${value.toFixed(2)}`, name];
                  if (name === 'marketImpact') return [`시장 영향도: ${value.toFixed(2)}`, name];
                  return [value.toFixed(2), name];
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                }}
                formatter={(value) => {
                  if (value === 'sentiment') return '감정 점수';
                  if (value === 'marketImpact') return '시장 영향도';
                  return value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sentiment" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="marketImpact" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
