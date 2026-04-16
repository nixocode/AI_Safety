# AI Safety Handbook — Interactive 3D Experience

An immersive, scroll-driven 3D website exploring AI safety concepts. Built as part of my portfolio on AI and web safety.

## Features

- **7 interactive 3D scenes** — Neural network intro, Data Flow, Chat Safety, Agent Risk, Local LLM Isolation, Sandboxing, and Summary
- **Scroll-driven camera** — Camera moves through scenes as you scroll, with fog transitions between each
- **3 mini interactive modules**:
  - **Spot the Unsafe Prompt** — Identify which AI prompt requests harmful content
  - **Lock Down the Agent** — Toggle file/network/command permissions to secure an AI agent
  - **Fix the System** — Apply security patches to seal the LLM boundary
- **Educational content panels** — Learn about data poisoning, prompt safety, agent permissions, model isolation, and sandboxing
- **Safety checklist tracker** — Track concepts learned through the experience
- **Responsive design** — Works on desktop and mobile

## Tech Stack

- **React 19** + **Vite 8**
- **Three.js** + **React Three Fiber** + **Drei** — 3D rendering
- **Framer Motion** — UI animations
- **GSAP** — Advanced animations
- **Zustand** — State management
- **TailwindCSS v4** — Utility styling

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run build
# Push the /dist folder to your gh-pages branch
npx gh-pages -d dist
```

## Project Structure

```
src/
├── App.jsx                    # Main app shell with Canvas + UI
├── main.jsx                   # Entry point
├── styles.css                 # Design system + component styles
├── store/useStore.js          # Zustand state management
├── hooks/useMousePosition.js  # Mouse tracking hook
├── components/
│   ├── Experience.jsx         # Master 3D orchestrator
│   ├── Particles.jsx          # Instanced particle system
│   ├── GlowMaterial.jsx       # Custom glow shader
│   ├── FloatingText.jsx       # Animated 3D text
│   ├── SpotUnsafePrompt.jsx   # Mini-module: prompt identification
│   ├── LockDownAgent.jsx      # Mini-module: permission toggles
│   └── FixTheSystem.jsx       # Mini-module: security patching
├── scenes/
│   ├── IntroScene.jsx         # Neural network space
│   ├── DataFlowScene.jsx      # Data pipeline visualization
│   ├── ChatSafetyScene.jsx    # Chat bubble safety
│   ├── AgentRiskScene.jsx     # Agent drone risk zone
│   ├── LocalLLMScene.jsx      # LLM boundary isolation
│   ├── SandboxScene.jsx       # VM/container sandbox
│   └── FinalScene.jsx         # Summary orb
└── ui/
    ├── Navbar.jsx             # Glassmorphic top bar
    ├── ScrollProgress.jsx     # Vertical progress indicator
    ├── ChecklistButton.jsx    # Floating checklist FAB
    ├── Modal.jsx              # Glassmorphic modal
    └── InfoPanel.jsx          # Educational content cards
```

## License

Portfolio project — © Nico
