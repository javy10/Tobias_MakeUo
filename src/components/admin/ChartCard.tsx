
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface ChartCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    children: React.ReactNode;
    mainValue?: string;
}

export function ChartCard({ title, description, icon: Icon, mainValue, children }: ChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="flex items-center gap-2">
                    {mainValue && (
                        <>
                             <div className="p-2 bg-muted rounded-md">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="text-2xl font-bold">{mainValue}</p>
                        </>
                    )}
                </div>
                 {!mainValue && (
                     <CardDescription>{description}</CardDescription>
                 )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
