/* use context7 for Web Audio API 2024 BiquadFilterNode and Oscillator */
export class AudioEngine {
  private context: AudioContext
  private oscillator: OscillatorNode
  private oscillator2: OscillatorNode
  private osc2Gain: GainNode
  private filter: BiquadFilterNode
  private gain: GainNode
  private analyser: AnalyserNode
  private started = false
  private currentMode = 0

  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'interactive',
    })

    this.oscillator = this.context.createOscillator()
    this.oscillator2 = this.context.createOscillator()
    
    this.osc2Gain = this.context.createGain()
    this.osc2Gain.gain.value = 0 // Default off

    this.gain = this.context.createGain()
    this.filter = this.context.createBiquadFilter()
    this.analyser = this.context.createAnalyser()

    this.filter.type = 'lowpass'
    this.filter.frequency.value = 1200
    this.filter.Q.value = 1.2

    this.gain.gain.value = 0.35

    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.85

    // Signal path: Osc1 + (Osc2 -> Osc2Gain) -> Filter -> MasterGain -> Analyser -> Dest
    this.oscillator.connect(this.filter)
    this.oscillator2.connect(this.osc2Gain)
    this.osc2Gain.connect(this.filter)
    
    this.filter.connect(this.gain)
    this.gain.connect(this.analyser)
    this.analyser.connect(this.context.destination)

    this.oscillator.type = 'sine'
    this.oscillator2.type = 'sine'
    
    // Start oscillators immediately but context might be suspended or gain 0
    this.oscillator.start()
    this.oscillator2.start()
    this.context.suspend() // Start in suspended state
  }

  async start() {
    if (this.context.state === 'suspended') {
      await this.context.resume()
    }
    this.started = true
  }

  async stop() {
    if (this.context.state === 'running') {
      await this.context.suspend()
    }
    this.started = false
  }

  async ensureContext() {
    if (this.context.state !== 'running') {
      await this.context.resume()
    }
  }

  setMode(mode: number) {
    this.currentMode = mode
    const now = this.context.currentTime
    
    // Reset defaults
    this.osc2Gain.gain.setTargetAtTime(0, now, 0.02)
    
    switch (mode) {
      case 0: // Standard Lowpass
        this.filter.type = 'lowpass'
        break
      case 1: // Highpass
        this.filter.type = 'highpass'
        break
      case 2: // Bandpass
        this.filter.type = 'bandpass'
        break
      case 3: // Dual Osc (Detuned)
        this.filter.type = 'lowpass'
        this.osc2Gain.gain.setTargetAtTime(0.5, now, 0.02)
        this.oscillator2.detune.setTargetAtTime(15, now, 0.02) // Slight detune
        break
      case 4: // Notch
        this.filter.type = 'notch'
        break
      case 5: // Peaking
        this.filter.type = 'peaking'
        break
    }
  }

  setFrequency(value: number) {
    const v = Math.max(20, Math.min(18000, value))
    this.oscillator.frequency.setTargetAtTime(v, this.context.currentTime, 0.05)
    this.oscillator2.frequency.setTargetAtTime(v, this.context.currentTime, 0.05)
  }

  setQ(value: number) {
    const v = Math.max(0.1, Math.min(40, value))
    this.filter.Q.setTargetAtTime(v, this.context.currentTime, 0.05)
  }

  setGain(value: number) {
    const v = Math.max(0, Math.min(1, value))
    this.gain.gain.setTargetAtTime(v, this.context.currentTime, 0.02)
  }

  setWaveform(type: OscillatorType) {
    this.oscillator.type = type
    this.oscillator2.type = type
  }

  setCustomWaveform(real: number[], imag: number[]) {
    const wave = this.context.createPeriodicWave(new Float32Array(real), new Float32Array(imag), {
      disableNormalization: false,
    })
    this.oscillator.setPeriodicWave(wave)
    this.oscillator2.setPeriodicWave(wave)
  }

  setAnalyserSmoothing(value: number) {
    this.analyser.smoothingTimeConstant = Math.max(0, Math.min(0.99, value))
  }

  getFrequencyData(): Uint8Array {
    const bins = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(bins)
    return bins
  }

  getWaveformData(): Float32Array {
    const data = new Float32Array(this.analyser.fftSize)
    this.analyser.getFloatTimeDomainData(data)
    return data
  }

  getContext() {
    return this.context
  }
}

export default AudioEngine
