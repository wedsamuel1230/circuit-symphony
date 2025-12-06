/* use context7 for Fourier series and waveform synthesis */
export interface Harmonic {
  ratio: number
  amplitude: number
  phase?: number
}

export function generateSine(frequency: number, length: number, sampleRate: number): Float32Array {
  const data = new Float32Array(length)
  const w = (2 * Math.PI * frequency) / sampleRate
  for (let i = 0; i < length; i++) {
    data[i] = Math.sin(w * i)
  }
  return data
}

export function generateSquare(frequency: number, length: number, sampleRate: number, harmonics = 15): Float32Array {
  const data = new Float32Array(length)
  const fundamental = (2 * Math.PI * frequency) / sampleRate
  for (let n = 1; n <= harmonics; n += 2) {
    const amp = 1 / n
    for (let i = 0; i < length; i++) {
      data[i] += amp * Math.sin(fundamental * n * i)
    }
  }
  return data
}

export function generateSawtooth(frequency: number, length: number, sampleRate: number, harmonics = 20): Float32Array {
  const data = new Float32Array(length)
  const fundamental = (2 * Math.PI * frequency) / sampleRate
  for (let n = 1; n <= harmonics; n++) {
    const amp = 1 / n
    for (let i = 0; i < length; i++) {
      data[i] += amp * Math.sin(fundamental * n * i)
    }
  }
  return data
}

export function generateTriangle(frequency: number, length: number, sampleRate: number, harmonics = 15): Float32Array {
  const data = new Float32Array(length)
  const fundamental = (2 * Math.PI * frequency) / sampleRate
  for (let k = 0, n = 1; k < harmonics; k++, n += 2) {
    const amp = Math.pow(-1, (n - 1) / 2) * (1 / (n * n))
    for (let i = 0; i < length; i++) {
      data[i] += amp * Math.sin(fundamental * n * i)
    }
  }
  return data
}

export function generateHarmonicSeries(
  baseFreq: number,
  length: number,
  sampleRate: number,
  components: Harmonic[],
): Float32Array {
  const data = new Float32Array(length)
  const norm = components.reduce((s, h) => s + Math.abs(h.amplitude), 0) || 1
  for (const h of components) {
    const w = (2 * Math.PI * baseFreq * h.ratio) / sampleRate
    const phase = h.phase ?? 0
    for (let i = 0; i < length; i++) {
      data[i] += (h.amplitude / norm) * Math.sin(w * i + phase)
    }
  }
  return data
}
