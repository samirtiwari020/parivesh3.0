import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="gov-card p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Landmark className="text-primary" size={28} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Register</h1>
            <p className="text-sm text-muted-foreground mt-1">Create your Project Proponent account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="gov-label">Organization Name</label>
              <input {...register('organizationName')} className="gov-input" placeholder="e.g. National Highways Authority" />
              {errors.organizationName && <p className="text-xs text-destructive mt-1">{errors.organizationName.message}</p>}
            </div>

            <div>
              <label className="gov-label">Company PAN / CIN</label>
              <input {...register('panCin')} className="gov-input" placeholder="e.g. AABCN1234A" />
              {errors.panCin && <p className="text-xs text-destructive mt-1">{errors.panCin.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="gov-label">Email</label>
                <input {...register('email')} type="email" className="gov-input" placeholder="email@org.gov.in" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="gov-label">Phone</label>
                <input {...register('phone')} type="tel" className="gov-input" placeholder="+91 XXXXX XXXXX" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="gov-label">Address</label>
              <textarea {...register('address')} className="gov-input min-h-[80px] resize-none" placeholder="Full registered address" />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="gov-label">Password</label>
                <div className="relative">
                  <input {...register('password')} type={showPassword ? 'text' : 'password'} className="gov-input pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="gov-label">Confirm Password</label>
                <input {...register('confirmPassword')} type="password" className="gov-input" placeholder="••••••••" />
                {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {registerError && <p className="text-xs text-destructive">{registerError}</p>}

            <button type="submit" disabled={isSubmitting} className="gov-btn-primary w-full justify-center mt-2">
              <UserPlus size={18} /> Create Account
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
