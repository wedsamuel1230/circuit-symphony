import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'custom'

export interface AppState {
  mode: number
  waveform: Waveform
  frequency: number
  detune: number
  filterType: BiquadFilterType
  q: number
  gain: number
  analyserSmoothing: number
  started: boolean
  setMode: (mode: number) => void
  setWaveform: (waveform: Waveform) => void
  setFrequency: (frequency: number) => void
  setDetune: (detune: number) => void
  setFilterType: (type: BiquadFilterType) => void
  setQ: (q: number) => void
  setGain: (gain: number) => void
  setAnalyserSmoothing: (value: number) => void
  markStarted: () => void
  markStopped: () => void
}

const useAppStore = create<AppState>()(
  devtools((set) => ({
    mode: 0,
    waveform: 'sine',
    frequency: 440,
    detune: 0,
    filterType: 'lowpass',
    q: 1.2,
    gain: 0.4,
    analyserSmoothing: 0.85,
    started: false,
    setMode: (mode) => set({ mode }),
    setWaveform: (waveform) => set({ waveform }),
    setFrequency: (frequency) => set({ frequency }),
    setDetune: (detune) => set({ detune }),
    setFilterType: (filterType) => set({ filterType }),
    setQ: (q) => set({ q }),
    setGain: (gain) => set({ gain }),
    setAnalyserSmoothing: (value) => set({ analyserSmoothing: value }),
    markStarted: () => set({ started: true }),
    markStopped: () => set({ started: false }),
  })),
)

export default useAppStore
