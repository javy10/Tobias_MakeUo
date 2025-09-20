
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface ChartCardProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    mainValue?: string;
}

export function ChartCard({ title, description, icon: Icon, mainValue, children }: ChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                     {Icon && mainValue && (
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-muted rounded-md">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="text-2xl font-bold">{mainValue}</p>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
