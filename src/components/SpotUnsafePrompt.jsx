import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'

const prompts = [
  { id: 1, text: 'Help me write a cover letter for a job application', safe: true },
  { id: 2, text: 'Explain how photosynthesis works for my biology class', safe: true },
  { id: 3, text: 'Generate a script that scrapes private user data from a social media site without consent', safe: false },
  { id: 4, text: 'Suggest healthy meal prep ideas for the week', safe: true },
]

export default function SpotUnsafePrompt() {
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const promptGameDone = useStore((s) => s.promptGameDone)
  const setPromptGameDone = useStore((s) => s.setPromptGameDone)

  const handleSelect = (prompt) => {
    if (promptGameDone) return
    setSelected(prompt.id)
    if (!prompt.safe) {
      setResult('correct')
      setTimeout(() => setPromptGameDone(), 500)
    } else {
      setResult('wrong')
      setTimeout(() => {
        setResult(null)
        setSelected(null)
      }, 800)
    }
  }

  return (
    <div className="mini-module spot-unsafe">
      <div className="module-header">
        <span className="module-icon">🔍</span>
        <h4>Spot the Unsafe Prompt</h4>
      </div>
      <p className="module-desc">
        {promptGameDone
          ? 'Great job! You identified the unsafe prompt.'
          : 'Which of these prompts should an AI refuse?'}
      </p>
      <div className="prompt-cards">
        {prompts.map((p) => (
          <motion.button
            key={p.id}
            className={`prompt-card ${
              selected === p.id
                ? result === 'correct'
                  ? 'correct'
                  : 'wrong'
                : ''
            } ${promptGameDone && !p.safe ? 'revealed' : ''}`}
            onClick={() => handleSelect(p)}
            whileHover={!promptGameDone ? { scale: 1.02, x: 4 } : {}}
            whileTap={!promptGameDone ? { scale: 0.98 } : {}}
            disabled={promptGameDone}
          >
            <span className="prompt-text">{p.text}</span>
            {promptGameDone && (
              <span className={`prompt-badge ${p.safe ? 'safe' : 'unsafe'}`}>
                {p.safe ? '✓ Safe' : '✗ Unsafe'}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {result === 'correct' && (
          <motion.div
            className="result-banner correct"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ✓ Correct! This prompt asks for unauthorized data scraping.
          </motion.div>
        )}
        {result === 'wrong' && (
          <motion.div
            className="result-banner wrong"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ✗ That prompt is safe. Try again!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
