import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle2, Activity, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable from '@/components/tables/DataTable';
import ClearanceChart from '@/components/charts/ClearanceChart';
import { mockApplications, mockUsers, mockActivityLogs, mockStats } from '@/data/mockData';

export default function Admin() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Users" value="1,245" icon={<Users size={20} />} colorClass="text-status-review" delay={0} />
        <StatCard label="Active Proposals" value="342" icon={<FileText size={20} />} colorClass="text-status-pending" delay={0.1} />
        <StatCard label="Approved This Month" value="89" icon={<CheckCircle2 size={20} />} colorClass="text-accent" delay={0.2} />
        <StatCard label="Avg Processing Days" value="45" icon={<TrendingUp size={20} />} colorClass="text-primary" delay={0.3} />
      </div>

      {/* Chart */}
      <ClearanceChart data={mockStats} />

      {/* Users Table */}
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
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 md:px-6 py-4 font-medium">{user.name}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden sm:table-cell">{user.email}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{user.role}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden lg:table-cell">{user.organization}</td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'gov-status-approved' : 'gov-status-pending'}`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      {/* Proposal Approval Panel */}
      <DataTable title="Proposal Approval Panel" searchPlaceholder="Search proposals...">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-4 md:px-6 py-4 font-medium">ID</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden sm:table-cell">Project</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden md:table-cell">Type</th>
              <th className="px-4 md:px-6 py-4 font-medium">Status</th>
              <th className="px-4 md:px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockApplications.slice(0, 5).map((app) => (
              <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 md:px-6 py-4 font-medium tabular-data">{app.id}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden sm:table-cell">{app.projectName}</td>
                <td className="px-4 md:px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                <td className="px-4 md:px-6 py-4"><StatusBadge status={app.status} /></td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">Approve</button>
                    <button className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      {/* Activity Logs */}
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
            {mockActivityLogs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 md:px-6 py-4 font-medium">{log.action}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden sm:table-cell">{log.user}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{log.details}</td>
                <td className="px-4 md:px-6 py-4 tabular-data text-muted-foreground">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
