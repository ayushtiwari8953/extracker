import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Oops!</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-5">Try again</button>
      )}
    </div>
  );
}
