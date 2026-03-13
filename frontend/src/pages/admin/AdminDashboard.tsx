import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle2, Activity, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable from '@/components/tables/DataTable';
import ClearanceChart from '@/components/charts/ClearanceChart';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  isActive: boolean;
}

interface ActivityLog {
  _id: string;
  action: string;
  description?: string;
  createdAt: string;
  user?: {
    name?: string;
  };
}

interface UsersResponse {
  success: boolean;
  users: AdminUser[];
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

export default function AdminDashboard() {
  const { applications, isLoading, loadError } = useWorkflowApplications();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [metaError, setMetaError] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setMetaError('Session expired. Please login again.');
        setUsers([]);
        setLogs([]);
        return;
      }

      try {
        const [usersResponse, logsResponse] = await Promise.all([
          apiRequest<UsersResponse>('/api/admin/users', { method: 'GET', token }),
          apiRequest<LogsResponse>('/api/admin/logs', { method: 'GET', token }),
        ]);

        setUsers(usersResponse.users);
        setLogs(logsResponse.logs);
      } catch (error) {
        setMetaError(error instanceof Error ? error.message : 'Failed to load admin data');
      }
    };

    void loadAdminData();
  }, []);

  const activeProposals = applications.filter((application) => ['Submitted', 'Pending', 'Under Review', 'Committee Review'].includes(application.status)).length;
  const approvedThisMonth = applications.filter((application) => {
    if (application.status !== 'Approved') return false;
    const createdAt = new Date(application.createdAt);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length;

  const chartData = [
    {
      name: 'EC',
      received: applications.filter((application) => application.clearanceType === 'EC').length,
      approved: applications.filter((application) => application.clearanceType === 'EC' && application.status === 'Approved').length,
      pending: 0,
      rejected: 0,
    },
    {
      name: 'FC',
      received: applications.filter((application) => application.clearanceType === 'FC').length,
      approved: applications.filter((application) => application.clearanceType === 'FC' && application.status === 'Approved').length,
      pending: 0,
      rejected: 0,
    },
    {
      name: 'WL',
      received: applications.filter((application) => application.clearanceType === 'WL').length,
      approved: applications.filter((application) => application.clearanceType === 'WL' && application.status === 'Approved').length,
      pending: 0,
      rejected: 0,
    },
    {
      name: 'CRZ',
      received: applications.filter((application) => application.clearanceType === 'CRZ').length,
      approved: applications.filter((application) => application.clearanceType === 'CRZ' && application.status === 'Approved').length,
      pending: 0,
      rejected: 0,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground">System Administration</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage users, proposals, and system health</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Users" value={users.length} icon={<Users size={20} />} colorClass="text-status-review" delay={0} />
        <StatCard label="Active Proposals" value={activeProposals} icon={<FileText size={20} />} colorClass="text-status-pending" delay={0.1} />
        <StatCard label="Approved This Month" value={approvedThisMonth} icon={<CheckCircle2 size={20} />} colorClass="text-accent" delay={0.2} />
        <StatCard label="Avg Processing Days" value="45" icon={<TrendingUp size={20} />} colorClass="text-primary" delay={0.3} />
      </div>

      <ClearanceChart data={chartData} />

      <DataTable title="Recent Proposals" searchPlaceholder="Search by proposal name...">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-4 md:px-6 py-4 font-medium">ID</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden sm:table-cell">Project</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden md:table-cell">State</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden md:table-cell">Type</th>
              <th className="px-4 md:px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading applications...</td></tr>
            ) : loadError ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-destructive">{loadError}</td></tr>
            ) : applications.slice(0, 8).map((application) => (
              <tr key={application.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 md:px-6 py-4 font-medium tabular-data">{application.id}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden sm:table-cell">{application.projectName}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{application.state}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{application.clearanceType}</td>
                <td className="px-4 md:px-6 py-4"><StatusBadge status={application.status} /></td>
              </tr>
            ))}
            {!isLoading && !loadError && applications.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No applications found.</td></tr>
            )}
          </tbody>
        </table>
      </DataTable>

      <DataTable title="User Management" searchPlaceholder="Search users...">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-4 md:px-6 py-4 font-medium">Name</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden sm:table-cell">Email</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden md:table-cell">Role</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden lg:table-cell">Organization</th>
              <th className="px-4 md:px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 md:px-6 py-4 font-medium">{user.name}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden sm:table-cell">{user.email}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{user.role}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden lg:table-cell">{user.organization || '—'}</td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'gov-status-approved' : 'gov-status-pending'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </DataTable>

      <DataTable title="System Activity Logs" searchPlaceholder="Search logs...">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-4 md:px-6 py-4 font-medium">Action</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden sm:table-cell">User</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden md:table-cell">Details</th>
              <th className="px-4 md:px-6 py-4 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 md:px-6 py-4 font-medium">{log.action}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden sm:table-cell">{log.user?.name || 'System'}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{log.description || '—'}</td>
                <td className="px-4 md:px-6 py-4 tabular-data text-muted-foreground">{formatDate(log.createdAt)}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">No activity logs found.</td></tr>
            )}
          </tbody>
        </table>
      </DataTable>
      {metaError && <p className="text-xs text-destructive">{metaError}</p>}
    </div>
  );
}
