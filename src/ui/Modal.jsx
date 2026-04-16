import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'

export default function Modal() {
  const content = useStore((s) => s.modalContent)
  const closeModal = useStore((s) => s.closeModal)

  return (
    <AnimatePresence>
      {content && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="modal-card glass-strong"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {content.icon && <div className="modal-icon">{content.icon}</div>}
            <h2 className="modal-title">{content.title}</h2>
            {content.subtitle && (
              <p className="modal-subtitle">{content.subtitle}</p>
            )}
            <div className="modal-body">
              {content.body}
            </div>
            {content.safe !== undefined && (
              <div className={`modal-verdict ${content.safe ? 'safe' : 'unsafe'}`}>
                {content.safe ? '✓ Safe' : '✗ Unsafe'}
              </div>
            )}
            <button className="modal-close" onClick={closeModal}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
