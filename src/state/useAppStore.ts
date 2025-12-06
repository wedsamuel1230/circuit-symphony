import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'custom'

export interface AppState {
  mode: number
  waveform: Waveform
  frequency: number
  q: number
  gain: number
  analyserSmoothing: number
  started: boolean
  setMode: (mode: number) => void
  setWaveform: (waveform: Waveform) => void
  setFrequency: (frequency: number) => void
  setQ: (q: number) => void
  setGain: (gain: number) => void
  setAnalyserSmoothing: (value: number) => void
  markStarted: () => void
}

const useAppStore = create<AppState>()(
  devtools((set) => ({
    mode: 0,
    waveform: 'sine',
    frequency: 440,
    q: 1.2,
    gain: 0.4,
    analyserSmoothing: 0.85,
    started: false,
    setMode: (mode) => set({ mode }),
    setWaveform: (waveform) => set({ waveform }),
    setFrequency: (frequency) => set({ frequency }),
    setQ: (q) => set({ q }),
    setGain: (gain) => set({ gain }),
    setAnalyserSmoothing: (value) => set({ analyserSmoothing: value }),
    markStarted: () => set({ started: true }),
  })),
)

export default useAppStore
