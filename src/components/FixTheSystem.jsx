import { motion } from 'framer-motion'
import useStore from '../store/useStore'

const blocks = [
  { id: 0, label: 'Input Validation', icon: '🛡️', desc: 'Sanitize all inputs before processing' },
  { id: 1, label: 'Rate Limiting', icon: '⏱️', desc: 'Prevent abuse with request throttling' },
  { id: 2, label: 'Access Control', icon: '🔑', desc: 'Enforce least-privilege permissions' },
  { id: 3, label: 'Audit Logging', icon: '📋', desc: 'Record all actions for review' },
]

export default function FixTheSystem() {
  const fixedBlocks = useStore((s) => s.fixedBlocks)
  const incrementFixed = useStore((s) => s.incrementFixed)
  const resetFixed = useStore((s) => s.resetFixed)
  const toggleLLMRestricted = useStore((s) => s.toggleLLMRestricted)

  const handleFix = (index) => {
    if (index === fixedBlocks) {
      incrementFixed()
      if (index === 3) {
        // All fixed — restrict the LLM
        toggleLLMRestricted()
      }
    }
  }

  const allFixed = fixedBlocks >= 4

  return (
    <div className="mini-module fix-system">
      <div className="module-header">
        <span className="module-icon">🔧</span>
        <h4>Fix the System</h4>
      </div>
      <p className="module-desc">
        {allFixed
          ? 'System fully patched! The LLM boundary is now sealed.'
          : 'Apply security patches in order to seal the LLM boundary.'}
      </p>
      <div className="fix-progress">
        <div className="fix-bar">
          <motion.div
            className="fix-bar-fill"
            animate={{ width: `${(fixedBlocks / 4) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
        <span className="fix-count">{fixedBlocks}/4</span>
      </div>
      <div className="fix-blocks">
        {blocks.map((block) => {
          const isFixed = block.id < fixedBlocks
          const isNext = block.id === fixedBlocks
          return (
            <motion.button
              key={block.id}
              className={`fix-block ${isFixed ? 'fixed' : ''} ${isNext ? 'next' : ''}`}
              onClick={() => handleFix(block.id)}
              whileHover={isNext ? { scale: 1.03, x: 4 } : {}}
              whileTap={isNext ? { scale: 0.97 } : {}}
              disabled={isFixed || !isNext}
            >
              <span className="fix-icon">{block.icon}</span>
              <div className="fix-info">
                <span className="fix-label">{block.label}</span>
                <span className="fix-desc">{block.desc}</span>
              </div>
              <span className="fix-status">
                {isFixed ? '✓' : isNext ? '→' : '○'}
              </span>
            </motion.button>
          )
        })}
      </div>
      {allFixed && (
        <motion.div
          className="result-banner correct"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✓ All patches applied! Check the LLM scene — the boundary is now sealed.
        </motion.div>
      )}
      {allFixed && (
        <button className="reset-btn" onClick={() => { resetFixed(); toggleLLMRestricted() }}>
          Reset
        </button>
      )}
    </div>
  )
}
