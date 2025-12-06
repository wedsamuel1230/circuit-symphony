/* use context7 for signal processing and smoothing algorithms */
import { clamp } from '@/utils/clamp'

export interface GestureParams {
  frequency: number
  q: number
  gain: number
}

export class ParameterMapper {
  private freqSmooth: number
  private qSmooth: number
  private gainSmooth: number
  private alpha: number

  constructor(alpha = 0.18) {
    this.alpha = alpha
    this.freqSmooth = 440
    this.qSmooth = 1.2
    this.gainSmooth = 0.4
  }

  map(handDistance: number, fingerSpread: number, confidence: number): GestureParams {
    if (confidence < 0.7) {
      return { frequency: this.freqSmooth, q: this.qSmooth, gain: this.gainSmooth }
    }

    const freq = this.logScale(handDistance, 0.05, 0.6, 80, 6000)
    const q = clamp(0.5 + fingerSpread * 10, 0.5, 20)
    const gain = clamp(0.25 + fingerSpread * 0.5, 0.05, 0.9)

    this.freqSmooth = this.smooth(this.freqSmooth, freq)
    this.qSmooth = this.smooth(this.qSmooth, q)
    this.gainSmooth = this.smooth(this.gainSmooth, gain)

    return { frequency: this.freqSmooth, q: this.qSmooth, gain: this.gainSmooth }
  }

  private logScale(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    const clamped = clamp(value, inMin, inMax)
    const norm = (clamped - inMin) / (inMax - inMin)
    const exp = Math.exp(norm * Math.log(outMax / outMin)) * outMin
    return exp
  }

  private smooth(prev: number, next: number) {
    return this.alpha * next + (1 - this.alpha) * prev
  }
}

export default ParameterMapper
