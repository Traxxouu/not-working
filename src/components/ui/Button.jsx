export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-ink-900 text-white hover:bg-ink-800',
    secondary: 'bg-white text-ink-900 border border-ink-900/10 hover:bg-cream',
    ghost: 'bg-transparent text-ink-900 hover:bg-ink-900/5',
    accent: 'bg-primary-500 text-white hover:bg-primary-600',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }

  return (
    <button
      className={`inline-flex items-center gap-2 font-medium rounded-full transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}