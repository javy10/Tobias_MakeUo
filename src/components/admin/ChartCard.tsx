
'use client';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ChartCardProps {
  title: string;
  chartData: { name: string; [key: string]: any }[];
  dataKey: string;
  type?: 'bar' | 'line';
}

export function ChartCard({ title, chartData, dataKey, type = 'bar' }: ChartCardProps) {
  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  const ChartElement = type === 'bar' ? Bar : Line;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
              />
              <ChartElement dataKey={dataKey} fill="hsl(var(--primary))" stroke="hsl(var(--primary))" radius={type === 'bar' ? [4, 4, 0, 0] : undefined} />
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
