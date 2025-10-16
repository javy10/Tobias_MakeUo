
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: React.ReactNode; // Changed from string to React.ReactNode
  changeColor?: string; // This will now be a fallback
}

export function StatCard({ title, value, icon: Icon, change, changeColor }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
    >
      <Card className="style-2-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
          <motion.div 
            className="p-2 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg text-white shadow-md style-2-glow"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
              <Icon className="h-4 w-4" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="text-2xl font-bold text-cyan-400 glow-effect"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {value}
          </motion.div>
          {typeof change === 'string' ? (
             <p className={cn("text-xs text-gray-300", changeColor)}>
               {change}
             </p>
          ) : (
            <div className="text-xs text-gray-300">
              {change}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
