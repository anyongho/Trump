import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SectorData } from "@shared/schema";

interface SectorChartProps {
  data: SectorData[];
}

// Expanded color palette for sectors
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

const ALLOWED_SECTORS = [
  "Financials",
  "Information Technology",
  "Health Care",
  "Consumer Discretionary",
  "Communication Services",
  "Industrials",
  "Consumer Staples",
  "Energy",
  "Real Estate",
  "Materials",
  "Utilities",
];

export function SectorChart({ data }: SectorChartProps) {
  const processedData = data
    .map(item => ({
      ...item,
      sector: item.sector.replace(/\[|\]|'/g, '').trim(),
    }))
    .filter(item => item.sector !== '') // Filter out empty strings
    .filter(item => ALLOWED_SECTORS.includes(item.sector));

  const topSectors = processedData.slice(0, 11);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">섹터별 분포</CardTitle>
        <p className="text-sm text-muted-foreground">지정된 11개 섹터 (Donut Chart)</p>
      </CardHeader>
      <CardContent>
        <div className="h-80" data-testid="chart-sector">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topSectors}
                dataKey="count"
                nameKey="sector"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={(entry) => entry.sector.length > 15 ? `${entry.sector.slice(0, 15)}...` : entry.sector}
                labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
              >
                {topSectors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)',
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '20px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
