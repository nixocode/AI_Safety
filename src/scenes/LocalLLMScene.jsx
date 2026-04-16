import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../components/Particles'
import FloatingText from '../components/FloatingText'
import useStore from '../store/useStore'

function BoundarySphere({ restricted }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
      ref.current.rotation.x = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[3, restricted ? 2 : 1]} />
      <meshBasicMaterial
        color={restricted ? '#00e5a0' : '#ff4466'}
        transparent
        opacity={restricted ? 0.15 : 0.08}
        wireframe
      />
    </mesh>
  )
}

function CoreModel() {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3
      ref.current.rotation.z = state.clock.elapsedTime * 0.1
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05
      ref.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.4} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.1} wireframe />
      </mesh>
    </group>
  )
}

function LeakParticles({ restricted }) {
  const meshRef = useRef()
  const count = 60
  const dummy = new THREE.Object3D()
  const velocities = useRef(
    Array.from({ length: count }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.random() * Math.PI,
      r: 1.5 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }))
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const v = velocities.current[i]
      const maxR = restricted ? 2.8 : v.r + Math.sin(t + v.offset) * 2
      const r = restricted
        ? 1.5 + Math.sin(t * v.speed + v.offset) * 1
        : maxR

      dummy.position.set(
        r * Math.sin(v.phi) * Math.cos(v.theta + t * 0.2),
        r * Math.cos(v.phi),
        r * Math.sin(v.phi) * Math.sin(v.theta + t * 0.2)
      )
      dummy.scale.setScalar(restricted ? 0.04 : 0.03 + Math.sin(t + i) * 0.015)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color={restricted ? '#00e5a0' : '#ff4466'}
        transparent
        opacity={0.7}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

export default function LocalLLMScene({ position = [0, 0, -80] }) {
  const restricted = useStore((s) => s.llmRestricted)

  return (
    <group position={position}>
      <CoreModel />
      <BoundarySphere restricted={restricted} />
      <LeakParticles restricted={restricted} />

      <Particles count={80} color="#c084fc" bounds={6} size={0.012} opacity={0.2} speed={0.08} />

      <FloatingText position={[0, 4.5, 0]} fontSize={0.5} color="#e8eaff">
        Local LLM Isolation
      </FloatingText>
      <FloatingText position={[0, 3.8, 0]} fontSize={0.18} color="#8888aa" floatAmount={0.08}>
        {restricted ? 'Model contained — boundary sealed' : 'Model leaking — data escaping boundary'}
      </FloatingText>
    </group>
  )
}
