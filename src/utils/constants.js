// Centralized app constants and category definitions.

export const APP_NAME = 'FinTrack';
export const APP_TAGLINE = 'Spend smarter. Save more.';

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Bonus',
  'Other',
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping',
  'Rent',
  'Bills',
  'Travel',
  'Fuel',
  'Education',
  'Entertainment',
  'Healthcare',
  'Other',
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const CATEGORY_META = {
  Salary: { color: '#10b981', icon: 'briefcase' },
  Freelance: { color: '#06b6d4', icon: 'laptop' },
  Business: { color: '#3366ff', icon: 'store' },
  Investment: { color: '#8b5cf6', icon: 'trending-up' },
  Bonus: { color: '#f59e0b', icon: 'gift' },
  Other: { color: '#64748b', icon: 'plus' },
  Food: { color: '#f97316', icon: 'utensils' },
  Shopping: { color: '#ec4899', icon: 'shopping-bag' },
  Rent: { color: '#6366f1', icon: 'home' },
  Bills: { color: '#ef4444', icon: 'receipt' },
  Travel: { color: '#14b8a6', icon: 'plane' },
  Fuel: { color: '#a3a300', icon: 'fuel' },
  Education: { color: '#0ea5e9', icon: 'book-open' },
  Entertainment: { color: '#d946ef', icon: 'film' },
  Healthcare: { color: '#22c55e', icon: 'heart-pulse' },
};

export const CHART_PALETTE = [
  '#3366ff',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#ef4444',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#d946ef',
  '#64748b',
];

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;

export const STORAGE_KEYS = {
  USERS: 'fintrack.users',
  CURRENT_USER: 'fintrack.currentUser',
  TOKEN: 'fintrack.token',
  TRANSACTIONS: 'fintrack.transactions',
  BUDGETS: 'fintrack.budgets',
  SETTINGS: 'fintrack.settings',
  REMEMBER: 'fintrack.remember',
};

export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
};
