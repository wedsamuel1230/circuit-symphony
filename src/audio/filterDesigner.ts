/* use context7 for digital filter design and bilinear transformation */
export interface FilterCoefficients {
  b: [number, number, number]
  a: [number, number, number]
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

/**
 * First-order RC low-pass (continuous) mapped to digital via bilinear transform.
 */
export function designRcLowpass(fc: number, fs: number): FilterCoefficients {
  const T = 1 / fs
  const wc = 2 * Math.PI * fc
  const alpha = wc * T
  const b0 = alpha / (2 + alpha)
  const b1 = b0
  const a1 = (alpha - 2) / (alpha + 2)
  return { b: [b0, b1, 0], a: [1, a1, 0] }
}

/**
 * Second-order RLC band-pass using bilinear transform with given quality factor Q.
 */
export function designRlcBandpass(fc: number, q: number, fs: number): FilterCoefficients {
  const T = 1 / fs
  const wc = 2 * Math.PI * clamp(fc, 10, fs / 2 - 100)
  const K = wc * T
  const K2 = K * K
  const denom = 4 * q + 2 * K + K2 * q
  const b0 = 2 * K
  const b1 = 0
  const b2 = -2 * K
  const a0 = denom
  const a1 = 2 * K2 * q - 8 * q
  const a2 = 4 * q - 2 * K + K2 * q
  return {
    b: [b0 / a0, b1 / a0, b2 / a0],
    a: [1, a1 / a0, a2 / a0],
  }
}

/**
 * Butterworth low-pass biquad (order 2) using bilinear transform.
 */
export function designButterworthLowpass(fc: number, fs: number): FilterCoefficients {
  const warped = Math.tan(Math.PI * fc / fs)
  const c = 1 + Math.SQRT2 * warped + warped * warped
  const b0 = warped * warped / c
  const b1 = 2 * b0
  const b2 = b0
  const a1 = 2 * (warped * warped - 1) / c
  const a2 = (1 - Math.SQRT2 * warped + warped * warped) / c
  return { b: [b0, b1, b2], a: [1, a1, a2] }
}

/**
 * Chebyshev Type I low-pass (order 2) with ripple in dB.
 */
export function designChebyshev1Lowpass(fc: number, rippleDb: number, fs: number): FilterCoefficients {
  const eps = Math.sqrt(Math.pow(10, rippleDb / 10) - 1)
  const sinh = (x: number) => (Math.exp(x) - Math.exp(-x)) / 2
  const asinh = (x: number) => Math.log(x + Math.sqrt(x * x + 1))
  const beta = asinh(1 / eps) / 2
  const warped = Math.tan(Math.PI * fc / fs)
  const sin = Math.sin(Math.PI / 4)
  const cos = Math.cos(Math.PI / 4)
  const sigma = -sinh(beta) * sin
  const omega = cos * Math.cosh(beta)
  const preA0 = 4 + 4 * sigma * warped + (4 * (sigma * sigma + omega * omega)) * warped * warped
  const b0 = (4 * warped * warped * (omega * omega)) / preA0
  const b1 = 2 * b0
  const b2 = b0
  const a1 = (2 * (4 * (sigma * sigma + omega * omega) * warped * warped - 8)) / preA0
  const a2 = (4 - 4 * sigma * warped + 4 * (sigma * sigma + omega * omega) * warped * warped) / preA0
  return { b: [b0, b1, b2], a: [1, a1, a2] }
}
