import { motion } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';
import { apiRequest } from '@/lib/api';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

export default function AdminApplications() {
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { applications, isLoading, loadError, refetch } = useWorkflowApplications();

  const runAction = async (applicationId: string, action: 'APPROVE' | 'REJECT') => {
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
    <div className="max-w-6xl mx-auto space-y-6 relative z-10 w-full font-sans">
      {/* Fixed Background for Applications */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.2]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80")' }}
      />
      
      <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
        <h2 className="text-3xl font-serif font-extrabold text-slate-800 drop-shadow-sm tracking-tight">All Proposals</h2>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/60 p-6 overflow-hidden">
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
              ) : applications.map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.state}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">{app.proponent}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/applications/${app.id}`} className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View</Link>
                      <button onClick={() => runAction(app.id, 'APPROVE')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50">Approve</button>
                      <button onClick={() => runAction(app.id, 'REJECT')} disabled={actionLoadingId === app.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !loadError && applications.length === 0 && (
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
