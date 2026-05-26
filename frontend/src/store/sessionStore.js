import { create } from 'zustand';

const useSessionStore = create((set) => ({
  sessionId: null,
  selectedStyle: null,
  currentStep: 1,
  angleHistory: [],
  scoreHistory: [],

  setSessionId: (id) => set({ sessionId: id }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setCurrentStep: (step) => set({ currentStep: step }),

  addAngleRecord: (record) => set((state) => ({
    angleHistory: [...state.angleHistory.slice(-19), record]
  })),

  addScoreRecord: (score) => set((state) => ({
    scoreHistory: [...state.scoreHistory, score]
  })),

  resetSession: () => set({
    sessionId: null,
    selectedStyle: null,
    currentStep: 1,
    angleHistory: [],
    scoreHistory: []
  })
}));

export default useSessionStore;
