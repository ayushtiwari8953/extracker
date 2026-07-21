import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { classNames } from '../../utils/formatters';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={classNames('relative w-full card animate-scale-in rounded-b-none sm:rounded-2xl max-h-[92vh] flex flex-col', sizes[size])}>
        {title && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-ink-200/70 dark:border-ink-800/70">
            <h3 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">{title}</h3>
            <button onClick={onClose} className="btn-ghost !p-2 -mr-2 rounded-lg" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="px-5 py-4 overflow-y-auto scrollbar-thin">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-ink-200/70 dark:border-ink-800/70 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
