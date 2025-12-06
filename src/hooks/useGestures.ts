import { useEffect, useRef, useState } from 'react'
import HandDetector, { HandResultCallback } from '../gestures/HandDetector'
import ParameterMapper from '../gestures/ParameterMapper'
import AudioEngine from '../audio/AudioEngine'
import useAppStore from '../state/useAppStore'

function distance3D(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export function useGestures(audioRef: React.MutableRefObject<AudioEngine | null>) {
  const handRef = useRef<HandDetector | null>(null)
  const mapper = useRef(new ParameterMapper())
  const [error, setError] = useState<string | null>(null)
  const { setFrequency, setQ, setGain } = useAppStore()

  const initGestures = async () => {
    if (handRef.current) return

    try {
      handRef.current = new HandDetector({ maxHands: 2, minConfidence: 0.6 })
      await handRef.current.init((res) => {
        if (!audioRef.current) return
        if (!res.landmarks || res.landmarks.length === 0) return

        const first = res.landmarks[0]
        // Safe access for handedness
        const confidence = res.handedness[0]?.[0]?.score ?? 0.5
        
        const fingerSpread = distance3D(first[8], first[20])
        const handDistance = distance3D(first[0], first[8])
        
        const mapped = mapper.current.map(handDistance, fingerSpread, confidence)
        
        // Update State
        setFrequency(mapped.frequency)
        setQ(mapped.q)
        setGain(mapped.gain)
        
        // Update Audio Engine directly for low latency
        audioRef.current.setFrequency(mapped.frequency)
        audioRef.current.setQ(mapped.q)
        audioRef.current.setGain(mapped.gain)
      })
    } catch (e) {
      console.error('Gesture init failed', e)
      setError('Failed to initialize camera or gesture model.')
    }
  }

  useEffect(() => {
    return () => {
      handRef.current?.dispose()
    }
  }, [])

  return { initGestures, error }
}
