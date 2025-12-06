import React from 'react'

interface GuideModalProps {
  onClose: () => void
}

export function GuideModal({ onClose }: GuideModalProps) {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #333',
        color: '#e0e0e0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#fff' }}>Audio Synthesis Guide</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ×
          </button>
        </header>

        <div className="guide-section">
          <h3 style={{ color: '#7ae6ff' }}>Waveforms</h3>
          <p>The shape of the sound wave determines its <strong>timbre</strong> or "color".</p>
          <ul style={{ lineHeight: '1.6' }}>
            <li><strong>Sine:</strong> Pure, smooth, fundamental tone. No overtones.</li>
            <li><strong>Square:</strong> Hollow, woody sound. Contains odd harmonics. Used in old video games.</li>
            <li><strong>Sawtooth:</strong> Bright, buzzy, sharp. Contains all harmonics. Common in subtractive synthesis.</li>
            <li><strong>Triangle:</strong> Mellow, flute-like. Like a sine wave but with a few odd harmonics.</li>
          </ul>
        </div>

        <div className="guide-section" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#ff7a7a' }}>Filter Types</h3>
          <p>Filters shape the sound by removing certain frequencies.</p>
          <ul style={{ lineHeight: '1.6' }}>
            <li><strong>Lowpass:</strong> Allows low frequencies to pass, cuts highs. Makes sound "muffled".</li>
            <li><strong>Highpass:</strong> Allows high frequencies to pass, cuts lows. Makes sound "thin".</li>
            <li><strong>Bandpass:</strong> Allows a narrow band of frequencies. Like a telephone or radio.</li>
            <li><strong>Notch:</strong> Removes a narrow band. Hard to hear unless swept.</li>
            <li><strong>Peaking:</strong> Boosts a specific frequency band.</li>
          </ul>
        </div>

        <div className="guide-section" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#d47aff' }}>Detune</h3>
          <p>Fine-tunes the pitch in cents (1/100th of a semitone). In "Dual Osc" mode, detuning creates a thick, swirling "chorus" effect by beating two oscillators against each other.</p>
        </div>

        <div className="guide-section" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#ff7a7a' }}>Frequency (Hz)</h3>
          <p>Determines the <strong>pitch</strong> of the sound. Higher frequency means higher pitch.</p>
          <p><em>Try moving your hand closer/further in gesture mode to sweep the frequency!</em></p>
        </div>

        <div className="guide-section" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#7aff7a' }}>Q Factor (Resonance)</h3>
          <p>Controls the bandwidth of the filter. A high Q factor creates a sharp, resonant peak at the cutoff frequency, often resulting in a "whistling" or "squelchy" sound.</p>
        </div>

        <div className="guide-section" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#ffff7a' }}>Gain</h3>
          <p>The amplitude or volume of the signal. In some circuits, high gain can drive the signal into distortion/saturation.</p>
        </div>

        <div className="guide-section" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#d47aff' }}>FFT Smoothing</h3>
          <p>Controls how quickly the visualizer reacts to sound changes. Lower values make it twitchy and fast; higher values make it smooth and slow.</p>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button 
            onClick={onClose}
            className="btn primary"
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
