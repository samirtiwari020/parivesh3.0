import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';
import { apiRequest } from '@/lib/api';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Globe, ArrowUpRight, Check, X, RotateCcw } from 'lucide-react';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

export default function CommitteeReview() {
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { applications, isLoading, loadError, refetch } = useWorkflowApplications();
  const committeeApps = applications.filter((application) => application.isAwaitingCommitteeDecision);

  const runAction = async (applicationId: string, action: 'APPROVE' | 'REJECT' | 'SEND_BACK') => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setActionError('Session expired. Please login again.');
      return;
    }

    let remarks: string | undefined;
    if (action === 'SEND_BACK') {
      const comment = window.prompt('Enter clarification comment for applicant:');
      if (!comment || !comment.trim()) {
        setActionError('Clarification comment is required.');
        return;
      }
      remarks = comment.trim();
    }

    setActionError('');
    setActionLoadingId(applicationId);

    try {
      await apiRequest(`/api/applications/${applicationId}/review`, {
        method: 'POST',
        token,
        body: JSON.stringify({ action, remarks }),
      });
      await refetch();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-stone-50/50 flex flex-col font-sans px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden items-center">
      
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
      
      {/* Central Authority specific gradient to match dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white/80 to-teal-50/90 pointer-events-none z-0" />
      
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full blur-[130px] pointer-events-none z-0 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-emerald-200/30 rounded-full blur-[130px] pointer-events-none z-0 translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto w-full space-y-6 md:space-y-8 relative z-10">
        
        {/* Glassmorphism Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/95 backdrop-blur-3xl border border-emerald-800/80 rounded-[2rem] p-6 md:p-8 md:px-10 shadow-2xl relative overflow-hidden group flex flex-col xl:flex-row xl:items-center justify-between gap-6"
        >
          {/* Internal card glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-[70px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/30 transition-colors duration-700" />
          
          <div className="relative z-10 w-full">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-200 mb-2 drop-shadow-sm">
              Committee Reviews
            </h2>
            <p className="text-emerald-200/80 font-medium text-base">
              Applications currently waiting for final committee decision.
            </p>
          </div>
        </motion.div>

        {/* Data Table Container */}
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
                  <th className="px-8 py-5 text-right rounded-tr-3xl min-w-[280px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100/30">
                <AnimatePresence>
                  {isLoading ? (
                    <tr><td colSpan={6} className="px-8 py-16 text-center text-emerald-400 font-bold animate-pulse">Loading committee reviews...</td></tr>
                  ) : loadError ? (
                    <tr><td colSpan={6} className="px-8 py-16 text-center text-rose-500 font-bold bg-rose-50/50">{loadError}</td></tr>
                  ) : committeeApps.map((app, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
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
                        <div className="flex items-center justify-end gap-2">
                           {/* Action: Approve */}
                           <button 
                             onClick={() => runAction(app.id, 'APPROVE')} 
                             disabled={actionLoadingId === app.id} 
                             className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/50 hover:bg-emerald-500 hover:text-white hover:shadow-md transition-all disabled:opacity-50"
                             title="Approve Application"
                           >
                              <Check size={14} /> <span className="hidden sm:inline">Approve</span>
                           </button>
                           
                           {/* Action: Clarify */}
                           <button 
                             onClick={() => runAction(app.id, 'SEND_BACK')} 
                             disabled={actionLoadingId === app.id} 
                             className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-600 border border-amber-200/50 hover:bg-amber-500 hover:text-white hover:shadow-md transition-all disabled:opacity-50"
                             title="Request Clarification"
                           >
                              <RotateCcw size={14} /> <span className="hidden sm:inline">Send Back</span>
                           </button>
                           
                           {/* Action: Reject */}
                           <button 
                             onClick={() => runAction(app.id, 'REJECT')} 
                             disabled={actionLoadingId === app.id} 
                             className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-50 text-rose-600 border border-rose-200/50 hover:bg-rose-500 hover:text-white hover:shadow-md transition-all disabled:opacity-50"
                             title="Reject Application"
                           >
                              <X size={14} /> <span className="hidden sm:inline">Reject</span>
                           </button>

                           <div className="w-px h-6 bg-emerald-100/60 mx-1 hidden sm:block" />

                           {/* Navigation: View details */}
                           <Link 
                             to={`/committee/applications/${app.id}`} 
                             className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all font-bold shrink-0"
                             title="View Application Details"
                           >
                             <ArrowUpRight size={16} />
                           </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {!isLoading && !loadError && committeeApps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-emerald-300">
                          <Globe size={48} className="mb-4 opacity-50" />
                          <p className="font-bold text-lg text-emerald-800/60">No proposals in committee review.</p>
                          <p className="text-sm text-emerald-700/60 mt-1">Approved and rejected committee applications remain available on All Applications.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {/* Bottom Error Bar if action fails */}
          <AnimatePresence>
             {actionError && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                 className="bg-rose-50 border-t border-rose-100 px-8 py-4"
               >
                 <p className="text-sm font-bold text-rose-600 flex items-center gap-2">
                   <X size={16} className="shrink-0" /> {actionError}
                 </p>
               </motion.div>
             )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
