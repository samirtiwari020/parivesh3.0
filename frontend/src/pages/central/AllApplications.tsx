import { motion } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useState } from 'react';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';
import { Link } from 'react-router-dom';
import { apiRequest } from '@/lib/api';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

export default function AllApplications() {
  const [stateFilter, setStateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { applications, states, isLoading, loadError, refetch } = useWorkflowApplications();

  const filtered = applications
    .filter((application) => stateFilter === 'all' || application.state === stateFilter)
    .filter((application) => typeFilter === 'all' || application.clearanceType === typeFilter);

  const runAction = async (applicationId: string, action: 'APPROVE' | 'REJECT' | 'SEND_BACK') => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setActionError('Session expired. Please login again.');
      return;
    }

    setActionError('');
    setActionLoadingId(applicationId);

    try {
      await apiRequest(`/api/applications/${applicationId}/review`, {
        method: 'POST',
        token,
        body: JSON.stringify({ action }),
      });
      await refetch();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

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
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Loading applications...</td></tr>
              ) : loadError ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-destructive">{loadError}</td></tr>
              ) : filtered.map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.state}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">{app.proponent}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/central/applications/${app.id}`} className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View</Link>
                      <button onClick={() => runAction(app.id, 'APPROVE')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50">Approve</button>
                      <button onClick={() => runAction(app.id, 'SEND_BACK')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-status-pending/10 text-status-pending hover:bg-status-pending/20 transition-colors disabled:opacity-50">Clarify</button>
                      <button onClick={() => runAction(app.id, 'REJECT')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !loadError && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {actionError && <p className="px-6 py-4 text-xs text-destructive border-t border-border">{actionError}</p>}
      </motion.div>
    </div>
  );
}
