import { motion, AnimatePresence } from 'framer-motion';
import { Download, Bell, Mail, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockNotifications } from '@/data/mockData';

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
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Notifications() {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-stone-50/50 flex flex-col font-sans -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden items-center">
      
      {/* Background with Blend Mode */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=1920&q=80")', // Beautiful, faint forest background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white/80 to-stone-50/90 pointer-events-none z-0" />
      
      {/* Dynamic Glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none z-0 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-teal-200/30 rounded-full blur-[100px] pointer-events-none z-0 -translate-x-1/3 translate-y-1/3" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl space-y-8 relative z-10"
      >
        {/* Dynamic Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center sm:text-left mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-emerald-100 text-emerald-700 text-xs font-bold shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Stay Updated
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-emerald-950 tracking-tight flex items-center justify-center sm:justify-start gap-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Notifications</span> Center
          </h1>
          <p className="text-emerald-800/60 font-medium mt-3 max-w-2xl mx-auto sm:mx-0">
            Review important alerts, reminders, and status updates regarding your environmental clearance applications.
          </p>
        </motion.div>

        {/* Notifications List (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-emerald-900/5 border border-white/60 overflow-hidden"
        >
          
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-emerald-100/60 flex items-center justify-between bg-emerald-50/30">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <Bell size={20} className="text-emerald-600" fill="currentColor" fillOpacity={0.2} />
              Recent Alerts
            </h3>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              {mockNotifications.filter(n => !n.read).length} Unread
            </span>
          </div>
          
          <div className="divide-y divide-emerald-50/80">
            <AnimatePresence>
              {mockNotifications.map((notification, idx) => {
                const isUnread = !notification.read;
                
                return (
                  <motion.div 
                    variants={itemVariants}
                    key={notification.id} 
                    className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-6 py-5 sm:px-8 sm:py-6 transition-all duration-300 ${
                      isUnread 
                        ? 'bg-emerald-50/50 hover:bg-emerald-50' 
                        : 'hover:bg-white'
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {isUnread && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div className={`p-3 rounded-2xl shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                      isUnread 
                        ? 'bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 ring-4 ring-emerald-500/10' 
                        : 'bg-stone-100 text-emerald-900/40'
                    }`}>
                      {notification.category === 'Status Update' && <CheckCircle2 size={24} />}
                      {notification.category === 'Action Required' && <AlertCircle size={24} className={isUnread ? "text-rose-500" : ""} />}
                      {notification.category === 'Reminder' && <Bell size={24} />}
                      {notification.category === 'Circular' && <Mail size={24} />}
                      {notification.category === 'System' && <Bell size={24} />}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1 sm:pt-0 w-full">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md w-fit ${
                            notification.category === 'Action Required' && isUnread
                              ? 'bg-rose-100 text-rose-700'
                              : isUnread 
                                ? 'bg-emerald-200/50 text-emerald-800' 
                                : 'bg-stone-100 text-emerald-900/50'
                          }`}>
                            {notification.category}
                          </span>
                          <span className="text-xs font-semibold text-emerald-800/40 tabular-data flex items-center gap-1.5 self-start sm:self-auto">
                             <span className="w-1 h-1 rounded-full bg-emerald-800/20 sm:hidden flex" />
                             {notification.date}
                          </span>
                       </div>
                       <p className={`text-base leading-snug break-words ${isUnread ? 'font-black text-emerald-950' : 'font-semibold text-emerald-900/60'}`}>
                          {notification.title}
                       </p>
                    </div>
                    
                    {/* Action */}
                    {notification.downloadUrl ? (
                      <button className="self-start sm:self-center mt-3 sm:mt-0 flex items-center gap-2 px-4 py-2 sm:px-3 sm:py-2.5 bg-white border border-emerald-100 hover:border-emerald-300 text-emerald-600 hover:text-emerald-700 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center group/btn shrink-0">
                        <Download size={16} className="group-hover/btn:-translate-y-[1px] transition-transform" />
                        <span className="sm:hidden">Download Attachment</span>
                      </button>
                    ) : (
                      <div className="w-[104px] hidden sm:block pointer-events-none" /> // Placeholder to keep alignment consistent if no button
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {mockNotifications.length === 0 && (
              <div className="px-6 py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-200 mb-4">
                  <Bell size={32} />
                </div>
                <p className="text-lg font-bold text-emerald-900/40">You're all caught up!</p>
                <p className="text-sm font-medium text-emerald-800/30 mt-1">Check back later for new alerts.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
