import { motion, AnimatePresence } from 'framer-motion';
import { Globe, CheckCircle2, Users, XCircle, FileText } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ClearanceChart from '@/components/charts/ClearanceChart';
import ProposalMapVisualization from '@/components/maps/ProposalMapVisualization';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';

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
    <div className="min-h-[calc(100vh-4rem)] relative bg-stone-50/50 flex flex-col font-sans -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden items-center">

      {/* Universal Beautiful Background with Blend Mode */}
      <div
        className="absolute inset-0 z-0 opacity-[0.20] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white/80 to-teal-50/90 pointer-events-none z-0" />

      {/* Dynamic Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full blur-[130px] pointer-events-none z-0 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-emerald-200/30 rounded-full blur-[130px] pointer-events-none z-0 translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto w-full space-y-8 md:space-y-10 relative z-10">

        {/* Header Dashboard Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/95 backdrop-blur-3xl border border-emerald-800/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Internal card glow effect */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/30 transition-colors duration-700" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/40 border border-emerald-700/50 text-emerald-100 text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              National Overview
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-200 mb-3 drop-shadow-sm">
              Central Authority Board
            </h2>
            <p className="text-emerald-200/80 font-medium text-lg max-w-xl">
              Monitor, review, and govern environmental clearance proposals across all national nodes with real-time statistics.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-inner self-stretch flex items-center justify-center shrink-0 min-w-[200px]">
            <div className="text-center">
              <p className="text-emerald-200/80 text-sm font-bold uppercase tracking-widest mb-1">Live Proposals</p>
              <p className="text-4xl font-black text-white drop-shadow-md">{isLoading ? '...' : total}</p>
            </div>
          </div>
        </motion.div>

        {/* National Map Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-4 md:p-6 border border-white shadow-xl shadow-emerald-900/5 relative overflow-hidden"
        >
          <div className="mb-4 px-2 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-emerald-950 font-serif flex items-center gap-2">
                <Globe size={20} className="text-emerald-500" />
                Geospatial Distribution
              </h3>
              <p className="text-emerald-700/70 font-medium text-sm">Live map view of all proposals nationwide.</p>
            </div>
          </div>
          <div className="rounded-[1.5rem] overflow-hidden border border-emerald-100 shadow-inner">
             <ProposalMapVisualization className="w-full h-[600px]" proposals={applications} role="central" showListOverlay={true} />
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Custom wrappers around StatCards for extra glassmorphism */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-1 border border-white shadow-xl shadow-emerald-900/5 hover:-translate-y-1 transition-transform duration-300">
            <StatCard label="Total Received" value={String(total)} icon={<Globe size={24} />} colorClass="text-emerald-600" delay={0.1} />
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-1 border border-white shadow-xl shadow-amber-900/5 hover:-translate-y-1 transition-transform duration-300">
            <StatCard label="Committee Review" value={String(committee)} icon={<Users size={24} />} colorClass="text-amber-500" delay={0.2} />
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-1 border border-white shadow-xl shadow-emerald-900/5 hover:-translate-y-1 transition-transform duration-300">
            <StatCard label="Approved" value={String(approved)} icon={<CheckCircle2 size={24} />} colorClass="text-emerald-500" delay={0.3} />
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-1 border border-white shadow-xl shadow-rose-900/5 hover:-translate-y-1 transition-transform duration-300">
            <StatCard label="Rejected" value={String(rejected)} icon={<XCircle size={24} />} colorClass="text-rose-500" delay={0.4} />
          </div>
        </motion.div>

        {/* Analytics Chart Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 border border-white shadow-xl shadow-emerald-900/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-emerald-950 font-serif">Clearance Analytics</h3>
                <p className="text-emerald-700/70 font-medium text-sm mt-1">Proposal processing breakdown by category</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                <FileText size={20} />
              </div>
            </div>
            <ClearanceChart data={chartData} />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
