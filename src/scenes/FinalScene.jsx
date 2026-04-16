import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../components/Particles'
import FloatingText from '../components/FloatingText'

function CentralOrb() {
  const ref = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      ref.current.scale.setScalar(s)
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02
    }
  })

  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial color="#6c7bff" transparent opacity={0.25} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#6c7bff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

export default function FinalScene({ position = [0, 0, -120] }) {
  return (
    <group position={position}>
      <CentralOrb />

      <Particles count={200} color="#6c7bff" bounds={8} size={0.02} opacity={0.3} speed={0.08} />
      <Particles count={100} color="#00e5a0" bounds={10} size={0.015} opacity={0.2} speed={0.05} />

      <FloatingText position={[0, 4, 0]} fontSize={0.55} color="#e8eaff" floatAmount={0.12}>
        Powerful systems require control
      </FloatingText>
      <FloatingText position={[0, 3, 0]} fontSize={0.2} color="#8888aa" floatAmount={0.08}>
        AI Safety is not optional — it's foundational
      </FloatingText>

      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.01, 8, 64]} />
        <meshBasicMaterial color="#6c7bff" transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[5, 0.01, 8, 64]} />
        <meshBasicMaterial color="#00e5a0" transparent opacity={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 4, -Math.PI / 3, 0]}>
        <torusGeometry args={[6, 0.01, 8, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.08} />
      </mesh>
    </group>
  )
}
