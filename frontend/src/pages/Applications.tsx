import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useApplicantApplications } from '@/hooks/useApplicantApplications';

const PAGE_SIZE = 5;

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
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Applications() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { applications, isLoading, loadError } = useApplicantApplications();

  const filtered = useMemo(() => {
    return applications.filter((app) =>
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.projectName.toLowerCase().includes(search.toLowerCase())
    );
  }, [applications, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-stone-50/50 flex flex-col font-sans -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
      
      {/* Background with Blend Mode */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.3] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80")', // Stunning, serene nature background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50/50 via-white/70 to-emerald-50/90 pointer-events-none z-0" />
      
      {/* Dynamic Glows */}
      <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-300/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[25rem] h-[25rem] bg-teal-300/20 rounded-full blur-[100px] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto w-full space-y-8 relative z-10"
      >
        {/* Header Area */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-emerald-100 text-emerald-700 text-xs font-bold shadow-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Application History
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-emerald-950 flex items-center gap-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-500">My Applications</span>
            </h1>
            <p className="text-emerald-800/60 font-medium mt-2 max-w-xl">
              Track the status of your submitted environmental clearance proposals, review details, and manage your documents.
            </p>
          </div>
          
          <div className="relative group w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-emerald-600/50 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by ID or project name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-white/70 backdrop-blur-md border border-emerald-100 rounded-2xl pl-11 pr-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm shadow-emerald-900/5 placeholder:text-emerald-900/40 font-medium"
            />
          </div>
        </motion.div>

        {/* Data Table Container */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-900/10 border border-white overflow-hidden relative">
          
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-emerald-900/50 uppercase tracking-widest font-bold bg-emerald-50/50 border-b border-emerald-100/60">
                <tr>
                  <th className="px-6 py-5">Proposal ID</th>
                  <th className="px-6 py-5 hidden sm:table-cell">Project Name</th>
                  <th className="px-6 py-5 hidden md:table-cell">Type</th>
                  <th className="px-6 py-5 hidden md:table-cell">State</th>
                  <th className="px-6 py-5 hidden lg:table-cell">Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/80">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    <motion.tr initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      <td colSpan={7} className="px-6 py-20 text-center text-emerald-900/50 font-bold">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                          Loading your applications...
                        </div>
                      </td>
                    </motion.tr>
                  ) : loadError ? (
                    <motion.tr initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      <td colSpan={7} className="px-6 py-20 text-center">
                        <div className="bg-rose-50 text-rose-600 border border-rose-100 rounded-xl p-4 inline-block font-bold">
                          {loadError}
                        </div>
                      </td>
                    </motion.tr>
                  ) : paged.length > 0 ? paged.map((app, idx) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      key={app.id} 
                      className="hover:bg-white transition-colors group relative z-10"
                    >
                      <td className="px-6 py-5 font-bold tabular-data">
                        <div className="flex items-center gap-3 text-emerald-950">
                           <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                             <FileText size={16} />
                           </div>
                           {app.id}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-semibold text-emerald-800/90 hidden sm:table-cell">
                        {app.projectName}
                      </td>
                      <td className="px-6 py-5 text-emerald-900/60 font-medium hidden md:table-cell">
                        <span className="bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">{app.clearanceType}</span>
                      </td>
                      <td className="px-6 py-5 text-emerald-900/60 font-medium hidden md:table-cell">{app.state}</td>
                      <td className="px-6 py-5 tabular-data text-emerald-900/60 font-medium hidden lg:table-cell">{app.submissionDate}</td>
                      <td className="px-6 py-5"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-5 text-right">
                        <Link 
                          to={`/applicant/applications`} 
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-600 border border-emerald-100 hover:border-emerald-600 text-emerald-700 hover:text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-lg shadow-emerald-600/20 group/btn"
                        >
                          View
                          <ExternalLink size={14} className="group-hover/btn:-translate-y-[1px] group-hover/btn:translate-x-[1px] transition-transform" />
                        </Link>
                      </td>
                    </motion.tr>
                  )) : (
                    <motion.tr initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      <td colSpan={7} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 text-emerald-900/40">
                          <Search size={48} strokeWidth={1.5} />
                          <p className="font-bold text-lg">No applications found.</p>
                          <p className="max-w-sm text-sm">Try adjusting your search criteria or submit a new application from the dashboard.</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Custom Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-emerald-100/60 bg-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-bold text-emerald-900/50">
                Showing <span className="text-emerald-700">{(page - 1) * PAGE_SIZE + 1}</span>–<span className="text-emerald-700">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="text-emerald-700">{filtered.length}</span> results
              </p>
              <div className="flex items-center gap-1.5 p-1 bg-white/60 rounded-xl border border-emerald-100/50 shadow-sm">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i + 1)} 
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      page === i + 1 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 -translate-y-[1px]' 
                        : 'hover:bg-emerald-50 text-emerald-700/80 hover:text-emerald-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
