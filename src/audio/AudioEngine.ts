/* use context7 for Web Audio API 2024 BiquadFilterNode and Oscillator */
export class AudioEngine {
  private context: AudioContext
  private oscillator: OscillatorNode
  private filter: BiquadFilterNode
  private gain: GainNode
  private analyser: AnalyserNode
  private started = false

  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'interactive',
    })

    this.oscillator = this.context.createOscillator()
    this.gain = this.context.createGain()
    this.filter = this.context.createBiquadFilter()
    this.analyser = this.context.createAnalyser()

    this.filter.type = 'lowpass'
    this.filter.frequency.value = 1200
    this.filter.Q.value = 1.2

    this.gain.gain.value = 0.35

    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.85

    this.oscillator.connect(this.filter)
    this.filter.connect(this.gain)
    this.gain.connect(this.analyser)
    this.analyser.connect(this.context.destination)

    this.oscillator.type = 'sine'
  }

  async start() {
    if (this.started) return
    await this.ensureContext()
    this.oscillator.start()
    this.started = true
  }

  async ensureContext() {
    if (this.context.state !== 'running') {
      await this.context.resume()
    }
  }

  setFrequency(value: number) {
    const v = Math.max(20, Math.min(18000, value))
    this.oscillator.frequency.setTargetAtTime(v, this.context.currentTime, 0.05)
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
  }

  setCustomWaveform(real: number[], imag: number[]) {
    const wave = this.context.createPeriodicWave(new Float32Array(real), new Float32Array(imag), {
      disableNormalization: false,
    })
    this.oscillator.setPeriodicWave(wave)
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
