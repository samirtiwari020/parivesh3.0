import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Bell, Mail, CheckCircle2, AlertCircle, CheckCheck, Download, Check } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  batchId?: string | null;
  recipient?: {
    name?: string;
    email?: string;
    role?: string;
    state?: string;
  };
}

interface NotificationsResponse {
  success: boolean;
  notifications: NotificationItem[];
}

export default function Notifications() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [targetState, setTargetState] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['APPLICANT', 'STATE_REVIEWER', 'CENTRAL_REVIEWER', 'COMMITTEE_REVIEWER']);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const fetchNotifications = async () => {
    setIsLoading(true);
    setLoadError('');

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setNotifications([]);
      setLoadError('Please login again.');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isAdmin ? '/api/notifications/admin/all' : '/api/notifications';
      const response = await apiRequest<NotificationsResponse>(endpoint, {
        method: 'GET',
        token,
      });
      setNotifications(response.notifications || []);
    } catch (error) {
      setNotifications([]);
      setLoadError(error instanceof Error ? error.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchNotifications();
  }, [isAdmin]);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      await apiRequest(`/api/notifications/read/${id}`, {
        method: 'PUT',
        token,
      });
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      await apiRequest('/api/notifications/read-all', {
        method: 'PUT',
        token,
      });
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((previous) => previous.includes(role)
      ? previous.filter((item) => item !== role)
      : [...previous, role]);
  };

  const createAdminNotification = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError('');
    setFormSuccess('');

    if (!formTitle.trim() || !formMessage.trim()) {
      setFormError('Title and message are required.');
      return;
    }

    if (selectedRoles.length === 0) {
      setFormError('Select at least one target role.');
      return;
    }

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setFormError('Please login again.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/api/notifications/admin', {
        method: 'POST',
        token,
        body: JSON.stringify({
          title: formTitle.trim(),
          message: formMessage.trim(),
          targetRoles: selectedRoles,
          targetState: targetState.trim() || undefined,
        }),
      });

      setFormTitle('');
      setFormMessage('');
      setTargetState('');
      setFormSuccess('Notification created successfully.');
      await fetchNotifications();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editAdminNotification = async (notification: NotificationItem) => {
    const nextTitle = window.prompt('Edit title', notification.title);
    if (!nextTitle || !nextTitle.trim()) return;

    const nextMessage = window.prompt('Edit message', notification.message);
    if (!nextMessage || !nextMessage.trim()) return;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      await apiRequest(`/api/notifications/admin/${notification._id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify({
          title: nextTitle.trim(),
          message: nextMessage.trim(),
        }),
      });
      await fetchNotifications();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to update notification');
    }
  };

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
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full blur-[130px] pointer-events-none z-0 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-teal-200/30 rounded-full blur-[130px] pointer-events-none z-0 translate-y-1/3 -translate-x-1/4" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl space-y-8 relative z-10"
      >
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-emerald-100 text-emerald-700 text-xs font-bold shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Updates
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-emerald-950 tracking-tight flex items-center justify-center sm:justify-start gap-4 hover:drop-shadow-sm transition-all duration-300">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Notifications</span> Center
          </h1>
          <p className="text-emerald-800/60 font-medium mt-3 max-w-2xl mx-auto sm:mx-0">
            Review important alerts, reminders, and status updates for your account.
          </p>
        </motion.div>

        {isAdmin && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-white/60 p-6 sm:p-8">
            <h3 className="font-black text-xl text-emerald-950 mb-6">Broadcast New Notification</h3>
            <form onSubmit={createAdminNotification} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider pl-1">Title</label>
                  <input value={formTitle} onChange={(event) => setFormTitle(event.target.value)} className="w-full bg-white border border-emerald-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-sm font-medium text-emerald-950 placeholder-emerald-900/30 transition-all outline-none" placeholder="Notification Subject" />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider pl-1">Target State <span className="text-[10px] normal-case tracking-normal">(optional)</span></label>
                  <input value={targetState} onChange={(event) => setTargetState(event.target.value)} className="w-full bg-white border border-emerald-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-sm font-medium text-emerald-950 placeholder-emerald-900/30 transition-all outline-none" placeholder="e.g. Maharashtra" />
                </div>
              </div>
              
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider pl-1">Message Content</label>
                <textarea value={formMessage} onChange={(event) => setFormMessage(event.target.value)} rows={3} className="w-full bg-white border border-emerald-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-sm font-medium text-emerald-950 placeholder-emerald-900/30 transition-all outline-none resize-none" placeholder="Enter message details here..." />
              </div>
              
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider pl-1">Target Audiences</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['APPLICANT', 'STATE_REVIEWER', 'CENTRAL_REVIEWER', 'COMMITTEE_REVIEWER'].map((role) => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                          isSelected 
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20' 
                            : 'bg-white text-emerald-900/50 border-emerald-100 hover:border-emerald-300 hover:text-emerald-700'
                        }`}
                      >
                         <span className="flex items-center gap-1.5">{isSelected && <Check size={12} />} {role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {formError && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100">{formError}</p>}
              {formSuccess && <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">{formSuccess}</p>}
              
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">
                  {isSubmitting ? 'Publishing...' : 'Publish Notification'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-emerald-900/5 border border-white/60 overflow-hidden">
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-emerald-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/30">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <Bell size={20} className="text-emerald-600" fill="currentColor" fillOpacity={0.2} />
              {isAdmin ? 'All Sent Notifications' : 'Recent Alerts'}
            </h3>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {!isAdmin && unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
              {(!isAdmin || unreadCount > 0) && (
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full shadow-sm">
                  {unreadCount} Unread
                </span>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-emerald-50/80">
            <AnimatePresence>
              {isLoading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-20 text-center flex flex-col items-center">
                  <span className="w-8 h-8 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mb-4" />
                  <span className="text-emerald-900/60 font-bold">Loading...</span>
                </motion.div>
              ) : loadError ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-20 text-center">
                  <div className="inline-flex max-w-sm bg-rose-50 text-rose-600 p-4 rounded-2xl border border-rose-200 text-sm font-bold shadow-sm">
                    {loadError}
                  </div>
                </motion.div>
              ) : notifications.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-200 mb-4 shadow-inner border border-emerald-100">
                    <Bell size={32} />
                  </div>
                  <p className="text-lg font-bold text-emerald-900/40">No alerts found</p>
                  <p className="text-sm font-medium text-emerald-800/30 mt-1">Check back later.</p>
                </motion.div>
              ) : (
                notifications.map((notification) => {
                  const isUnread = !notification.isRead;
                  
                  return (
                    <motion.div 
                      variants={itemVariants}
                      key={notification._id} 
                      className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-6 py-5 sm:px-8 sm:py-6 transition-all duration-300 ${
                        isUnread ? 'bg-emerald-50/50 hover:bg-emerald-100/40' : 'hover:bg-white'
                      }`}
                    >
                      {/* Unread indicator bar */}
                      {isUnread && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full shadow-sm shadow-emerald-400" />
                      )}

                      {/* Icon */}
                      <div className={`p-3 rounded-2xl shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                        isUnread ? 'bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 ring-4 ring-emerald-500/10' : 'bg-stone-100 text-emerald-900/40'
                      }`}>
                        {notification.type === 'SUCCESS' ? <CheckCircle2 size={24} /> : 
                         notification.type === 'ALERT' ? <AlertCircle size={24} className={isUnread ? "text-rose-500" : ""} /> : 
                         <Bell size={24} />}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1 sm:pt-0 w-full">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md w-fit ${
                                notification.type === 'ALERT' && isUnread ? 'bg-rose-100 text-rose-700' :
                                isUnread ? 'bg-emerald-200/50 text-emerald-800' : 'bg-stone-100 text-emerald-900/50'
                              }`}>
                                {notification.type || 'SYSTEM'}
                              </span>
                              {isAdmin && notification.recipient && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                  To: {notification.recipient.name || notification.recipient.email} ({notification.recipient.role})
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-emerald-800/40 tabular-data flex items-center gap-1.5 self-start sm:self-auto mt-1 sm:mt-0">
                               <span className="w-1 h-1 rounded-full bg-emerald-800/20 sm:hidden flex" />
                               {new Date(notification.createdAt).toLocaleString('en-GB')}
                            </span>
                         </div>
                         <h4 className={`text-base leading-snug break-words mt-1 ${isUnread ? 'font-black text-emerald-950' : 'font-bold text-emerald-900/80'}`}>
                            {notification.title}
                         </h4>
                         <p className={`text-sm mt-1 leading-snug break-words ${isUnread ? 'font-medium text-emerald-900/70' : 'text-emerald-900/50'}`}>
                            {notification.message}
                         </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="self-start sm:self-center mt-3 sm:mt-0 flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 justify-end sm:justify-center">
                        {!isAdmin && isUnread && (
                          <button 
                            onClick={() => markAsRead(notification._id)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200/50 hover:border-emerald-500 rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-auto group/readBtn shrink-0"
                            title="Mark as Read"
                          >
                            <CheckCircle2 size={16} className="group-hover/readBtn:scale-110 transition-transform" />
                            <span className="sm:hidden lg:inline">Mark Read</span>
                          </button>
                        )}
                        {isAdmin && (
                          <button 
                            onClick={() => editAdminNotification(notification)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-200/50 hover:border-amber-500 rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-auto shrink-0"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
