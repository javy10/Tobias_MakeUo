
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartCardProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    mainValue?: string;
}

export function ChartCard({ title, description, icon: Icon, mainValue, children }: ChartCardProps) {
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
          <Card className="style-2-card">
              <CardHeader>
                  <div className="flex items-start justify-between">
                      <div>
                          <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
                          <CardDescription className="text-gray-300">{description}</CardDescription>
                      </div>
                       {Icon && mainValue && (
                          <motion.div 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                               <motion.div 
                                 className="p-2 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-md style-2-glow"
                                 whileHover={{ scale: 1.1, rotate: 5 }}
                                 transition={{ duration: 0.2 }}
                               >
                                  <Icon className="h-4 w-4 text-white" />
                              </motion.div>
                              <motion.p 
                                className="text-2xl font-bold text-cyan-400 glow-effect"
                                initial={{ scale: 0.8 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                              >
                                {mainValue}
                              </motion.p>
                          </motion.div>
                      )}
                  </div>
              </CardHeader>
              <CardContent>
                  {children}
              </CardContent>
          </Card>
        </motion.div>
    );
}
