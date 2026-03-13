import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, LogIn, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';

import heroImage from '@/assets/images/copy1.jpg';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setAuthError('');
    try {
      const loggedInUser = await login(data.email, data.password);
      const role = loggedInUser.role as UserRole;
      const routes: Record<string, string> = {
        [UserRole.APPLICANT]: '/applicant',
        [UserRole.STATE_REVIEWER]: '/state',
        [UserRole.CENTRAL_REVIEWER]: '/central',
        [UserRole.ADMIN]: '/admin',
      };
      navigate(routes[role] || '/');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <img 
          src={heroImage} 
          alt="Login Background" 
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
        className="w-full max-w-[1000px] grid lg:grid-cols-2 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-10"
      >

        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-white/10 to-transparent border-r border-white/10">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/30 shadow-inner">
              <Landmark className="text-white drop-shadow-sm" size={32} />
            </div>

            <h2 className="text-4xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-md">
              Welcome to <br/>
              <span className="text-accent">PARIVESH</span>
            </h2>

            <p className="text-emerald-50/80 text-lg leading-relaxed">
              Login to access your account.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <CheckCircle2 size={16}/>
              </div>
              <span className="text-emerald-50/90 text-sm font-medium">Secure System</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <CheckCircle2 size={16}/>
              </div>
              <span className="text-emerald-50/90 text-sm font-medium">Fast Processing</span>
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white/95">

          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Landmark className="text-primary" size={32} />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Please sign in to your PARIVESH account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>

              <input 
                {...register('email')} 
                type="email" 
                className="w-full px-5 py-4 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60" 
                placeholder="your@email.gov.in" 
              />

              {errors.email && (
                <p className="text-xs text-destructive mt-1.5 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>

              <div className="relative">
                <input 
                  {...register('password')} 
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full pl-5 pr-12 py-4 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder:text-muted-foreground/60" 
                  placeholder="••••••••" 
                />

                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-destructive mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {authError && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium text-center">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {isSubmitting ? 'Signing In...' : 'Sign In To Portal'}
            </button>

          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Register Now
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}