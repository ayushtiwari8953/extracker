import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function TransactionFormModal({ open, onClose, transaction, onSaved }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const isEdit = !!transaction;
  const {
    register, handleSubmit, reset, watch, formState: { errors },
  } = useForm({
    defaultValues: {
      title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0, 10), notes: '',
    },
  });
  const type = watch('type');

  useEffect(() => {
    if (open) {
      reset(
        transaction
          ? {
              title: transaction.title,
              amount: transaction.amount,
              type: transaction.type,
              category: transaction.category,
              date: transaction.date.slice(0, 10),
              notes: transaction.notes || '',
            }
          : { title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0, 10), notes: '' }
      );
    }
  }, [open, transaction, reset]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEdit) {
        await api.updateTransaction(user.id, transaction.id, data);
        toast.success('Transaction updated');
      } else {
        await api.createTransaction(user.id, data);
        toast.success('Transaction added');
      }
      onSaved?.();
      onClose();
    } catch (e) {
      toast.error(e.message || 'Could not save transaction');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction' : 'Add Transaction'}
      footer={
        <>
          <button className="btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit(onSubmit)} disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add transaction'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center justify-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 text-sm font-medium cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 dark:border-ink-700 dark:has-[:checked]:bg-brand-900/30">
            <input type="radio" value="expense" {...register('type')} className="sr-only" />
            <span className={type === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-ink-500'}>Expense</span>
          </label>
          <label className="flex items-center justify-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 text-sm font-medium cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 dark:border-ink-700 dark:has-[:checked]:bg-brand-900/30">
            <input type="radio" value="income" {...register('type')} className="sr-only" />
            <span className={type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-500'}>Income</span>
          </label>
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Title</label>
          <input className="input mt-1" placeholder="e.g. Grocery run" {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Amount</label>
            <input type="number" step="0.01" min="0" className="input mt-1" placeholder="0.00" {...register('amount', { required: 'Amount is required', min: 0.01 })} />
            {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Date</label>
            <input type="date" className="input mt-1" {...register('date', { required: 'Date is required' })} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Category</label>
          <select className="input mt-1" {...register('category', { required: true })}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Notes <span className="text-ink-400">(optional)</span></label>
          <textarea rows={2} className="input mt-1 resize-none" placeholder="Any extra details…" {...register('notes')} />
        </div>
      </form>
    </Modal>
  );
}
