import { motion } from 'framer-motion';
import { FileSearch, Clock, CheckCircle2, Send, MapPin } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ClearanceChart from '@/components/charts/ClearanceChart';
import { mockProposals } from '@/data/mockProposals';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function StateDashboard() {
  const { user } = useAuth();
  const stateApps = mockProposals.filter(p => p.state === user?.state);
  const pendingReview = stateApps.filter(p => ['Submitted', 'Pending'].includes(p.status)).length;
  const underReview = stateApps.filter(p => p.status === 'Under Review').length;
  const forwarded = stateApps.filter(p => ['Committee Review', 'Recommended'].includes(p.status)).length;

  const chartData = [
    { name: 'EC', received: stateApps.filter(p => p.clearanceType === 'EC').length, approved: 0, pending: 0, rejected: 0 },
    { name: 'FC', received: stateApps.filter(p => p.clearanceType === 'FC').length, approved: 0, pending: 0, rejected: 0 },
    { name: 'WL', received: stateApps.filter(p => p.clearanceType === 'WL').length, approved: 0, pending: 0, rejected: 0 },
    { name: 'CRZ', received: stateApps.filter(p => p.clearanceType === 'CRZ').length, approved: 0, pending: 0, rejected: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">State Review Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin size={14} /> Viewing proposals for <strong>{user?.state || 'All States'}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="State Proposals" value={String(stateApps.length)} icon={<FileSearch size={20} />} colorClass="text-primary" delay={0} />
        <StatCard label="Pending Review" value={String(pendingReview)} icon={<Clock size={20} />} colorClass="text-status-pending" delay={0.1} />
        <StatCard label="Under Review" value={String(underReview)} icon={<FileSearch size={20} />} colorClass="text-status-review" delay={0.2} />
        <StatCard label="Forwarded to Central" value={String(forwarded)} icon={<Send size={20} />} colorClass="text-accent" delay={0.3} />
      </div>

      <ClearanceChart data={chartData} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gov-card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Proposals Requiring Review — {user?.state}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Project</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">District</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Sector</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stateApps.slice(0, 5).map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.district}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.sector}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status as any} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to="/state/review" className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Review</Link>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">Forward</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
