import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  colorClass?: string;
  delay?: number;
}

export default function StatCard({ label, value, icon, colorClass = 'text-primary', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 30 }}
      className="gov-card p-5 md:p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg bg-muted ${colorClass}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
      <h3 className="text-2xl md:text-3xl font-bold tabular-data">{value}</h3>
    </motion.div>
  );
}
