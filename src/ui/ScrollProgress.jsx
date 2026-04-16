import { motion } from 'framer-motion'
import useStore from '../store/useStore'

export default function ScrollProgress() {
  const progress = useStore((s) => s.scrollProgress)

  return (
    <div className="scroll-progress-track">
      <motion.div
        className="scroll-progress-fill"
        style={{ scaleY: progress }}
      />
      <div
        className="scroll-progress-thumb"
        style={{ top: `${progress * 100}%` }}
      />
    </div>
  )
}
