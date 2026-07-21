import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { api } from '../services/api';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.forgotPassword(data);
      setResetToken(res.resetToken);
      setSent(true);
      toast.success('Reset link sent. Check your inbox.');
    } catch (e) {
      toast.error(e.message || 'Could not send reset link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="Enter your email and we'll send you a reset link.">
      {sent ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center py-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              <MailCheck className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm text-ink-600 dark:text-ink-300">
              If an account exists for that email, a reset link is on its way. For this demo, use the link below to reset your password.
            </p>
            {resetToken && (
              <Link to={`/reset-password?token=${resetToken}`} className="btn-primary mt-5">
                Reset password
              </Link>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Email</label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input type="email" className="input pl-10" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-50">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </AuthLayout>
  );
}
