import { useEffect, useRef, useState } from 'react'
import ControlPanel from './components/ControlPanel'
import Visualizer from './visualization/Visualizer'
import AudioEngine from './audio/AudioEngine'
import useAppStore from './state/useAppStore'
import { useGestures } from './hooks/useGestures'

function App() {
  const audioRef = useRef<AudioEngine | null>(null)
  const { mode, waveform, setWaveform, setFrequency, setQ, setGain, setAnalyserSmoothing, started, markStarted, markStopped } = useAppStore()
  const { initGestures, error: gestureError } = useGestures(audioRef)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    audioRef.current = new AudioEngine()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.setMode(mode)
    }
  }, [mode])

  const handleStart = async () => {
    if (!audioRef.current) return
    try {
      await audioRef.current.start()
      markStarted()
      await initGestures()
    } catch (e) {
      console.error('Failed to start:', e)
      alert('Error starting application. Check console.')
    }
  }

  const handleStop = async () => {
    if (!audioRef.current) return
    await audioRef.current.stop()
    markStopped()
  }

  const handleWaveformChange = (w: typeof waveform) => {
    setWaveform(w)
    audioRef.current?.setWaveform(w)
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
      {showSidebar ? (
        <div className="sidebar">
          <ControlPanel
            onStart={handleStart}
            onStop={handleStop}
            onClose={() => setShowSidebar(false)}
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
            {gestureError && <p className="error">{gestureError}</p>}
          </section>
        </div>
      ) : (
        <button
          className="btn"
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100, background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowSidebar(true)}
        >
          Show Controls
        </button>
      )}
      <div className="stage" aria-label="3D visualizer">
        <Visualizer audio={audioRef.current} running={started} />
      </div>
    </main>
  )
}

export default App
