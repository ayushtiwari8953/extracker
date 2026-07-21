import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';

const features = [
  { icon: TrendingUp, title: 'Track income & expenses', desc: 'Log every transaction in seconds with smart categories.' },
  { icon: PieChart, title: 'Beautiful analytics', desc: 'Pie, doughnut, line and bar charts that make sense of your money.' },
  { icon: ShieldCheck, title: 'Secure by default', desc: 'JWT auth, hashed passwords and protected routes out of the box.' },
];

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 p-12 text-white">
        <div className="absolute inset-0 bg-grid-dark bg-[size:32px_32px] opacity-30" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-extrabold">{APP_NAME}</span>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight">{APP_TAGLINE}</h2>
          <p className="mt-3 text-brand-100/90">
            The modern way to manage personal finances — track spending, set budgets and uncover insights with gorgeous analytics.
          </p>
          <ul className="mt-8 space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-brand-100/80">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-brand-100/70">© {new Date().getFullYear()} {APP_NAME}. Built with the MERN stack.</p>
      </div>

      {/* Right form panel */}
      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-extrabold text-ink-900 dark:text-white">{APP_NAME}</span>
          </div>
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthSwitchLink({ to, text, linkText }) {
  return (
    <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
      {text}{' '}
      <Link to={to} className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
        {linkText}
      </Link>
    </p>
  );
}
