import { motion } from 'framer-motion'

export default function InfoPanel({ title, children, align = 'left', className = '' }) {
  return (
    <motion.div
      className={`info-panel glass ${align === 'right' ? 'align-right' : ''} ${className}`}
      initial={{ opacity: 0, x: align === 'right' ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {title && <h3 className="info-panel-title">{title}</h3>}
      <div className="info-panel-content">
        {children}
      </div>
    </motion.div>
  )
}
