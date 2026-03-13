import { motion } from 'framer-motion';
import { Globe, CheckCircle2, Users, XCircle } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ClearanceChart from '@/components/charts/ClearanceChart';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';
import { Link } from 'react-router-dom';

export default function CentralDashboard() {
  const { applications, isLoading, loadError } = useWorkflowApplications();
  const total = applications.length;
  const approved = applications.filter((application) => application.status === 'Approved').length;
  const committee = applications.filter((application) => application.status === 'Committee Review').length;
  const rejected = applications.filter((application) => application.status === 'Rejected').length;

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
        <h2 className="text-2xl font-serif font-bold text-foreground">Central Authority Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">National overview of all environmental clearance proposals</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Proposals" value={String(total)} icon={<Globe size={20} />} colorClass="text-primary" delay={0} />
        <StatCard label="Committee Review" value={String(committee)} icon={<Users size={20} />} colorClass="text-status-review" delay={0.1} />
        <StatCard label="Approved" value={String(approved)} icon={<CheckCircle2 size={20} />} colorClass="text-accent" delay={0.2} />
        <StatCard label="Rejected" value={String(rejected)} icon={<XCircle size={20} />} colorClass="text-destructive" delay={0.3} />
      </div>

      <ClearanceChart data={chartData} />

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
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading applications...</td></tr>
              ) : loadError ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-destructive">{loadError}</td></tr>
              ) : applications.map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">{app.id}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.state}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/central/applications/${app.id}`} className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !loadError && applications.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
