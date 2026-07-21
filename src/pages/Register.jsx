import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';
import AuthLayout, { AuthSwitchLink } from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', confirm: '', terms: false },
  });
  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const u = await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success(`Account created. Welcome, ${u.name.split(' ')[0]}!`);
      navigate('/app/dashboard', { replace: true });
    } catch (e) {
      toast.error(e.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start tracking your finances in under a minute.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Full name</label>
          <div className="relative mt-1">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-10" placeholder="Riya Sharma" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })} />
          </div>
          {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Email</label>
          <div className="relative mt-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input type="email" className="input pl-10" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Password</label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input type={showPw ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="••••••••" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
              <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Confirm</label>
            <input type="password" className="input mt-1" placeholder="••••••••" {...register('confirm', { required: 'Please confirm your password', validate: (v) => v === password || 'Passwords do not match' })} />
            {errors.confirm && <p className="mt-1 text-xs text-rose-500">{errors.confirm.message}</p>}
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" {...register('terms', { required: 'Please accept the terms' })} />
          <span>I agree to the <span className="font-medium text-brand-600 dark:text-brand-400">Terms of Service</span> and <span className="font-medium text-brand-600 dark:text-brand-400">Privacy Policy</span>.</span>
        </label>
        {errors.terms && <p className="-mt-2 text-xs text-rose-500">{errors.terms.message}</p>}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <AuthSwitchLink to="/login" text="Already have an account?" linkText="Sign in" />
    </AuthLayout>
  );
}
