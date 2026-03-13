import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { StatData } from '@/types';

interface ClearanceChartProps {
  data: StatData[];
}

export default function ClearanceChart({ data }: ClearanceChartProps) {
  return (
    <div className="gov-card p-4 md:p-8 h-[350px] md:h-[400px]">
      <h3 className="text-base md:text-lg font-semibold mb-4">Applications by Category</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }} dx={-10} />
          <Tooltip
            cursor={{ fill: 'hsl(220 14% 96% / 0.5)' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="received" name="Received" fill="hsl(215 16% 47% / 0.3)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="approved" name="Approved" fill="hsl(158 64% 22%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
