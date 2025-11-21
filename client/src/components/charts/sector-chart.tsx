import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SectorData } from "@shared/schema";

interface SectorChartProps {
  data: SectorData[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">섹터별 분포</CardTitle>
        <p className="text-xs text-muted-foreground">지정된 11개 섹터</p>
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
                outerRadius={100}
                label={(entry) => entry.sector.length > 15 ? `${entry.sector.slice(0, 15)}...` : entry.sector}
                labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              >
                {topSectors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
