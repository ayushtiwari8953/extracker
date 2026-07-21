// Lightweight validation helpers shared across forms.

export const required = (v) => (v === undefined || v === null || v === '' ? 'This field is required' : undefined);

export const email = (v) => {
  if (!v) return undefined;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v) ? undefined : 'Enter a valid email address';
};

export const minLen = (n) => (v) => {
  if (!v) return undefined;
  return String(v).length >= n ? undefined : `Must be at least ${n} characters`;
};

export const maxLen = (n) => (v) => {
  if (!v) return undefined;
  return String(v).length <= n ? undefined : `Must be at most ${n} characters`;
};

export const positiveNumber = (v) => {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  return !isNaN(n) && n > 0 ? undefined : 'Must be a positive number';
};

export const matches = (other, label = 'values') => (v) => {
  if (!v) return undefined;
  return v === other ? undefined : `${label} do not match`;
};

export function compose(...validators) {
  return (v) => {
    for (const fn of validators) {
      const res = fn(v);
      if (res) return res;
    }
    return undefined;
  };
}
