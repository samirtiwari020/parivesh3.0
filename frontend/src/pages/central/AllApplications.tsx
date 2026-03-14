import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ProposalMapVisualization from '@/components/maps/ProposalMapVisualization';
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

        {/* Global Map Display */}
        {!isLoading && !loadError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] p-4 md:p-6 shadow-xl shadow-emerald-900/5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="mb-4 flex items-center gap-2 px-2">
              <Globe className="text-emerald-500" size={24} />
              <div>
                <h3 className="text-xl font-bold text-emerald-950 font-serif leading-tight">Geospatial Distribution</h3>
                <p className="text-xs font-medium text-emerald-700/70">Interactive map mapping {filtered.length} visible proposals</p>
              </div>
            </div>
            
            <div className="rounded-[1.5rem] overflow-hidden shadow-inner border border-emerald-100 bg-emerald-50/50">
              <ProposalMapVisualization className="w-full h-[600px]" proposals={filtered} role="central" showListOverlay={true} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

