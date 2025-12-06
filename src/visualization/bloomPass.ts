/* use context7 for Three.js r160 post-processing and Bloom effect */
import { Vector2 } from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export function createBloomPass(strength = 0.8, radius = 0.6, threshold = 0.1) {
  const resolution = new Vector2(window.innerWidth, window.innerHeight)
  const bloom = new UnrealBloomPass(resolution, strength, radius, threshold)
  bloom.renderToScreen = false
  return bloom
}

export type BloomPass = ReturnType<typeof createBloomPass>
