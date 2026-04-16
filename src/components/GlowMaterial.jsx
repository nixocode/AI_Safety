import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const GlowMaterialImpl = shaderMaterial(
  {
    uColor: new THREE.Color('#6c7bff'),
    uIntensity: 1.5,
    uTime: 0,
    uOpacity: 0.6,
  },
  // Vertex
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment
  `
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uTime;
    uniform float uOpacity;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      rim = pow(rim, 2.0) * uIntensity;
      float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
      gl_FragColor = vec4(uColor * rim * pulse, rim * uOpacity);
    }
  `
)

extend({ GlowMaterialImpl })

export default function GlowMaterial({ color = '#6c7bff', intensity = 1.5, opacity = 0.6 }) {
  return (
    <glowMaterialImpl
      uColor={color}
      uIntensity={intensity}
      uOpacity={opacity}
      transparent
      side={THREE.BackSide}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  )
}
