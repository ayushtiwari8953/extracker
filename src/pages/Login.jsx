import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import AuthLayout, { AuthSwitchLink } from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', remember: true },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const u = await login(data);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
      const from = location.state?.from?.pathname || '/app/dashboard';
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      handleSubmit({ email: 'admin@fintrack.app', password: 'admin123', remember: true })();
    } else {
      handleSubmit({ email: 'demo@fintrack.app', password: 'demo123', remember: true })();
    }
  };

  return (
    <AuthLayout title="Sign in to your account" subtitle="Welcome back. Please enter your details.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Email</label>
          <div className="relative mt-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="email"
              className="input pl-10"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type={showPw ? 'text' : 'password'}
              className="input pl-10 pr-10"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
          <input type="checkbox" className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" {...register('remember')} />
          Remember me for 30 days
        </label>

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-dashed border-ink-200 dark:border-ink-700 p-3">
        <p className="text-xs text-ink-500 dark:text-ink-400 mb-2">Try a demo account:</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => fillDemo('user')} className="btn-outline flex-1 !py-2 text-xs">User demo</button>
          <button type="button" onClick={() => fillDemo('admin')} className="btn-outline flex-1 !py-2 text-xs">Admin demo</button>
        </div>
      </div>

      <AuthSwitchLink to="/register" text="Don't have an account?" linkText="Create one" />
    </AuthLayout>
  );
}
