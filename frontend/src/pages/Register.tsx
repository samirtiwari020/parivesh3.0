import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, UserPlus, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';

import heroImage from '@/assets/images/copy1.jpg';

const registerSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  panCin: z.string().min(5, 'Valid PAN/CIN is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Valid phone number is required').max(15),
  address: z.string().min(10, 'Complete address is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setRegisterError('');
    try {
      await registerUser({
        name: data.organizationName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        organization: data.organizationName,
        role: UserRole.APPLICANT,
      });
      navigate('/applicant');
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <img 
          src={heroImage} 
          alt="Registration Background" 
          className="w-full h-full object-cover scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-primary/80 to-emerald-900/90 -z-10 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 -z-10 mix-blend-overlay" />
      <div className="absolute top-1/4 left-1/4 w-[50vh] h-[50vh] bg-accent/30 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Back to Home */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 text-white/70 hover:text-white flex items-center gap-2 font-medium transition-colors z-20 group"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
          <ArrowLeft size={18} />
        </div>
        Back to Hub
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-10 my-16 lg:my-0"
      >

        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-white/10 to-transparent border-r border-white/10">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/30 shadow-inner">
              <Landmark className="text-white drop-shadow-sm" size={32} />
            </div>

            <h2 className="text-4xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-md">
              Join <br/>
              <span className="text-accent">PARIVESH</span> Today
            </h2>

            <p className="text-emerald-50/80 text-lg leading-relaxed">
              Create your Project Proponent account to submit proposals, track clearances, and manage compliance.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <CheckCircle2 size={16}/>
              </div>
              <span className="text-emerald-50/90 text-sm font-medium">Single Window Registration</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <CheckCircle2 size={16}/>
              </div>
              <span className="text-emerald-50/90 text-sm font-medium">Verified Applicant Profiles</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <CheckCircle2 size={16}/>
              </div>
              <span className="text-emerald-50/90 text-sm font-medium">Real-time Application Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white/95">

          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Landmark className="text-primary" size={32} />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Register as a new organization
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Org Name */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Organization Name
                </label>
                <input 
                  {...register('organizationName')} 
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60 text-sm" 
                  placeholder="e.g. NHAI" 
                />
                {errors.organizationName && <p className="text-[10px] text-destructive mt-1 font-bold">{errors.organizationName.message}</p>}
              </div>

              {/* PAN / CIN */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Company PAN / CIN
                </label>
                <input 
                  {...register('panCin')} 
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60 text-sm" 
                  placeholder="e.g. AABCN1234A" 
                />
                {errors.panCin && <p className="text-[10px] text-destructive mt-1 font-bold">{errors.panCin.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Email
                </label>
                <input 
                  {...register('email')} 
                  type="email" 
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60 text-sm" 
                  placeholder="email@org.gov.in" 
                />
                {errors.email && <p className="text-[10px] text-destructive mt-1 font-bold">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Phone
                </label>
                <input 
                  {...register('phone')} 
                  type="tel" 
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60 text-sm" 
                  placeholder="+91 XXXXX XXXXX" 
                />
                {errors.phone && <p className="text-[10px] text-destructive mt-1 font-bold">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Address
              </label>
              <textarea 
                {...register('address')} 
                className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60 text-sm min-h-[80px] resize-none" 
                placeholder="Full registered headquarters address..." 
              />
              {errors.address && <p className="text-[10px] text-destructive mt-1 font-bold">{errors.address.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input 
                    {...register('password')} 
                    type={showPassword ? 'text' : 'password'} 
                    className="w-full pl-4 pr-10 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60 text-sm" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-destructive mt-1 font-bold">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input 
                  {...register('confirmPassword')} 
                  type="password" 
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60 text-sm" 
                  placeholder="••••••••" 
                />
                {errors.confirmPassword && <p className="text-[10px] text-destructive mt-1 font-bold">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {registerError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-bold text-center">
                {registerError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-3.5 mt-2 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <UserPlus size={18} /> 
              {isSubmitting ? 'Creating Account...' : 'Register'}
            </button>
            
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}
