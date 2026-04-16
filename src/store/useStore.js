import { create } from 'zustand'

const useStore = create((set) => ({
  // Scroll state
  scrollProgress: 0,
  activeScene: 0,
  setScrollProgress: (p) => set({ scrollProgress: p, activeScene: Math.floor(p * 7) }),

  // UI state
  checklistOpen: false,
  toggleChecklist: () => set((s) => ({ checklistOpen: !s.checklistOpen })),
  setChecklistOpen: (v) => set({ checklistOpen: v }),

  // Modal
  modalContent: null,
  openModal: (content) => set({ modalContent: content }),
  closeModal: () => set({ modalContent: null }),

  // Agent Risk toggles (Lock Down Agent game)
  agentToggles: { fileAccess: true, network: true, commands: true },
  setAgentToggle: (key, value) =>
    set((s) => ({
      agentToggles: { ...s.agentToggles, [key]: value },
    })),

  // Fix The System game
  fixedBlocks: 0,
  incrementFixed: () => set((s) => ({ fixedBlocks: Math.min(s.fixedBlocks + 1, 4) })),
  resetFixed: () => set({ fixedBlocks: 0 }),

  // Spot Unsafe Prompt game
  promptGameDone: false,
  setPromptGameDone: () => set({ promptGameDone: true }),

  // LLM restriction toggle
  llmRestricted: false,
  toggleLLMRestricted: () => set((s) => ({ llmRestricted: !s.llmRestricted })),

  // Checklist items
  safetyChecklist: [
    { id: 'data', label: 'Validate data inputs', done: false },
    { id: 'prompt', label: 'Filter unsafe prompts', done: false },
    { id: 'agent', label: 'Restrict agent permissions', done: false },
    { id: 'llm', label: 'Isolate local LLMs', done: false },
    { id: 'sandbox', label: 'Run in sandboxed environments', done: false },
    { id: 'audit', label: 'Enable audit trails', done: false },
  ],
  toggleCheckItem: (id) =>
    set((s) => ({
      safetyChecklist: s.safetyChecklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    })),
}))

export default useStore
