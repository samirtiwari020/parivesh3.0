import { motion } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ProposalMapVisualization from '@/components/maps/ProposalMapVisualization';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';
import { apiRequest } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Globe, MapPin } from 'lucide-react';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

export default function ReviewApplications() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { applications, isLoading, loadError, refetch } = useWorkflowApplications();
  const stateApps = applications.filter((application) => application.state === user?.state);
  const filtered = filter === 'all'
    ? stateApps
    : stateApps.filter((application) => application.clearanceType === filter);

  const runAction = async (applicationId: string, action: 'APPROVE' | 'REJECT' | 'FORWARD' | 'SEND_BACK') => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setActionError('Session expired. Please login again.');
      return;
    }

    let remarks: string | undefined;
    if (action === 'SEND_BACK') {
      const comment = window.prompt('Enter clarification comment for applicant:');
      if (!comment || !comment.trim()) {
        setActionError('Clarification comment is required.');
        return;
      }
      remarks = comment.trim();
    }

    setActionError('');
    setActionLoadingId(applicationId);

    try {
      await apiRequest(`/api/applications/${applicationId}/review`, {
        method: 'POST',
        token,
        body: JSON.stringify({ action, remarks }),
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
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Review Applications</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin size={14} /> Viewing proposals for <strong>{user?.state || 'All States'}</strong>
          </p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="gov-input w-auto">
          <option value="all">All Types</option>
          <option value="EC">Environmental</option>
          <option value="FC">Forest</option>
          <option value="WL">Wildlife</option>
          <option value="CRZ">CRZ</option>
        </select>
      </div>

      {/* Global Map Display */}
      {!isLoading && !loadError && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-surface/50 border border-border rounded-[2rem] p-4 md:p-6 shadow-xl transition-all duration-300 relative overflow-hidden"
        >
          <div className="mb-4 flex items-center gap-2 px-2">
            <Globe className="text-primary" size={24} />
            <div>
              <h3 className="text-xl font-bold text-foreground font-serif leading-tight">Geospatial Distribution</h3>
              <p className="text-xs font-medium text-muted-foreground">Interactive map mapping {filtered.length} visible proposals in {user?.state}</p>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-inner border border-border bg-background/50">
            <ProposalMapVisualization className="w-full h-[600px]" proposals={filtered} role="state" showListOverlay={true} />
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between mt-4">
         <h3 className="text-xl font-bold text-foreground px-2">Detailed Application Registry</h3>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gov-card p-0 overflow-hidden mt-4">
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
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading applications...</td></tr>
              ) : loadError ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-destructive">{loadError}</td></tr>
              ) : filtered.map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.district}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/state/applications/${app.id}`} className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View</Link>
                      <button onClick={() => runAction(app.id, 'APPROVE')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50">Approve</button>
                      <button onClick={() => runAction(app.id, 'FORWARD')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-status-review/10 text-status-review hover:bg-status-review/20 transition-colors disabled:opacity-50">Forward</button>
                      <button onClick={() => runAction(app.id, 'SEND_BACK')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-status-pending/10 text-status-pending hover:bg-status-pending/20 transition-colors disabled:opacity-50">Clarify</button>
                      <button onClick={() => runAction(app.id, 'REJECT')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !loadError && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No proposals found for {user?.state}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {actionError && <p className="px-6 py-4 text-xs text-destructive border-t border-border">{actionError}</p>}
      </motion.div>
    </div>
  );
}
