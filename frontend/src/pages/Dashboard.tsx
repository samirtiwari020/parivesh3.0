import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable from '@/components/tables/DataTable';
import { mockApplications } from '@/data/mockData';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const recentApps = mockApplications.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-emerald-950 mb-2">Welcome Back, Project Proponent!</h2>
          <p className="text-emerald-700 font-medium">Here's an overview of your clearance applications today.</p>
        </div>
        <Link to="/app/submit" className="shrink-0 bg-primary hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
          + New Proposal
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <motion.div variants={itemVariants}>
          <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-status-review/10 rounded-full blur-2xl group-hover:bg-status-review/20 transition-colors" />
            <StatCard label="Total Applications" value="24" icon={<FileText size={24} />} colorClass="text-status-review bg-status-review/10 border-status-review/20" delay={0} />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
            <StatCard label="Pending Action" value="7" icon={<Clock size={24} />} colorClass="text-status-pending bg-status-pending/10 border-status-pending/20" delay={0} />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
            <StatCard label="Approved" value="15" icon={<CheckCircle2 size={24} />} colorClass="text-accent bg-accent/10 border-accent/20" delay={0} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-destructive/10 rounded-full blur-2xl group-hover:bg-destructive/20 transition-colors" />
            <StatCard label="Rejected" value="2" icon={<XCircle size={24} />} colorClass="text-destructive bg-destructive/10 border-destructive/20" delay={0} />
          </div>
        </motion.div>
      </motion.div>

      {/* Data Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-3xl overflow-hidden shadow-sm"
      >
        <DataTable title="Recent Applications" searchPlaceholder="Search ID or Name...">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-emerald-800 font-bold uppercase bg-emerald-50/80 border-b border-emerald-100">
                <tr>
                  <th className="px-6 py-5 whitespace-nowrap">Proposal ID</th>
                  <th className="px-6 py-5 whitespace-nowrap hidden sm:table-cell">Project Name</th>
                  <th className="px-6 py-5 whitespace-nowrap hidden md:table-cell">Type</th>
                  <th className="px-6 py-5 whitespace-nowrap hidden lg:table-cell">Date</th>
                  <th className="px-6 py-5 whitespace-nowrap">Status</th>
                  <th className="px-6 py-5 whitespace-nowrap text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-emerald-50/80 transition-colors group">
                    <td className="px-6 py-5 font-bold text-emerald-950 tabular-data whitespace-nowrap">{app.id}</td>
                    <td className="px-6 py-5 text-emerald-800 font-medium hidden sm:table-cell">{app.projectName}</td>
                    <td className="px-6 py-5 text-emerald-700 hidden md:table-cell">
                      <span className="bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100">{app.clearanceType}</span>
                    </td>
                    <td className="px-6 py-5 tabular-data text-emerald-600 font-medium hidden lg:table-cell whitespace-nowrap">{app.submissionDate}</td>
                    <td className="px-6 py-5 whitespace-nowrap"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <Link to={`/app/proposal/${app.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-white border border-emerald-100 text-primary font-bold text-xs md:text-sm rounded-lg opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-md transition-all">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataTable>
      </motion.div>
    </div>
  );
}
