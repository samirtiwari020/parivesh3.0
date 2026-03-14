import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe } from 'lucide-react';

export default function CommitteeAllApplications() {
  const { applications, isLoading, loadError } = useWorkflowApplications();
  const committeeApplications = applications.filter((application) => application.hasCommitteeHistory);

  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-stone-50/50 flex flex-col font-sans px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden items-center">
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
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full blur-[130px] pointer-events-none z-0 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-emerald-200/30 rounded-full blur-[130px] pointer-events-none z-0 translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto w-full space-y-6 md:space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/95 backdrop-blur-3xl border border-emerald-800/80 rounded-[2rem] p-6 md:p-8 md:px-10 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-[70px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/30 transition-colors duration-700" />

          <div className="relative z-10 w-full">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-200 mb-2 drop-shadow-sm">
              All Committee Applications
            </h2>
            <p className="text-emerald-200/80 font-medium text-base">
              Applications that reached committee review, including approved and rejected decisions.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 overflow-hidden flex flex-col"
        >
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-emerald-50/50 text-xs text-emerald-800/80 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-8 py-5 rounded-tl-3xl">ID</th>
                  <th className="px-8 py-5 w-[25%]">Project Name</th>
                  <th className="px-8 py-5">State</th>
                  <th className="px-8 py-5">Clearance Type</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right rounded-tr-3xl min-w-[120px]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100/30">
                <AnimatePresence>
                  {isLoading ? (
                    <tr><td colSpan={6} className="px-8 py-16 text-center text-emerald-400 font-bold animate-pulse">Loading applications...</td></tr>
                  ) : loadError ? (
                    <tr><td colSpan={6} className="px-8 py-16 text-center text-rose-500 font-bold bg-rose-50/50">{loadError}</td></tr>
                  ) : committeeApplications.map((app, i) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      key={app.id}
                      className="hover:bg-emerald-50/40 transition-colors group"
                    >
                      <td className="px-8 py-6 font-bold text-emerald-950/80 text-sm tabular-data">{app.id}</td>
                      <td className="px-8 py-6 font-semibold text-emerald-950">
                        <div className="line-clamp-2" title={app.projectName}>{app.projectName}</div>
                      </td>
                      <td className="px-8 py-6 font-medium text-emerald-700/80">{app.state}</td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-700 text-xs font-bold border border-emerald-200 whitespace-nowrap">
                          {app.clearanceType}
                        </span>
                      </td>
                      <td className="px-8 py-6"><StatusBadge status={app.status} /></td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          to={`/committee/applications/${app.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all font-bold shrink-0 ml-auto"
                          title="View Application Details"
                        >
                          <ArrowUpRight size={16} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                  {!isLoading && !loadError && committeeApplications.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-emerald-300">
                          <Globe size={48} className="mb-4 opacity-50" />
                          <p className="font-bold text-lg text-emerald-800/60">No committee applications found yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
