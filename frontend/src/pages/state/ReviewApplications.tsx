import { motion } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockProposals } from '@/data/mockProposals';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function ReviewApplications() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const stateApps = mockProposals.filter(p => p.state === user?.state);
  const filtered = filter === 'all' ? stateApps : stateApps.filter(p => p.clearanceType === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-serif font-bold text-foreground">Review Applications — {user?.state}</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="gov-input w-auto">
          <option value="all">All Types</option>
          <option value="EC">Environmental</option>
          <option value="FC">Forest</option>
          <option value="WL">Wildlife</option>
          <option value="CRZ">CRZ</option>
        </select>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gov-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">District</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.district}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status as any} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">Approve</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-status-review/10 text-status-review hover:bg-status-review/20 transition-colors">Forward</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No proposals found for {user?.state}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
