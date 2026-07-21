import { classNames } from '../../utils/formatters';

export default function Button({ children, variant = 'primary', size, className, ...props }) {
  const variantClass = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
    danger: 'btn-danger',
  }[variant];
  return (
    <button className={classNames(variantClass, className)} {...props}>
      {children}
    </button>
  );
}
