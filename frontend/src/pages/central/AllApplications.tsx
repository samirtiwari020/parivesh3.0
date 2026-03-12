import { motion } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockProposals } from '@/data/mockProposals';
import { useState } from 'react';

export default function AllApplications() {
  const [stateFilter, setStateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const states = [...new Set(mockProposals.map(p => p.state))];
  const filtered = mockProposals
    .filter(p => stateFilter === 'all' || p.state === stateFilter)
    .filter(p => typeFilter === 'all' || p.clearanceType === typeFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-serif font-bold text-foreground">All Applications — National</h2>
        <div className="flex gap-2">
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="gov-input w-auto">
            <option value="all">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="gov-input w-auto">
            <option value="all">All Types</option>
            <option value="EC">EC</option>
            <option value="FC">FC</option>
            <option value="WL">WL</option>
            <option value="CRZ">CRZ</option>
          </select>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gov-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">State</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Type</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Proponent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.state}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">{app.proponent}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status as any} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">Approve</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-status-pending/10 text-status-pending hover:bg-status-pending/20 transition-colors">Clarify</button>
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
