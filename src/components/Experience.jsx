import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Scroll } from '@react-three/drei'
import useStore from '../store/useStore'

// Scenes
import IntroScene from '../scenes/IntroScene'
import DataFlowScene from '../scenes/DataFlowScene'
import ChatSafetyScene from '../scenes/ChatSafetyScene'
import AgentRiskScene from '../scenes/AgentRiskScene'
import LocalLLMScene from '../scenes/LocalLLMScene'
import SandboxScene from '../scenes/SandboxScene'
import FinalScene from '../scenes/FinalScene'

// Mini modules (HTML overlay)
import SpotUnsafePrompt from './SpotUnsafePrompt'
import LockDownAgent from './LockDownAgent'
import FixTheSystem from './FixTheSystem'
import InfoPanel from '../ui/InfoPanel'

function CameraRig() {
  const scroll = useScroll()
  const setScrollProgress = useStore((s) => s.setScrollProgress)

  useFrame((state) => {
    const offset = scroll.offset
    setScrollProgress(offset)

    // Move camera along the z-axis — 7 scenes × 20 units = 140 total
    const targetZ = -offset * 140
    state.camera.position.z = targetZ + 10
    state.camera.position.x = Math.sin(offset * Math.PI * 0.5) * 0.3
    state.camera.position.y = Math.cos(offset * Math.PI * 0.3) * 0.2
  })

  return null
}

export default function Experience() {
  return (
    <>
      <CameraRig />

      {/* Global lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 5]} intensity={0.3} color="#6c7bff" />

      {/* Fog to hide distant scenes */}
      <fog attach="fog" args={['#050510', 5, 25]} />

      {/* 7 Scenes laid along Z-axis */}
      <IntroScene position={[0, 0, 0]} />
      <DataFlowScene position={[0, 0, -20]} />
      <ChatSafetyScene position={[0, 0, -40]} />
      <AgentRiskScene position={[0, 0, -60]} />
      <LocalLLMScene position={[0, 0, -80]} />
      <SandboxScene position={[0, 0, -100]} />
      <FinalScene position={[0, 0, -120]} />

      {/* HTML content overlays — each scene gets its own 100vh window */}
      <Scroll html style={{ width: '100%' }}>

        {/* Scene 1: Intro — bottom of first viewport */}
        <section className="scroll-section" style={{ top: '60vh' }}>
          <InfoPanel title="Why AI Safety Matters">
            <p>
              As AI systems become more powerful, ensuring they operate safely is critical.
              From data handling to agent permissions, every layer needs protection.
            </p>
            <p className="info-highlight">
              Scroll through this experience to learn about the key safety concepts
              that protect users and systems.
            </p>
          </InfoPanel>
        </section>

        {/* Scene 2: Data Flow */}
        <section className="scroll-section" style={{ top: '140vh' }}>
          <InfoPanel title="Data Flow & Validation" align="right">
            <p>
              <strong>Data poisoning</strong> occurs when malicious data enters a training pipeline.
              Always validate and sanitize inputs before processing.
            </p>
            <ul className="info-list">
              <li>Filter unsafe content at ingestion</li>
              <li>Validate data types and ranges</li>
              <li>Monitor for anomalous patterns</li>
            </ul>
          </InfoPanel>
        </section>

        {/* Scene 3: Chat Safety + mini-module */}
        <section className="scroll-section" style={{ top: '240vh' }}>
          <InfoPanel title="Prompt Safety">
            <p>
              AI assistants use safety filters, RLHF, and constitutional AI principles
              to refuse harmful requests while remaining helpful for legitimate ones.
            </p>
          </InfoPanel>
        </section>
        <section className="scroll-section scroll-section-center" style={{ top: '280vh' }}>
          <SpotUnsafePrompt />
        </section>

        {/* Scene 4: Agent Risk + mini-module */}
        <section className="scroll-section" style={{ top: '340vh' }}>
          <InfoPanel title="Agent Permissions" align="right">
            <p>
              AI agents that can access files, networks, and system commands
              must be restricted using the <strong>principle of least privilege</strong>.
            </p>
          </InfoPanel>
        </section>
        <section className="scroll-section scroll-section-center" style={{ top: '380vh' }}>
          <LockDownAgent />
        </section>

        {/* Scene 5: Local LLM + mini-module */}
        <section className="scroll-section" style={{ top: '440vh' }}>
          <InfoPanel title="Model Isolation">
            <p>
              Local LLMs process sensitive data. Without proper isolation,
              model outputs and data can <strong>leak beyond intended boundaries</strong>.
            </p>
            <ul className="info-list">
              <li>Restrict network access for local models</li>
              <li>Encrypt data at rest and in transit</li>
              <li>Use hardware-level isolation when possible</li>
            </ul>
          </InfoPanel>
        </section>
        <section className="scroll-section scroll-section-center" style={{ top: '480vh' }}>
          <FixTheSystem />
        </section>

        {/* Scene 6: Sandbox */}
        <section className="scroll-section" style={{ top: '550vh' }}>
          <InfoPanel title="Sandboxing & Containers" align="right">
            <p>
              VMs and containers create <strong>isolated execution environments</strong>.
              Even if AI code behaves unexpectedly, it can't escape the sandbox.
            </p>
            <ul className="info-list">
              <li>Resource limits prevent denial-of-service</li>
              <li>Network policies control data flow</li>
              <li>Read-only filesystems prevent persistence</li>
            </ul>
          </InfoPanel>
        </section>

        {/* Scene 7: Final */}
        <section className="scroll-section" style={{ top: '630vh' }}>
          <InfoPanel title="Key Takeaways" className="final-panel">
            <ul className="info-list final-list">
              <li>Validate all data inputs</li>
              <li>Filter unsafe prompts</li>
              <li>Restrict agent permissions</li>
              <li>Isolate local LLMs</li>
              <li>Run in sandboxed environments</li>
              <li>Enable audit trails</li>
            </ul>
            <p className="info-highlight">
              Open the checklist (bottom-right) to track your progress.
            </p>
          </InfoPanel>
        </section>
      </Scroll>
    </>
  )
}
