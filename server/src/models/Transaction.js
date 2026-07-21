import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    amount: { type: Number, required: [true, 'Amount is required'], min: 0.01 },
    type: { type: String, enum: ['income', 'expense'], required: true, index: true },
    category: { type: String, required: [true, 'Category is required'], index: true },
    date: { type: Date, required: [true, 'Date is required'], index: true },
    notes: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1, category: 1 });

export default mongoose.model('Transaction', transactionSchema);
