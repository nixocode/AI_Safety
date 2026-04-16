import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../components/Particles'
import FloatingText from '../components/FloatingText'

function ConnectionLines({ nodes, maxDist = 2.5 }) {
  const ref = useRef()
  const lineGeo = useMemo(() => {
    const positions = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.sqrt(
          (nodes[i][0] - nodes[j][0]) ** 2 +
          (nodes[i][1] - nodes[j][1]) ** 2 +
          (nodes[i][2] - nodes[j][2]) ** 2
        )
        if (d < maxDist) {
          positions.push(nodes[i][0], nodes[i][1], nodes[i][2])
          positions.push(nodes[j][0], nodes[j][1], nodes[j][2])
        }
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [nodes, maxDist])

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <lineSegments ref={ref} geometry={lineGeo}>
      <lineBasicMaterial color="#6c7bff" transparent opacity={0.2} />
    </lineSegments>
  )
}

function NeuralNodes({ count = 100 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const nodes = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ])
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const n = nodes[i]
      dummy.position.set(
        n[0] + Math.sin(t * 0.3 + i) * 0.3,
        n[1] + Math.cos(t * 0.2 + i * 0.5) * 0.25,
        n[2] + Math.sin(t * 0.4 + i * 0.3) * 0.2
      )
      const s = 0.08 + Math.sin(t * 0.8 + i) * 0.03
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#8890ff" transparent opacity={0.9} toneMapped={false} />
      </instancedMesh>
      <ConnectionLines nodes={nodes} maxDist={2.8} />
    </>
  )
}

export default function IntroScene({ position = [0, 0, 0] }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group position={position}>
      <group ref={groupRef}>
        <NeuralNodes count={100} />
      </group>
      <Particles count={200} color="#6c7bff" bounds={8} size={0.025} opacity={0.5} speed={0.15} />

      <FloatingText
        position={[0, 3, 0]}
        fontSize={0.8}
        color="#e8eaff"
        floatAmount={0.15}
      >
        AI Safety Handbook
      </FloatingText>
      <FloatingText
        position={[0, 2, 0]}
        fontSize={0.25}
        color="#8888aa"
        floatAmount={0.1}
        floatSpeed={0.8}
      >
        Scroll to explore the system
      </FloatingText>

      {/* Ambient glow sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#6c7bff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
