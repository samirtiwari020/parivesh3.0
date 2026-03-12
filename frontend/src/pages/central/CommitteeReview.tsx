import { motion } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockProposals } from '@/data/mockProposals';

export default function CommitteeReview() {
  const committeeApps = mockProposals.filter(p => ['Committee Review', 'Recommended'].includes(p.status));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-xl font-serif font-bold text-foreground">Committee Reviews</h2>
      <p className="text-sm text-muted-foreground">Proposals currently under Expert Appraisal Committee review</p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gov-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">State</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {committeeApps.map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.state}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status as any} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">Approve</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">Reject</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-status-pending/10 text-status-pending hover:bg-status-pending/20 transition-colors">Send Back</button>
                    </div>
                  </td>
                </tr>
              ))}
              {committeeApps.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No proposals in committee review</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
