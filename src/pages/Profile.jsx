import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User as UserIcon, Mail, Camera, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/formatters';

export default function Profile() {
  const { user, setUser, refresh } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const profileForm = useForm({ defaultValues: { name: user?.name || '', email: user?.email || '' } });
  const pwForm = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirm: '' } });
  const newPassword = pwForm.watch('newPassword');

  const onProfile = async (data) => {
    setSavingProfile(true);
    try {
      const updated = await api.updateProfile(user.id, data);
      setUser(updated);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const onPassword = async (data) => {
    setSavingPw(true);
    try {
      await api.changePassword(user.id, { currentPassword: data.currentPassword, newPassword: data.newPassword });
      pwForm.reset();
      toast.success('Password changed');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSavingPw(false);
    }
  };

  const onAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const updated = await api.uploadAvatar(user.id, reader.result);
        setUser(updated);
        toast.success('Profile picture updated');
      } catch (err) {
        toast.error(err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Profile</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Manage your personal information and password.</p>
      </div>

      {/* Profile header */}
      <div className="card p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar name={user.name} src={user.avatar} size="xl" />
            <label className="absolute -bottom-1 -right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-brand-600 text-white shadow-soft hover:bg-brand-700">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-ink-50">{user.name}</h2>
              <Badge variant={user.role === 'admin' ? 'info' : 'default'}>{user.role}</Badge>
            </div>
            <p className="text-sm text-ink-500 dark:text-ink-400">{user.email}</p>
            <p className="mt-1 text-xs text-ink-400">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Edit profile */}
        <div className="card p-6">
          <h3 className="mb-4 font-display text-base font-bold text-ink-900 dark:text-ink-50">Personal information</h3>
          <form onSubmit={profileForm.handleSubmit(onProfile)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Full name</label>
              <div className="relative mt-1">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input className="input pl-10" {...profileForm.register('name', { required: 'Name is required' })} />
              </div>
              {profileForm.formState.errors.name && <p className="mt-1 text-xs text-rose-500">{profileForm.formState.errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Email</label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input type="email" className="input pl-10" {...profileForm.register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
              </div>
              {profileForm.formState.errors.email && <p className="mt-1 text-xs text-rose-500">{profileForm.formState.errors.email.message}</p>}
            </div>
            <button type="submit" className="btn-primary" disabled={savingProfile}>
              <Save className="h-4 w-4" /> {savingProfile ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card p-6">
          <h3 className="mb-4 font-display text-base font-bold text-ink-900 dark:text-ink-50">Change password</h3>
          <form onSubmit={pwForm.handleSubmit(onPassword)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Current password</label>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input type={showPw ? 'text' : 'password'} className="input pl-10 pr-10" {...pwForm.register('currentPassword', { required: 'Current password is required' })} />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pwForm.formState.errors.currentPassword && <p className="mt-1 text-xs text-rose-500">{pwForm.formState.errors.currentPassword.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-200">New password</label>
                <input type="password" className="input mt-1" {...pwForm.register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
                {pwForm.formState.errors.newPassword && <p className="mt-1 text-xs text-rose-500">{pwForm.formState.errors.newPassword.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Confirm</label>
                <input type="password" className="input mt-1" {...pwForm.register('confirm', { required: 'Please confirm', validate: (v) => v === newPassword || 'Passwords do not match' })} />
                {pwForm.formState.errors.confirm && <p className="mt-1 text-xs text-rose-500">{pwForm.formState.errors.confirm.message}</p>}
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={savingPw}>
              {savingPw ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
