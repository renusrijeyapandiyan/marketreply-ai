import { classNames } from '../../utils/helpers.js'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
}

export default function Button({ variant = 'primary', className, children, ...props }) {
  return (
    <button className={classNames(variants[variant] || variants.primary, className)} {...props}>
      {children}
    </button>
  )
}
