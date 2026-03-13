import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Eye, EyeOff, ShieldAlert, Mail, Lock, ArrowRight, Sparkles, Sprout, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import loginBg from '@/assets/images/copy1.jpg';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
  }),
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen w-full flex bg-[#030712] font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* Background glow effects for the entire screen */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16,185,129,0.03), transparent 40%)`
        }}
      />

      {/* LEFT PANEL: HERO BRANDING */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Animated Background Image */}
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center z-0 mix-blend-luminosity opacity-40"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#022c22]/90 via-[#064e3b]/80 to-[#030712]/95 z-0" />
        
        {/* Decorative Glowing Orbs */}
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] z-0"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-teal-600/20 rounded-full blur-[120px] z-0"
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Landmark size={24} className="text-emerald-400" />
          </div>
          <span className="text-2xl font-serif font-bold text-white tracking-wide drop-shadow-md">
            PARIVESH
          </span>
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-xl">
          <motion.div 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-6 backdrop-blur-md shadow-sm"
          >
            <Sparkles size={16} />
            <span>Next Generation Platform</span>
          </motion.div>
          
          <motion.h1 
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="text-5xl xl:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-teal-200 leading-[1.1] mb-6 drop-shadow-sm"
          >
            Clearance <br/> Management <br/> Reimagined.
          </motion.h1>
          
          <motion.p 
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="text-lg text-emerald-100/70 font-medium leading-relaxed max-w-md"
          >
            A seamless, single-window hub for processing Environmental, Forest, Wildlife, and Coastal Regulation Zone clearances securely.
          </motion.p>

          {/* Stats/Features showcase */}
          <motion.div 
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="mt-12 grid grid-cols-2 gap-6"
          >
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-xl group hover:bg-white/10 transition-colors cursor-default">
              <Sprout className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
              <div className="text-white font-bold text-xl mb-1">Sustainable</div>
              <div className="text-emerald-100/50 text-sm leading-snug group-hover:text-emerald-100/70 transition-colors">Paperless workflows & digital tracking</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-xl group hover:bg-white/10 transition-colors cursor-default">
              <ShieldCheck className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
              <div className="text-white font-bold text-xl mb-1">Secure</div>
              <div className="text-emerald-100/50 text-sm leading-snug group-hover:text-emerald-100/70 transition-colors">End-to-end encrypted validation</div>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-sm text-emerald-100/50 font-medium mt-auto">
          &copy; {new Date().getFullYear()} Ministry of Environment, Forest and Climate Change.
        </div>
      </div>

      {/* RIGHT PANEL: LOGIN FORM */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#030712] lg:bg-transparent">
        
        {/* Mobile Header Logo */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Landmark size={20} className="text-emerald-400" />
          </div>
          <span className="text-xl font-serif font-bold text-white tracking-wide">
            PARIVESH
          </span>
        </div>

        <div className="w-full max-w-sm xl:max-w-md">
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >
            <div className="mb-10 mt-16 lg:mt-0 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
              <p className="text-zinc-400 text-sm xl:text-base font-medium">
                Enter your credentials to securely access the portal.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Email Input */}
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUpVariants} className="space-y-2 relative">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    {...register('email')} 
                    type="email" 
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:bg-zinc-900 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-600 outline-none text-sm xl:text-base shadow-sm" 
                    placeholder="name@domain.gov.in" 
                  />
                  {errors.email && (
                    <div className="absolute -bottom-6 left-1 flex items-center gap-1 text-xs text-red-400 font-medium">
                      <ShieldAlert size={12} /> {errors.email.message}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUpVariants} className="space-y-2 pt-2 relative">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="#" className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    {...register('password')} 
                    type={showPassword ? 'text' : 'password'} 
                    className="w-full pl-12 pr-12 py-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:bg-zinc-900 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-600 outline-none text-sm xl:text-base shadow-sm" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <div className="absolute -bottom-6 left-1 flex items-center gap-1 text-xs text-red-400 font-medium">
                      <ShieldAlert size={12} /> {errors.password.message}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Error Message */}
              <div className="pt-4 min-h-[3rem]">
                <AnimatePresence>
                  {authError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 font-medium flex items-center gap-2"
                    >
                      <ShieldAlert size={16} className="shrink-0" /> {authError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUpVariants}>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="group relative w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm xl:text-base overflow-hidden shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10">{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                  {!isSubmitting && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                </button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div 
              custom={5} 
              initial="hidden" 
              animate="visible" 
              variants={fadeUpVariants} 
              className="mt-8 pt-6 border-t border-zinc-800 text-center lg:text-left"
            >
              <p className="text-sm text-zinc-400 font-medium">
                Don't have an official account?{' '}
                <Link to="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors font-semibold hover:underline underline-offset-4 decoration-emerald-500/30">
                  Request access
                </Link>
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
      
    </div>
  );
}
