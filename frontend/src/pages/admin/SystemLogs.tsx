import { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import { apiRequest } from '@/lib/api';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

interface ActivityLog {
  _id: string;
  action: string;
  description?: string;
  createdAt: string;
  user?: {
    name?: string;
  };
}

interface LogsResponse {
  success: boolean;
  logs: ActivityLog[];
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-GB');
};

export default function SystemLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadLogs = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!token) {
        setLoadError('Session expired. Please login again.');
        setLogs([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest<LogsResponse>('/api/admin/logs', {
          method: 'GET',
          token,
        });
        setLogs(response.logs);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Failed to load activity logs');
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return logs;

    return logs.filter((log) =>
      log.action.toLowerCase().includes(term)
      || (log.user?.name || '').toLowerCase().includes(term)
      || (log.description || '').toLowerCase().includes(term)
    );
  }, [logs, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative z-10 w-full font-sans">
      {/* Fixed Background for System Logs */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.2]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80")' }}
      />

      <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
        <h2 className="text-3xl font-serif font-extrabold text-slate-800 drop-shadow-sm tracking-tight">System Activity Logs</h2>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/60 overflow-hidden px-6 py-6">
      <DataTable title="Activity Logs" searchPlaceholder="Search logs..." onSearch={setSearch}>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">User</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">Details</th>
              <th className="px-6 py-4 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Loading activity logs...</td></tr>
            ) : loadError ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-destructive">{loadError}</td></tr>
            ) : filteredLogs.map((log) => (
              <tr key={log._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{log.action}</td>
                <td className="px-6 py-4 text-foreground/80 hidden sm:table-cell">{log.user?.name || 'System'}</td>
                <td className="px-6 py-4 text-foreground/80 hidden md:table-cell">{log.description || '—'}</td>
                <td className="px-6 py-4 tabular-data text-muted-foreground">{formatDate(log.createdAt)}</td>
              </tr>
            ))}
            {!isLoading && !loadError && filteredLogs.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No activity logs found.</td></tr>
            )}
          </tbody>
        </table>
      </DataTable>
      </div>
    </div>
  );
}
