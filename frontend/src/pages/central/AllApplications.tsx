import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useState } from 'react';
import { useWorkflowApplications } from '@/hooks/useWorkflowApplications';
import { Link } from 'react-router-dom';
import { apiRequest } from '@/lib/api';
import { Filter, Globe, ArrowUpRight, Check, X, RotateCcw, Building2, MapPin } from 'lucide-react';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

export default function AllApplications() {
  const [stateFilter, setStateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { applications, states, isLoading, loadError, refetch } = useWorkflowApplications();

  const filtered = applications
    .filter((application) => stateFilter === 'all' || application.state === stateFilter)
    .filter((application) => typeFilter === 'all' || application.clearanceType === typeFilter);

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
        
        {/* Glassmorphism Header and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/95 backdrop-blur-3xl border border-emerald-800/80 rounded-[2rem] p-6 md:p-8 md:px-10 shadow-2xl relative overflow-hidden group flex flex-col xl:flex-row xl:items-center justify-between gap-6"
        >
          {/* Internal card glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-[70px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/30 transition-colors duration-700" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-200 mb-2 drop-shadow-sm">
              All Applications — National
            </h2>
            <p className="text-emerald-200/80 font-medium text-base">
              National registry of all proposals submitted for environmental clearances.
            </p>
          </div>

          {/* Filtering Blocks */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 xl:w-auto w-full">
             <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
               <Filter size={18} className="text-emerald-300 shrink-0" />
               <select 
                 value={stateFilter} 
                 onChange={e => setStateFilter(e.target.value)} 
                 className="bg-transparent text-white font-semibold text-sm w-full outline-none cursor-pointer appearance-none min-w-[140px]"
               >
                  <option value="all" className="text-zinc-900">All States</option>
                  {states.map(s => <option key={s} value={s} className="text-zinc-900">{s}</option>)}
               </select>
             </div>
             
             <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
               <Filter size={18} className="text-emerald-300 shrink-0" />
               <select 
                 value={typeFilter} 
                 onChange={e => setTypeFilter(e.target.value)} 
                 className="bg-transparent text-white font-semibold text-sm w-full outline-none cursor-pointer appearance-none min-w-[140px]"
               >
                  <option value="all" className="text-zinc-900">All Clearance Types</option>
                  <option value="EC" className="text-zinc-900">Environment Clearance (EC)</option>
                  <option value="FC" className="text-zinc-900">Forest Clearance (FC)</option>
                  <option value="WL" className="text-zinc-900">Wildlife Clearance (WL)</option>
                  <option value="CRZ" className="text-zinc-900">Coastal Reg. Zone (CRZ)</option>
               </select>
             </div>
          </div>
        </motion.div>

        {/* Action Error Bar */}
        <AnimatePresence>
          {actionError && (
             <motion.div 
               initial={{ opacity: 0, height: 0, y: -10 }} 
               animate={{ opacity: 1, height: 'auto', y: 0 }} 
               exit={{ opacity: 0, height: 0, y: -10 }}
               className="bg-rose-50/90 backdrop-blur-md border border-rose-200 rounded-2xl p-4 shadow-xl overflow-hidden"
             >
               <p className="text-sm font-bold text-rose-600 flex items-center justify-center gap-2">
                 <X size={16} className="shrink-0" /> {actionError}
               </p>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Global States */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-full shadow-lg border border-emerald-100 flex items-center gap-3">
              <span className="w-5 h-5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
              <span className="text-emerald-900 font-bold">Loading national registry...</span>
            </div>
          </div>
        )}

        {loadError && (
          <div className="bg-rose-50/80 backdrop-blur-md p-10 rounded-3xl border border-rose-200 text-center shadow-lg">
            <X size={48} className="mx-auto text-rose-400 mb-4 opacity-50" />
            <h3 className="text-rose-900 font-black text-xl mb-2">Error Loading Registry</h3>
            <p className="text-rose-700/80 font-medium">{loadError}</p>
          </div>
        )}

        {/* Card Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 w-full">
          <AnimatePresence mode="popLayout">
            {!isLoading && !loadError && filtered.map((app, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.05, type: 'spring', bounce: 0.4 }}
                key={app.id} 
                className="group bg-white/70 backdrop-blur-2xl border border-white hover:border-emerald-200 rounded-[2rem] shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1 overflow-hidden flex flex-col transition-all duration-300 relative"
              >
                {/* Status Indicator Glow (subtle absolute positioning inside card) */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-20 pointer-events-none transition-colors duration-500
                  ${app.status === 'Approved' ? 'bg-emerald-500' : 
                    app.status === 'Rejected' ? 'bg-rose-500' : 
                    app.status === 'Clarification Requested' ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                />

                {/* Card Content Top Container */}
                <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                  {/* Top Header: ID & Status */}
                  <div className="flex justify-between items-start gap-4 mb-5">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black tracking-widest rounded-full border border-emerald-100 shadow-sm shrink-0">
                      #{app.id.substring(app.id.length - 6).toUpperCase()}
                    </span>
                    <div className="shrink-0"><StatusBadge status={app.status} /></div>
                  </div>
                  
                  {/* Main Identifier: Project Name */}
                  <h3 className="text-xl font-bold text-emerald-950 mb-4 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {app.projectName}
                  </h3>
                  
                  {/* Info Points */}
                  <div className="space-y-3 mb-6 mt-auto">
                    <div className="flex items-start gap-3 text-emerald-900/70 text-sm font-medium">
                      <Building2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                      <span className="line-clamp-1">{app.proponent}</span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-900/70 text-sm font-medium">
                      <MapPin size={16} className="shrink-0 text-emerald-400" />
                      <span>{app.state}</span>
                    </div>
                  </div>

                  {/* Badges Container */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50/50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-100/50 shadow-sm">
                      {app.clearanceType} Clearance
                    </span>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 md:px-6 bg-gradient-to-t from-emerald-50/80 to-emerald-50/30 border-t border-emerald-100/50 flex flex-wrap items-center justify-between gap-2 relative z-10">
                  
                  {/* Action Group */}
                  <div className="flex gap-2 flex-grow min-w-[200px]">
                    {/* Approve Button */}
                    <button 
                      onClick={() => runAction(app.id, 'APPROVE')} 
                      disabled={actionLoadingId === app.id} 
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50 hover:bg-emerald-500 hover:text-white hover:shadow-md transition-all disabled:opacity-50"
                      title="Approve / Send to Committee"
                    >
                      <Check size={14} className="shrink-0" /> <span className="truncate">Committee</span>
                    </button>
                    
                    {/* Clarify Button */}
                    <button 
                      onClick={() => runAction(app.id, 'SEND_BACK')} 
                      disabled={actionLoadingId === app.id} 
                      className="w-10 h-10 inline-flex items-center justify-center shrink-0 text-xs font-bold rounded-xl bg-amber-50 text-amber-600 border border-amber-200/50 hover:bg-amber-500 hover:text-white hover:shadow-md transition-all disabled:opacity-50"
                      title="Request Clarification"
                    >
                      <RotateCcw size={14} />
                    </button>
                    
                    {/* Reject Button */}
                    <button 
                      onClick={() => runAction(app.id, 'REJECT')} 
                      disabled={actionLoadingId === app.id} 
                      className="w-10 h-10 inline-flex items-center justify-center shrink-0 text-xs font-bold rounded-xl bg-rose-50 text-rose-600 border border-rose-200/50 hover:bg-rose-500 hover:text-white hover:shadow-md transition-all disabled:opacity-50"
                      title="Reject Application"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* View Details Router Link */}
                  <Link 
                    to={`/central/applications/${app.id}`} 
                    className="inline-flex items-center justify-center gap-2 pl-4 pr-3 py-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 transition-all font-bold shrink-0 ml-auto group/btn"
                    title="View Full Application Details"
                  >
                    <span className="text-xs">View</span>
                    <ArrowUpRight size={14} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>

                </div>
              </motion.div>
            ))}

            {/* Empty State Card */}
            {!isLoading && !loadError && filtered.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-16 shadow-xl shadow-emerald-900/5 flex flex-col items-center justify-center text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-emerald-50/30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoNzksIDcwLCAyMjksIDAuMSkiLz48L3N2Zz4=')] opacity-50 mix-blend-multiply" />
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10">
                  <Globe size={48} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-emerald-950 mb-2 relative z-10">No Applications Found</h3>
                <p className="text-emerald-800/60 font-medium max-w-sm relative z-10">
                  We couldn't find any applications matching the currently selected geographic and clearance type filters.
                </p>
                <button 
                  onClick={() => { setStateFilter('all'); setTypeFilter('all'); }}
                  className="mt-6 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all relative z-10"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
