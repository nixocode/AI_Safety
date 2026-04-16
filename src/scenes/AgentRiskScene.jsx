import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../components/Particles'
import FloatingText from '../components/FloatingText'
import useStore from '../store/useStore'

function FileBlock({ position, index }) {
  const ref = useRef()
  const agentToggles = useStore((s) => s.agentToggles)
  const allRestricted = !agentToggles.fileAccess && !agentToggles.network && !agentToggles.commands
  const anyOpen = agentToggles.fileAccess || agentToggles.network || agentToggles.commands

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    if (anyOpen) {
      // Chaotic movement when unrestricted
      ref.current.position.x = position[0] + Math.sin(t * 2 + index * 3) * 0.8
      ref.current.position.y = position[1] + Math.cos(t * 1.5 + index * 2) * 0.6
      ref.current.rotation.x = t * 0.5 + index
      ref.current.rotation.z = t * 0.3 + index
    } else {
      // Orderly when restricted
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0], 0.05)
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1], 0.05)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.05)
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.05)
    }
  })

  const color = allRestricted ? '#00e5a0' : anyOpen ? '#ff4466' : '#ffaa33'

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  )
}

function AgentDrone() {
  const ref = useRef()
  const agentToggles = useStore((s) => s.agentToggles)
  const anyOpen = agentToggles.fileAccess || agentToggles.network || agentToggles.commands

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    if (anyOpen) {
      ref.current.position.x = Math.sin(t * 1.5) * 3
      ref.current.position.y = Math.cos(t * 1.2) * 2
      ref.current.position.z = Math.sin(t * 0.8) * 1.5
    } else {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, 0, 0.03)
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0, 0.03)
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, 0, 0.03)
    }
    ref.current.rotation.y = t * 0.5
  })

  const color = anyOpen ? '#ff4466' : '#00e5a0'

  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function AgentRiskScene({ position = [0, 0, -60] }) {
  const agentToggles = useStore((s) => s.agentToggles)
  const anyOpen = agentToggles.fileAccess || agentToggles.network || agentToggles.commands

  const blocks = useMemo(() => {
    const arr = []
    for (let i = 0; i < 12; i++) {
      arr.push([
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
      ])
    }
    return arr
  }, [])

  return (
    <group position={position}>
      <AgentDrone />

      {blocks.map((pos, i) => (
        <FileBlock key={i} position={pos} index={i} />
      ))}

      <Particles
        count={150}
        color={anyOpen ? '#ff4466' : '#00e5a0'}
        bounds={5}
        size={0.02}
        opacity={0.35}
        speed={anyOpen ? 0.5 : 0.1}
      />

      <FloatingText position={[0, 4.5, 0]} fontSize={0.5} color="#e8eaff">
        Agent Risk Zone
      </FloatingText>
      <FloatingText position={[0, 3.8, 0]} fontSize={0.18} color="#8888aa" floatAmount={0.08}>
        {anyOpen ? 'Unrestricted agent — chaotic access!' : 'All permissions locked — system secure'}
      </FloatingText>

      {/* Boundary sphere */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color={anyOpen ? '#ff4466' : '#00e5a0'}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          wireframe
        />
      </mesh>
    </group>
  )
}
