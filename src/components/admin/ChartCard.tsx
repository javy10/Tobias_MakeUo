
'use client';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface ChartCardProps {
  title: string;
  chartData: { name: string; [key: string]: any }[];
  dataKey: string;
  type?: 'bar' | 'line';
  layout?: 'horizontal' | 'vertical';
}

export function ChartCard({ title, chartData, dataKey, type = 'bar', layout = 'horizontal' }: ChartCardProps) {
  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  const ChartElement = type === 'bar' ? Bar : Line;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent 
              data={chartData} 
              layout={layout}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              {layout === 'horizontal' ? (
                <>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                </>
              ) : (
                <>
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                </>
              )}
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }}
              />
              <ChartElement 
                dataKey={dataKey} 
                fill={type === 'bar' ? "hsl(var(--primary))" : undefined} 
                stroke="hsl(var(--primary))" 
                radius={type === 'bar' ? [4, 4, 0, 0] : undefined}
                strokeWidth={2}
                dot={{ r: 5, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                activeDot={{ r: 7, fill: 'hsl(var(--primary))' }}
              />
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
