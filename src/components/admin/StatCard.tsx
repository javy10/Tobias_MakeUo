
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: React.ReactNode; // Changed from string to React.ReactNode
  changeColor?: string; // This will now be a fallback
}

export function StatCard({ title, value, icon: Icon, change, changeColor }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-gradient-to-tl from-purple-700 to-pink-500 rounded-lg text-white shadow-md">
            <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {typeof change === 'string' ? (
           <p className={cn("text-xs text-muted-foreground", changeColor)}>
             {change}
           </p>
        ) : (
          <div className="text-xs text-muted-foreground">
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
