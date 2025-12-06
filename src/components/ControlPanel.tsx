/* use context7 for React 18 component best practices and accessibility */
import React, { useState } from 'react'
import useAppStore, { Waveform } from '@/state/useAppStore'

interface ControlPanelProps {
  onStart: () => void
  onStop: () => void
  onClose: () => void
  onOpenGuide: () => void
  onWaveformChange: (waveform: Waveform) => void
  onFrequencyChange: (v: number) => void
  onDetuneChange: (v: number) => void
  onFilterTypeChange: (t: BiquadFilterType) => void
  onQChange: (v: number) => void
  onGainChange: (v: number) => void
  onSmoothingChange: (v: number) => void
  started: boolean
}

const waveforms: Waveform[] = ['sine', 'square', 'sawtooth', 'triangle']
const filterTypes: BiquadFilterType[] = ['lowpass', 'highpass', 'bandpass', 'notch', 'peaking']

export function ControlPanel({
  onStart,
  onStop,
  onClose,
  onOpenGuide,
  onWaveformChange,
  onFrequencyChange,
  onDetuneChange,
  onFilterTypeChange,
  onQChange,
  onGainChange,
  onSmoothingChange,
  started,
}: ControlPanelProps) {
  const { mode, setMode, waveform, frequency, detune, filterType, q, gain, analyserSmoothing } = useAppStore()

  return (
    <section className="panel" aria-label="Control panel">
      <header className="panel__header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="eyebrow">Circuit Modes</p>
          <h2>Control</h2>
        </div>
        <div className="controls" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn" onClick={onOpenGuide} aria-label="Open Guide">
            Help
          </button>
          <button className="btn" onClick={onClose}>
            Hide
          </button>
          {!started ? (
            <button className="btn primary" onClick={onStart}>
              Start Audio
            </button>
          ) : (
            <button className="btn" style={{ borderColor: '#ff4444', color: '#ff4444' }} onClick={onStop}>
              Stop Audio
            </button>
          )}
        </div>
      </header>

      <div className="grid" style={{ marginBottom: '32px' }}>
            <div>
              <label className="label" htmlFor="mode">
                Mode
              </label>
              <div className="pill-group" role="group" aria-label="Mode selector">
                {[0, 1, 2, 3, 4, 5].map((m) => (
                  <button
                    key={m}
                    className={mode === m ? 'pill pill--active' : 'pill'}
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                  >
                    {m + 1}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="label">Waveform</span>
              <div className="pill-group" role="group" aria-label="Waveform selector">
                {waveforms.map((w) => (
                  <button
                    key={w}
                    className={waveform === w ? 'pill pill--active' : 'pill'}
                    onClick={() => onWaveformChange(w)}
                    aria-pressed={waveform === w}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid two">
            <div className="slider">
              <label htmlFor="freq" className="label">
                Frequency {Math.round(frequency)} Hz
              </label>
              <input
                id="freq"
                type="range"
                min={40}
                max={6000}
                step={1}
                value={frequency}
                onChange={(e) => onFrequencyChange(Number(e.target.value))}
              />
            </div>

            <div className="slider">
              <label htmlFor="detune" className="label">
                Detune {detune} cents
              </label>
              <input
                id="detune"
                type="range"
                min={-100}
                max={100}
                step={1}
                value={detune}
                onChange={(e) => onDetuneChange(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="label" htmlFor="filterType">
                Filter Type
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => onFilterTypeChange(e.target.value as BiquadFilterType)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: '4px'
                }}
              >
                {filterTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="slider">
              <label htmlFor="q" className="label">
                Q {q.toFixed(2)}
              </label>
              <input id="q" type="range" min={0.2} max={20} step={0.1} value={q} onChange={(e) => onQChange(Number(e.target.value))} />
            </div>
          </div>

          <div className="grid two">
            <div className="slider">
              <label htmlFor="gain" className="label">
                Gain {gain.toFixed(2)}
              </label>
              <input
                id="gain"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={gain}
                onChange={(e) => onGainChange(Number(e.target.value))}
              />
            </div>
            <div className="slider">
              <label htmlFor="smooth" className="label">
                FFT Smoothing {analyserSmoothing.toFixed(2)}
              </label>
              <input
                id="smooth"
                type="range"
                min={0}
                max={0.99}
                step={0.01}
                value={analyserSmoothing}
                onChange={(e) => onSmoothingChange(Number(e.target.value))}
              />
        </div>
      </div>
    </section>
  )
}

export default ControlPanel
