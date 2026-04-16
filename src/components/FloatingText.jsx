import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export default function FloatingText({
  children,
  position = [0, 0, 0],
  fontSize = 0.5,
  color = '#e8eaff',
  floatSpeed = 1,
  floatAmount = 0.3,
  anchorX = 'center',
  anchorY = 'middle',
  maxWidth = 10,
  ...props
}) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmount
  })

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
      {...props}
    >
      {children}
    </Text>
  )
}
