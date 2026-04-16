import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import Experience from './components/Experience'
import Navbar from './ui/Navbar'
import ScrollProgress from './ui/ScrollProgress'
import ChecklistButton from './ui/ChecklistButton'
import Modal from './ui/Modal'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <ScrollProgress />

      <Canvas
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 200 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'fixed', inset: 0 }}
      >
        <color attach="background" args={['#050510']} />
        <ScrollControls pages={7} damping={0.25}>
          <Experience />
        </ScrollControls>
      </Canvas>

      <ChecklistButton />
      <Modal />
    </div>
  )
}
