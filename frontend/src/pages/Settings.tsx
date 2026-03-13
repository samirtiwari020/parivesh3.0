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
  const { user, login } = useAuth(); // Assuming login or a similar function can refresh user state if needed
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
      
      // Ideally, context would provide an updateUser method. 
      // If not, the easiest way to reflect changes immediately is a reload or minimal state trick, 
      // but typically we'd just want to re-fetch the user context here.
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Profile Summary */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-950/95 backdrop-blur-2xl border border-emerald-800 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/30 transition-colors" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-4 border-emerald-800/50 shadow-inner shrink-0">
            <span className="text-4xl font-bold text-white uppercase">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-serif font-bold text-white mb-2">{user?.name || 'User Profile'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-emerald-100/80 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Mail size={14} className="text-accent" /> {user?.email}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Shield size={14} className="text-accent" /> Role: {user?.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-2"
        >
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white/60 text-emerald-800 hover:bg-white hover:text-primary border border-emerald-100'}`}
          >
            <User size={20} /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'preferences' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white/60 text-emerald-800 hover:bg-white hover:text-primary border border-emerald-100'}`}
          >
            <Bell size={20} /> Preferences
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white/60 text-emerald-800 hover:bg-white hover:text-primary border border-emerald-100'}`}
          >
            <Shield size={20} /> Security
          </button>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-9"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-3xl p-8 shadow-sm">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950 mb-2">Personal Information</h2>
                    <p className="text-emerald-700 font-medium text-sm">Update your contact details and organizational information.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-emerald-900 flex items-center gap-2"><User size={16} className="text-primary"/> Full Name</label>
                      <input 
                        {...register('name')} 
                        className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-emerald-950" 
                        placeholder="John Doe" 
                      />
                      {errors.name && <p className="text-xs text-destructive font-bold">{errors.name.message}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-emerald-900 flex items-center gap-2"><Phone size={16} className="text-primary"/> Phone Number</label>
                        <input 
                          {...register('phone')} 
                          className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-emerald-950" 
                          placeholder="+91 9876543210" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-emerald-900 flex items-center gap-2"><Building2 size={16} className="text-primary"/> Organization</label>
                        <input 
                          {...register('organization')} 
                          className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-emerald-950" 
                          placeholder="Company Name Ltd." 
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
                      <div className="flex-1">
                        {updateError && <p className="text-sm text-destructive font-bold">{updateError}</p>}
                        {isSuccess && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-accent font-bold flex items-center gap-2">
                            <CheckCircle2 size={16} /> Profile updated successfully!
                          </motion.p>
                        )}
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div 
                   key="preferences"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="py-12 text-center"
                 >
                   <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center mx-auto mb-4">
                     <Bell size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-emerald-950 mb-2">Notification Preferences</h3>
                   <p className="text-emerald-700">Customize how and when you receive alerts. (Coming Soon)</p>
                 </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                   key="security"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="py-12 text-center"
                 >
                   <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center mx-auto mb-4">
                     <Shield size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-emerald-950 mb-2">Security Settings</h3>
                   <p className="text-emerald-700">Change your password and manage two-factor authentication. (Coming Soon)</p>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
