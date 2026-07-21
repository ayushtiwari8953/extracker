import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message, confirmText = 'Confirm', variant = 'danger' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className={variant === 'danger' ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{confirmText}</button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-ink-600 dark:text-ink-300 pt-1.5">{message}</p>
      </div>
    </Modal>
  );
}
