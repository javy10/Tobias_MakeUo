
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface ChartCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

export function ChartCard({ title, description, icon: Icon, children }: ChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
