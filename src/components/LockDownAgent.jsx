import { motion } from 'framer-motion'
import useStore from '../store/useStore'

const toggles = [
  { key: 'fileAccess', label: 'File System Access', icon: '📁', desc: 'Read/write files on disk' },
  { key: 'network', label: 'Network Access', icon: '🌐', desc: 'Make external HTTP requests' },
  { key: 'commands', label: 'System Commands', icon: '⌨️', desc: 'Execute shell commands' },
]

export default function LockDownAgent() {
  const agentToggles = useStore((s) => s.agentToggles)
  const setAgentToggle = useStore((s) => s.setAgentToggle)

  const allRestricted = !agentToggles.fileAccess && !agentToggles.network && !agentToggles.commands
  const openCount = Object.values(agentToggles).filter(Boolean).length

  return (
    <div className="mini-module lock-agent">
      <div className="module-header">
        <span className="module-icon">🔒</span>
        <h4>Lock Down the Agent</h4>
      </div>
      <p className="module-desc">
        {allRestricted
          ? 'All permissions revoked — the agent is safely contained!'
          : `${openCount} permission${openCount > 1 ? 's' : ''} still open — restrict them all.`}
      </p>
      <div className="toggle-list">
        {toggles.map((t) => (
          <motion.div
            key={t.key}
            className={`toggle-row ${agentToggles[t.key] ? 'active' : 'restricted'}`}
            whileHover={{ x: 4 }}
          >
            <span className="toggle-icon">{t.icon}</span>
            <div className="toggle-info">
              <span className="toggle-label">{t.label}</span>
              <span className="toggle-desc">{t.desc}</span>
            </div>
            <button
              className={`toggle-switch ${agentToggles[t.key] ? 'on' : 'off'}`}
              onClick={() => setAgentToggle(t.key, !agentToggles[t.key])}
            >
              <motion.div
                className="toggle-thumb"
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </motion.div>
        ))}
      </div>
      {allRestricted && (
        <motion.div
          className="result-banner correct"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✓ Agent secured! The 3D scene should now look calm.
        </motion.div>
      )}
    </div>
  )
}
