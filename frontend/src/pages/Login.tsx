import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Please select a role'),
  state: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const roleOptions = [
  { value: UserRole.APPLICANT, label: 'Project Proponent (Applicant)' },
  { value: UserRole.STATE_REVIEWER, label: 'State Processing Authority' },
  { value: UserRole.CENTRAL_REVIEWER, label: 'Central Processing Authority' },
  { value: UserRole.ADMIN, label: 'Administrator' },
];

const states = ['Maharashtra', 'Rajasthan', 'Kerala', 'Gujarat', 'Chhattisgarh', 'Jharkhand', 'Andhra Pradesh', 'Madhya Pradesh', 'Tamil Nadu'];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = (data: LoginForm) => {
    const role = data.role as UserRole;
    login(data.email, data.password, role, data.state);

    const routes: Record<string, string> = {
      [UserRole.APPLICANT]: '/applicant',
      [UserRole.STATE_REVIEWER]: '/state',
      [UserRole.CENTRAL_REVIEWER]: '/central',
      [UserRole.ADMIN]: '/admin',
    };
    navigate(routes[role] || '/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="gov-card p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Landmark className="text-primary" size={28} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">Access your PARIVESH account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="gov-label">Email Address</label>
              <input {...register('email')} type="email" className="gov-input" placeholder="your@email.gov.in" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="gov-label">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPassword ? 'text' : 'password'} className="gov-input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="gov-label">Login As</label>
              <select {...register('role')} className="gov-input">
                <option value="">Select Role</option>
                {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              {errors.role && <p className="text-xs text-destructive mt-1">{errors.role.message}</p>}
            </div>

            {selectedRole === UserRole.STATE_REVIEWER && (
              <div>
                <label className="gov-label">Assigned State</label>
                <select {...register('state')} className="gov-input">
                  <option value="">Select State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="gov-btn-primary w-full justify-center">
              <LogIn size={18} /> Sign In
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
