import { motion } from 'framer-motion'
import useStore from '../store/useStore'

const scenes = [
  { id: 0, label: 'Intro' },
  { id: 1, label: 'Data Flow' },
  { id: 2, label: 'Chat Safety' },
  { id: 3, label: 'Agent Risk' },
  { id: 4, label: 'Local LLM' },
  { id: 5, label: 'Sandbox' },
  { id: 6, label: 'Summary' },
]

export default function Navbar() {
  const activeScene = useStore((s) => s.activeScene)

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
    >
      <div className="navbar-logo">
        <img src="./logo.png" alt="AI Safety" className="logo-img" />
        <span className="logo-text">AI Safety</span>
      </div>

      <div className="navbar-dots">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className={`nav-dot ${activeScene === scene.id ? 'active' : ''}`}
            title={scene.label}
          >
            <span className="dot-pip" />
            {activeScene === scene.id && (
              <motion.span
                className="dot-label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {scene.label}
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </motion.nav>
  )
}
