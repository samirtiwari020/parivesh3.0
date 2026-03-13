import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Bell, Save, Building2, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  organization: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Settings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [isSuccess, setIsSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: (user as any)?.phone || '',
      organization: (user as any)?.organization || '',
    }
  });

  const onSubmit = async (data: ProfileForm) => {
    setUpdateError('');
    setIsSuccess(false);

    try {
      await apiRequest('/api/users/profile', { 
        method: 'PUT', 
        body: JSON.stringify(data), 
        token: (user as any)?.token 
      });
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-stone-50/50 flex flex-col font-sans -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden items-center">
      
      {/* Universal Beautiful Background with Blend Mode */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=80")', // A beautiful, serene, premium forest aesthetic
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white/80 to-teal-50/90 pointer-events-none z-0" />
      
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[35rem] h-[35rem] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none z-0 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-200/30 rounded-full blur-[120px] pointer-events-none z-0 translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-5xl mx-auto w-full space-y-8 relative z-10">
        {/* Header Profile Summary Container */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/95 backdrop-blur-3xl border border-emerald-800/80 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group"
        >
          {/* Internal card glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/30 transition-colors duration-700" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 w-full">
            {/* Avatar Circle */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/5 flex items-center justify-center border-[3px] border-emerald-400/30 shadow-inner shadow-emerald-900/50 shrink-0 backdrop-blur-md relative overflow-hidden group-hover:border-emerald-400/50 transition-colors duration-500 cursor-default">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-200 uppercase drop-shadow-md">
                {user?.name?.charAt(0) || 'U'}
              </span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="text-center md:text-left flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/40 border border-emerald-700/50 text-emerald-100 text-[10px] font-bold uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Account Settings
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-white mb-3 truncate">
                {user?.name || 'User Profile'}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-emerald-50/90 text-sm font-semibold">
                <span className="flex items-center gap-2 bg-emerald-900/50 backdrop-blur-md px-4 py-1.5 rounded-xl border border-emerald-700/50 shadow-sm whitespace-nowrap">
                  <Mail size={16} className="text-emerald-300" /> 
                  <span className="truncate max-w-[200px] sm:max-w-none">{user?.email || 'No email provided'}</span>
                </span>
                <span className="flex items-center gap-2 bg-emerald-900/50 backdrop-blur-md px-4 py-1.5 rounded-xl border border-emerald-700/50 shadow-sm whitespace-nowrap">
                  <Shield size={16} className="text-emerald-300" /> 
                  <span className="capitalize">{user?.role?.replace('_', ' ') || 'User'}</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Grid (Glassmorphism Area) */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Sidebar Tabs (Glass Buttons) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 flex flex-col gap-3"
          >
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-3xl font-bold transition-all duration-300 border backdrop-blur-xl ${
                activeTab === 'profile' 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-900/10 scale-[1.02]' 
                  : 'bg-white/60 border-emerald-100/60 text-emerald-800 hover:bg-white hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-3"><User size={20} className={activeTab === 'profile' ? "text-emerald-100" : "text-emerald-600/70"} /> Personal Info</span>
              {activeTab === 'profile' && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />}
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-3xl font-bold transition-all duration-300 border backdrop-blur-xl ${
                activeTab === 'preferences' 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-900/10 scale-[1.02]' 
                  : 'bg-white/60 border-emerald-100/60 text-emerald-800 hover:bg-white hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-3"><Bell size={20} className={activeTab === 'preferences' ? "text-emerald-100" : "text-emerald-600/70"} /> Preferences</span>
              {activeTab === 'preferences' && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />}
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-3xl font-bold transition-all duration-300 border backdrop-blur-xl ${
                activeTab === 'security' 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-900/10 scale-[1.02]' 
                  : 'bg-white/60 border-emerald-100/60 text-emerald-800 hover:bg-white hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-3"><Shield size={20} className={activeTab === 'security' ? "text-emerald-100" : "text-emerald-600/70"} /> Security Settings</span>
              {activeTab === 'security' && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />}
            </button>
          </motion.div>

          {/* Dynamic Content Area (Glass Container) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-emerald-900/5 h-full relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-emerald-950 mb-2 truncate">Personal Information</h2>
                      <p className="text-emerald-700/80 font-medium">Review and update your contact details to ensure seamless communication.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                          <User size={16} className="text-emerald-500"/> Full Name
                        </label>
                        <input 
                          {...register('name')} 
                          className="w-full px-5 py-4 bg-white/50 border border-emerald-100 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-950 shadow-sm placeholder:text-emerald-900/30 placeholder:font-semibold" 
                          placeholder="E.g., John Doe" 
                        />
                        {errors.name && <p className="text-xs text-rose-500 font-bold px-2">{errors.name.message}</p>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                            <Phone size={16} className="text-emerald-500"/> Phone Number
                          </label>
                          <input 
                            {...register('phone')} 
                            className="w-full px-5 py-4 bg-white/50 border border-emerald-100 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-950 shadow-sm placeholder:text-emerald-900/30 placeholder:font-semibold" 
                            placeholder="+91 9876543210" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                            <Building2 size={16} className="text-emerald-500"/> Organization
                          </label>
                          <input 
                            {...register('organization')} 
                            className="w-full px-5 py-4 bg-white/50 border border-emerald-100 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-950 shadow-sm placeholder:text-emerald-900/30 placeholder:font-semibold" 
                            placeholder="Associated Company/Dept." 
                          />
                        </div>
                      </div>

                      <div className="pt-8 mt-4 border-t border-emerald-100/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1 min-h-[24px]">
                          {updateError && (
                            <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 inline-block">
                              {updateError}
                            </motion.p>
                          )}
                          {isSuccess && (
                            <motion.p initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} className="text-sm text-emerald-700 font-bold flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-flex">
                              <CheckCircle2 size={16} strokeWidth={3} className="text-emerald-500" /> Changes saved successfully!
                            </motion.p>
                          )}
                        </div>
                        
                        <button 
                          type="submit" 
                          disabled={isSubmitting} 
                          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 group"
                        >
                          <Save size={20} className="group-disabled:animate-pulse" /> 
                          {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'preferences' && (
                  <motion.div 
                     key="preferences"
                     initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                     animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                     exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                     transition={{ duration: 0.3 }}
                     className="py-16 text-center flex flex-col items-center justify-center h-full"
                   >
                     <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-100 to-teal-50/50 text-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
                       <Bell size={40} className="drop-shadow-sm" />
                     </div>
                     <h3 className="text-3xl font-black text-emerald-950 mb-3 font-serif">Notification Preferences</h3>
                     <p className="text-emerald-700/80 font-medium max-w-sm mx-auto">Customize how and when you receive system alerts and emails. This feature is coming soon.</p>
                     
                     <div className="mt-8 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600 text-sm font-bold uppercase tracking-widest pointer-events-none opacity-60">
                       Under Construction
                     </div>
                   </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div 
                     key="security"
                     initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                     animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                     exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                     transition={{ duration: 0.3 }}
                     className="py-16 text-center flex flex-col items-center justify-center h-full"
                   >
                     <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-100 to-emerald-50/50 text-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
                       <Shield size={40} className="drop-shadow-sm" />
                     </div>
                     <h3 className="text-3xl font-black text-emerald-950 mb-3 font-serif">Security Settings</h3>
                     <p className="text-emerald-700/80 font-medium max-w-sm mx-auto">Update your password, manage active sessions, and configure two-factor authentication.</p>
                     
                     <div className="mt-8 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-600 text-sm font-bold uppercase tracking-widest pointer-events-none opacity-60">
                       Under Construction
                     </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
