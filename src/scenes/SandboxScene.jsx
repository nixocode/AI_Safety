import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../components/Particles'
import FloatingText from '../components/FloatingText'

function SandboxCube({ size, color, opacity, wireframe = false, rotationSpeed = 0.1 }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * rotationSpeed
      ref.current.rotation.x = state.clock.elapsedTime * rotationSpeed * 0.5
    }
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe={wireframe}
        side={wireframe ? THREE.FrontSide : THREE.DoubleSide}
      />
    </mesh>
  )
}

function BouncingParticles({ count = 40, bounds = 1.8 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: [
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds * 2,
      ],
      vel: [
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
      ],
    }))
  }, [count, bounds])

  useFrame(() => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      for (let axis = 0; axis < 3; axis++) {
        p.pos[axis] += p.vel[axis]
        if (Math.abs(p.pos[axis]) > bounds) {
          p.vel[axis] *= -1
          p.pos[axis] = Math.sign(p.pos[axis]) * bounds
        }
      }
      dummy.position.set(p.pos[0], p.pos[1], p.pos[2])
      dummy.scale.setScalar(0.05)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#00e5a0" transparent opacity={0.8} toneMapped={false} />
    </instancedMesh>
  )
}

export default function SandboxScene({ position = [0, 0, -100] }) {
  return (
    <group position={position}>
      {/* Inner VM cube */}
      <SandboxCube size={4} color="#00e5a0" opacity={0.06} wireframe={false} rotationSpeed={0.05} />
      <SandboxCube size={4} color="#00e5a0" opacity={0.12} wireframe={true} rotationSpeed={0.05} />

      {/* Outer host cube */}
      <SandboxCube size={7} color="#6c7bff" opacity={0.04} wireframe={true} rotationSpeed={0.02} />

      {/* Bouncing particles inside inner cube */}
      <BouncingParticles count={40} bounds={1.8} />

      <Particles count={60} color="#6c7bff" bounds={5} size={0.012} opacity={0.15} speed={0.05} />

      <FloatingText position={[0, 4.5, 0]} fontSize={0.5} color="#e8eaff">
        Sandboxed Environment
      </FloatingText>
      <FloatingText position={[0, 3.8, 0]} fontSize={0.18} color="#8888aa" floatAmount={0.08}>
        Particles stay contained within the VM boundary
      </FloatingText>

      {/* Corner markers */}
      {[[-2, -2, -2], [2, -2, -2], [-2, 2, -2], [2, 2, -2],
        [-2, -2, 2], [2, -2, 2], [-2, 2, 2], [2, 2, 2]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#00e5a0" transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
