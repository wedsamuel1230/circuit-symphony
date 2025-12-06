import { useEffect, useMemo, useRef } from 'react'
import ControlPanel from './components/ControlPanel'
import Visualizer from './visualization/Visualizer'
import AudioEngine from './audio/AudioEngine'
import HandDetector from './gestures/HandDetector'
import ParameterMapper from './gestures/ParameterMapper'
import useAppStore from './state/useAppStore'

function distance3D(a: number[], b: number[]) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  const dz = a[2] - b[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function App() {
  const audioRef = useRef<AudioEngine | null>(null)
  const handRef = useRef<HandDetector | null>(null)
  const mapper = useMemo(() => new ParameterMapper(), [])

  const { waveform, setWaveform, setFrequency, setQ, setGain, setAnalyserSmoothing, analyserSmoothing, started, markStarted } =
    useAppStore()

  useEffect(() => {
    audioRef.current = new AudioEngine()
    return () => {
      handRef.current?.dispose()
    }
  }, [])

  const handleStart = async () => {
    if (!audioRef.current) return
    await audioRef.current.start()
    markStarted()
    if (!handRef.current) {
      handRef.current = new HandDetector({ maxHands: 2, minConfidence: 0.6 })
      handRef.current.init((res) => {
        if (!audioRef.current) return
        if (!res.landmarks || res.landmarks.length === 0) return
        const first = res.landmarks[0]
        const confidence = res.handedness[0]?.score ?? 0.5
        const fingerSpread = distance3D(first[8], first[20])
        const handDistance = distance3D(first[0], first[8])
        const mapped = mapper.map(handDistance, fingerSpread, confidence)
        setFrequency(mapped.frequency)
        setQ(mapped.q)
        setGain(mapped.gain)
        audioRef.current.setFrequency(mapped.frequency)
        audioRef.current.setQ(mapped.q)
        audioRef.current.setGain(mapped.gain)
      })
    }
  }

  const handleWaveformChange = (w: typeof waveform) => {
    setWaveform(w)
    if (!audioRef.current) return
    audioRef.current.setWaveform(w)
  }

  const handleFrequencyChange = (v: number) => {
    setFrequency(v)
    audioRef.current?.setFrequency(v)
  }

  const handleQChange = (v: number) => {
    setQ(v)
    audioRef.current?.setQ(v)
  }

  const handleGainChange = (v: number) => {
    setGain(v)
    audioRef.current?.setGain(v)
  }

  const handleSmoothing = (v: number) => {
    setAnalyserSmoothing(v)
    audioRef.current?.setAnalyserSmoothing(v)
  }

  return (
    <main className="layout">
      <div className="sidebar">
        <ControlPanel
          onStart={handleStart}
          onWaveformChange={handleWaveformChange}
          onFrequencyChange={handleFrequencyChange}
          onQChange={handleQChange}
          onGainChange={handleGainChange}
          onSmoothingChange={handleSmoothing}
          started={started}
        />
        <section className="note">
          <h3>Gestures</h3>
          <p>Use your webcam (HTTPS required). Spread fingers to boost gain/Q; move hand closer/farther to sweep frequency.</p>
        </section>
      </div>
      <div className="stage" aria-label="3D visualizer">
        <Visualizer audio={audioRef.current} running={started} />
      </div>
    </main>
  )
}

export default App
