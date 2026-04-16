import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({
  count = 200,
  color = '#6c7bff',
  speed = 0.3,
  size = 0.04,
  bounds = 6,
  opacity = 0.8,
  shape = 'sphere',
}) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const pos = [
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds * 2,
      ]
      const vel = [
        (Math.random() - 0.5) * speed * 0.01,
        (Math.random() - 0.5) * speed * 0.01,
        (Math.random() - 0.5) * speed * 0.01,
      ]
      const phase = Math.random() * Math.PI * 2
      temp.push({ pos, vel, phase, scale: 0.5 + Math.random() * 0.5 })
    }
    return temp
  }, [count, bounds, speed])

  const geo = useMemo(() => {
    if (shape === 'box') return new THREE.BoxGeometry(size, size, size)
    return new THREE.SphereGeometry(size, 6, 6)
  }, [shape, size])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const p = particles[i]
      p.pos[0] += p.vel[0] + Math.sin(t * 0.5 + p.phase) * 0.001
      p.pos[1] += p.vel[1] + Math.cos(t * 0.3 + p.phase) * 0.001
      p.pos[2] += p.vel[2]

      // Wrap around bounds
      for (let axis = 0; axis < 3; axis++) {
        if (p.pos[axis] > bounds) p.pos[axis] = -bounds
        if (p.pos[axis] < -bounds) p.pos[axis] = bounds
      }

      dummy.position.set(p.pos[0], p.pos[1], p.pos[2])
      dummy.scale.setScalar(p.scale * (0.8 + Math.sin(t + p.phase) * 0.2))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geo, null, count]} frustumCulled={false}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </instancedMesh>
  )
}
