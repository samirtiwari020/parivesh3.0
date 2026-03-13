import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, XCircle, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useApplicantApplications } from '@/hooks/useApplicantApplications';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const { applications, isLoading, loadError, metrics } = useApplicantApplications();

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-stone-50/50 flex flex-col font-sans -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
      
      {/* Background with Blend Mode */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80")', // Beautiful, faint aerial natural background 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50/60 via-white/80 to-stone-50/90 pointer-events-none z-0" />
      
      {/* Dynamic Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto w-full space-y-8 relative z-10"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
          <div>
            <h2 className="text-3xl font-serif font-black text-emerald-950 flex items-center gap-2">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{user?.name}</span>
            </h2>
            <p className="text-emerald-900/60 mt-2 font-medium">Track your environmental clearance applications and submissions.</p>
          </div>
          <Link to="/applicant/submit" className="group sticky md:static bottom-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 px-6 py-3.5 rounded-2xl font-bold transition-all hover:-translate-y-0.5 z-50">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
            New Application
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="Total Applications" value={String(metrics.total)} icon={<FileText size={24} />} colorClass="text-emerald-600 bg-emerald-50 border-emerald-100" delay={0} />
          <StatCard label="Pending Review" value={String(metrics.pending)} icon={<Clock size={24} />} colorClass="text-amber-600 bg-amber-50 border-amber-100" delay={0.1} />
          <StatCard label="Approved" value={String(metrics.approved)} icon={<CheckCircle2 size={24} />} colorClass="text-emerald-600 bg-emerald-50 border-emerald-100" delay={0.2} />
          <StatCard label="Rejected" value={String(metrics.rejected)} icon={<XCircle size={24} />} colorClass="text-rose-600 bg-rose-50 border-rose-100" delay={0.3} />
        </motion.div>

        {/* Applications Table */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden relative">
          
          <div className="px-6 py-5 border-b border-emerald-100/60 flex items-center justify-between">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Recent Applications
            </h3>
            <Link to="/applicant/applications" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center hover:translate-x-1 transition-transform">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="overflow-x-auto p-2">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-emerald-900/50 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4 border-b border-emerald-100/50">Tracking ID</th>
                  <th className="px-6 py-4 hidden sm:table-cell border-b border-emerald-100/50">Project Name</th>
                  <th className="px-6 py-4 hidden md:table-cell border-b border-emerald-100/50">Clearance Type</th>
                  <th className="px-6 py-4 hidden lg:table-cell border-b border-emerald-100/50">Date Submitted</th>
                  <th className="px-6 py-4 border-b border-emerald-100/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-16 text-center text-emerald-900/50 font-medium">Loading applications...</td></tr>
                ) : loadError ? (
                  <tr><td colSpan={5} className="px-6 py-16 text-center text-rose-500 font-medium">{loadError}</td></tr>
                ) : recentApplications.length > 0 ? recentApplications.map((app, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={app.id} 
                    className="hover:bg-white/60 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5 font-bold tabular-data">
                      <Link to={`/applicant/applications`} className="text-emerald-700 hover:text-emerald-900 group-hover:underline underline-offset-4">{app.id}</Link>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell font-semibold text-emerald-950">{app.projectName}</td>
                    <td className="px-6 py-5 hidden md:table-cell text-emerald-800/80 font-medium">{app.clearanceType}</td>
                    <td className="px-6 py-5 hidden lg:table-cell tabular-data text-emerald-800/60 font-medium">{new Date(app.submissionDate).toLocaleDateString()}</td>
                    <td className="px-6 py-5"><StatusBadge status={app.status} /></td>
                  </motion.tr>
                )) : (
                  <tr><td colSpan={5} className="px-6 py-16 text-center text-emerald-900/50 font-medium bg-stone-50/30 m-2 rounded-2xl">No applications found. Start by submitting a new application.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
