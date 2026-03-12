import { motion } from 'framer-motion';
import { Globe, FileText, CheckCircle2, Users, XCircle } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ClearanceChart from '@/components/charts/ClearanceChart';
import { mockProposals } from '@/data/mockProposals';
import { mockStats } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function CentralDashboard() {
  const { user } = useAuth();
  const total = mockProposals.length;
  const approved = mockProposals.filter(p => p.status === 'Approved').length;
  const committee = mockProposals.filter(p => p.status === 'Committee Review').length;
  const rejected = mockProposals.filter(p => p.status === 'Rejected').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground">Central Authority Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">National overview of all environmental clearance proposals</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Proposals" value={String(total)} icon={<Globe size={20} />} colorClass="text-primary" delay={0} />
        <StatCard label="Committee Review" value={String(committee)} icon={<Users size={20} />} colorClass="text-status-review" delay={0.1} />
        <StatCard label="Approved" value={String(approved)} icon={<CheckCircle2 size={20} />} colorClass="text-accent" delay={0.2} />
        <StatCard label="Rejected" value={String(rejected)} icon={<XCircle size={20} />} colorClass="text-destructive" delay={0.3} />
      </div>

      <ClearanceChart data={mockStats} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gov-card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">All Proposals — National View</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Project</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">State</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProposals.map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.state}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status as any} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">Approve</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">Reject</button>
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
