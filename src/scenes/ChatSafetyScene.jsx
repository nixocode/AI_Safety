import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../components/Particles'
import FloatingText from '../components/FloatingText'
import useStore from '../store/useStore'

const chatMessages = [
  { text: 'Summarize this article', safe: true, x: -3, y: 2 },
  { text: 'Help me with homework', safe: true, x: 2, y: 1.5 },
  { text: 'Write me malware code', safe: false, x: -1.5, y: -0.5 },
  { text: 'Explain quantum physics', safe: true, x: 3, y: -1 },
  { text: 'How to hack a server', safe: false, x: -2.5, y: -2 },
  { text: 'Draft a friendly email', safe: true, x: 1, y: 0.5 },
]

function ChatBubble({ msg, index }) {
  const ref = useRef()
  const openModal = useStore((s) => s.openModal)

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + index * 1.5) * 0.002
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.03
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    openModal({
      title: msg.safe ? 'Safe Prompt' : 'Unsafe Prompt',
      icon: msg.safe ? '✓' : '⚠',
      subtitle: `"${msg.text}"`,
      body: msg.safe
        ? 'This prompt is a normal, helpful request. AI assistants can safely respond to these types of queries without risk.'
        : 'This prompt asks for potentially harmful content. Responsible AI systems detect and refuse such requests, explaining why they cannot help with harmful activities.',
      safe: msg.safe,
    })
  }

  const color = msg.safe ? '#6c7bff' : '#ff4466'
  const glowColor = msg.safe ? '#6c7bff' : '#ff4466'

  return (
    <group ref={ref} position={[msg.x, msg.y, (Math.random() - 0.5) * 2]} onClick={handleClick}>
      {/* Bubble body */}
      <mesh>
        <boxGeometry args={[2.2, 0.6, 0.15]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      {/* Border glow */}
      <mesh>
        <boxGeometry args={[2.3, 0.7, 0.12]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.06} />
      </mesh>
      {/* Indicator dot */}
      <mesh position={[-0.9, 0, 0.1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function ChatSafetyScene({ position = [0, 0, -40] }) {
  return (
    <group position={position}>
      {chatMessages.map((msg, i) => (
        <ChatBubble key={i} msg={msg} index={i} />
      ))}

      <Particles count={80} color="#6c7bff" bounds={6} size={0.015} opacity={0.2} speed={0.08} />

      <FloatingText position={[0, 4.5, 0]} fontSize={0.5} color="#e8eaff">
        Chat Safety
      </FloatingText>
      <FloatingText position={[0, 3.8, 0]} fontSize={0.18} color="#8888aa" floatAmount={0.08}>
        Click bubbles to inspect — can you spot the unsafe ones?
      </FloatingText>

      {/* Central shield */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#6c7bff" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}
