import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../components/Particles'
import FloatingText from '../components/FloatingText'

function DataTube({ start, end, color = '#6c7bff', radius = 0.08 }) {
  const curve = useMemo(() => {
    const mid = [
      (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 2,
      (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 2,
      (start[2] + end[2]) / 2,
    ]
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ])
  }, [start, end])

  return (
    <mesh>
      <tubeGeometry args={[curve, 32, radius, 8, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  )
}

function FlowingParticles({ curve, count = 30, color = '#00e5a0', speed = 0.4 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const offsets = useMemo(() =>
    Array.from({ length: count }, () => Math.random()), [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const progress = ((offsets[i] + t * speed * 0.1) % 1)
      const point = curve.getPoint(progress)
      dummy.position.copy(point)
      dummy.scale.setScalar(0.03 + Math.sin(t * 2 + i) * 0.01)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
    </instancedMesh>
  )
}

export default function DataFlowScene({ position = [0, 0, -20] }) {
  const tubes = useMemo(() => [
    { start: [-5, 2, 0], end: [5, 1, 0], color: '#6c7bff' },
    { start: [-5, 0, 1], end: [5, -1, -1], color: '#6c7bff' },
    { start: [-5, -2, -1], end: [5, -2, 1], color: '#ff4466' },
    { start: [-4, 3, 2], end: [4, 0, -2], color: '#6c7bff' },
    { start: [-4, -3, -2], end: [4, 1, 2], color: '#6c7bff' },
  ], [])

  const curves = useMemo(() => tubes.map(t => {
    const mid = [
      (t.start[0] + t.end[0]) / 2 + (Math.random() - 0.5) * 2,
      (t.start[1] + t.end[1]) / 2 + (Math.random() - 0.5) * 2,
      (t.start[2] + t.end[2]) / 2,
    ]
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...t.start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...t.end),
    ])
  }), [tubes])

  return (
    <group position={position}>
      {tubes.map((tube, i) => (
        <DataTube key={i} start={tube.start} end={tube.end} color={tube.color} />
      ))}
      {curves.map((curve, i) => (
        <FlowingParticles
          key={`flow-${i}`}
          curve={curve}
          count={20}
          color={tubes[i].color === '#ff4466' ? '#ff4466' : '#00e5a0'}
          speed={0.3 + Math.random() * 0.3}
        />
      ))}

      <Particles count={100} color="#6c7bff" bounds={7} size={0.015} opacity={0.25} speed={0.1} />

      <FloatingText position={[0, 4.5, 0]} fontSize={0.5} color="#e8eaff">
        Data Flow
      </FloatingText>
      <FloatingText position={[0, 3.8, 0]} fontSize={0.18} color="#8888aa" floatAmount={0.08}>
        Not all data is safe — watch for red streams
      </FloatingText>

      {/* Warning indicator for unsafe pipe */}
      <mesh position={[0, -2.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ff4466" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, -2.5, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ff4466" transparent opacity={0.15} toneMapped={false} />
      </mesh>
    </group>
  )
}
