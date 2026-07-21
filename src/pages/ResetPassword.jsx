import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { api } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { token } });
  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.resetPassword({ token: data.token, password: data.password });
      toast.success('Password reset. Sign in with your new password.');
      navigate('/login');
    } catch (e) {
      toast.error(e.message || 'Could not reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used before.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Reset token</label>
          <input className="input mt-1 font-mono text-xs" readOnly value={token} {...register('token', { required: true })} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">New password</label>
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
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Confirm password</label>
          <input type="password" className="input mt-1" placeholder="••••••••" {...register('confirm', { required: 'Please confirm', validate: (v) => v === password || 'Passwords do not match' })} />
          {errors.confirm && <p className="mt-1 text-xs text-rose-500">{errors.confirm.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
      <Link to="/login" className="mt-6 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
