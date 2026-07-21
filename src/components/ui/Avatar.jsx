import { classNames } from '../../utils/formatters';

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl',
};

export default function Avatar({ name = '', src, size = 'md', className }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <div className={classNames('relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 text-white font-semibold', sizes[size], textSizes[size], className)}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
}
