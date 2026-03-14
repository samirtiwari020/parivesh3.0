import { motion } from 'framer-motion';
import { FileSearch, Clock, Send, MapPin, Globe } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ClearanceChart from '@/components/charts/ClearanceChart';
import ProposalMapVisualization from '@/components/maps/ProposalMapVisualization';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';

export default function StateDashboard() {
  const { user } = useAuth();
  const { applications, isLoading, loadError } = useWorkflowApplications();
  const stateApps = applications.filter((application) => application.state === user?.state);
  const pendingReview = stateApps.filter((application) => ['Submitted', 'Pending'].includes(application.status)).length;
  const underReview = stateApps.filter((application) => application.status === 'Under Review').length;
  const forwarded = stateApps.filter((application) => application.status === 'Committee Review').length;

  const chartData = [
    {
      name: 'EC',
      received: stateApps.filter((application) => application.clearanceType === 'EC').length,
      approved: stateApps.filter((application) => application.clearanceType === 'EC' && application.status === 'Approved').length,
      pending: 0,
      rejected: 0,
    },
    {
      name: 'FC',
      received: stateApps.filter((application) => application.clearanceType === 'FC').length,
      approved: stateApps.filter((application) => application.clearanceType === 'FC' && application.status === 'Approved').length,
      pending: 0,
      rejected: 0,
    },
    {
      name: 'WL',
      received: stateApps.filter((application) => application.clearanceType === 'WL').length,
      approved: stateApps.filter((application) => application.clearanceType === 'WL' && application.status === 'Approved').length,
      pending: 0,
      rejected: 0,
    },
    {
      name: 'CRZ',
      received: stateApps.filter((application) => application.clearanceType === 'CRZ').length,
      approved: stateApps.filter((application) => application.clearanceType === 'CRZ' && application.status === 'Approved').length,
      pending: 0,
      rejected: 0,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">State Review Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin size={14} /> Viewing proposals for <strong>{user?.state || 'All States'}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="State Proposals" value={String(stateApps.length)} icon={<FileSearch size={20} />} colorClass="text-primary" delay={0} />
        <StatCard label="Pending Review" value={String(pendingReview)} icon={<Clock size={20} />} colorClass="text-status-pending" delay={0.1} />
        <StatCard label="Under Review" value={String(underReview)} icon={<FileSearch size={20} />} colorClass="text-status-review" delay={0.2} />
        <StatCard label="Forwarded to Central" value={String(forwarded)} icon={<Send size={20} />} colorClass="text-accent" delay={0.3} />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="w-full bg-surface/50 border border-border rounded-[2rem] p-4 md:p-6 shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className="mb-4 flex items-center gap-2 px-2">
          <Globe className="text-primary" size={24} />
          <div>
            <h3 className="text-xl font-bold text-foreground font-serif leading-tight">Geospatial Distribution</h3>
            <p className="text-xs font-medium text-muted-foreground">Interactive map mapping {stateApps.length} visible proposals in {user?.state}</p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-inner border border-border bg-background/50">
          <ProposalMapVisualization className="w-full h-[600px]" proposals={stateApps} role="state" showListOverlay={true} />
        </div>
      </motion.div>

      <ClearanceChart data={chartData} />
    </div>
  );
}
