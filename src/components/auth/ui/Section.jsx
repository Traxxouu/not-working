export const Section = ({ children, className = '', dark = false }) => (
  <section className={`py-20 md:py-32 ${dark ? 'bg-ink-900 text-white' : 'bg-white'} ${className}`}>
    {children}
  </section>
)