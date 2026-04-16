import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'

export default function ChecklistButton() {
  const checklistOpen = useStore((s) => s.checklistOpen)
  const toggleChecklist = useStore((s) => s.toggleChecklist)
  const safetyChecklist = useStore((s) => s.safetyChecklist)
  const toggleCheckItem = useStore((s) => s.toggleCheckItem)

  const doneCount = safetyChecklist.filter((i) => i.done).length

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="checklist-fab"
        onClick={toggleChecklist}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <span className="fab-icon">✓</span>
        {doneCount > 0 && (
          <span className="fab-badge">{doneCount}/{safetyChecklist.length}</span>
        )}
      </motion.button>

      {/* Checklist panel */}
      <AnimatePresence>
        {checklistOpen && (
          <motion.div
            className="checklist-panel glass-strong"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="checklist-header">
              <h3>Safety Checklist</h3>
              <span className="checklist-count">
                {doneCount}/{safetyChecklist.length}
              </span>
            </div>
            <div className="checklist-progress-bar">
              <motion.div
                className="checklist-progress-fill"
                animate={{ width: `${(doneCount / safetyChecklist.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
            <ul className="checklist-items">
              {safetyChecklist.map((item) => (
                <motion.li
                  key={item.id}
                  className={`checklist-item ${item.done ? 'done' : ''}`}
                  onClick={() => toggleCheckItem(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="check-box">{item.done ? '✓' : ''}</span>
                  <span className="check-label">{item.label}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
