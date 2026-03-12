import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockProposals } from '@/data/mockProposals';
import { useAuth } from '@/contexts/AuthContext';

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const myApps = mockProposals.filter(p => p.submittedBy === user?.id);
  const approved = myApps.filter(p => p.status === 'Approved').length;
  const pending = myApps.filter(p => ['Pending', 'Under Review', 'Committee Review', 'Submitted'].includes(p.status)).length;
  const rejected = myApps.filter(p => p.status === 'Rejected').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Welcome, {user?.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">Track your environmental clearance applications</p>
        </div>
        <Link to="/applicant/submit" className="gov-btn-primary"><Plus size={18} /> New Application</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Applications" value={String(myApps.length)} icon={<FileText size={20} />} colorClass="text-primary" delay={0} />
        <StatCard label="Pending Review" value={String(pending)} icon={<Clock size={20} />} colorClass="text-status-pending" delay={0.1} />
        <StatCard label="Approved" value={String(approved)} icon={<CheckCircle2 size={20} />} colorClass="text-accent" delay={0.2} />
        <StatCard label="Rejected" value={String(rejected)} icon={<XCircle size={20} />} colorClass="text-destructive" delay={0.3} />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gov-card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Project</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Type</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myApps.slice(0, 5).map(app => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium tabular-data">
                    <Link to={`/applicant/applications`} className="text-primary hover:underline">{app.id}</Link>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">{app.projectName}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{app.clearanceType}</td>
                  <td className="px-6 py-4 hidden lg:table-cell tabular-data">{app.submissionDate}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
