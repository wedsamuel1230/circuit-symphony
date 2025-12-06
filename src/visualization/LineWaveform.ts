import {
  BufferGeometry,
  BufferAttribute,
  LineLoop,
  LineBasicMaterial,
  Scene,
  Color
} from 'three'

export class LineWaveform {
  private line: LineLoop
  private geometry: BufferGeometry
  private positions: Float32Array
  private count: number

  constructor(scene: Scene, count = 2048) {
    this.count = count
    this.geometry = new BufferGeometry()
    // Ensure we have enough points
    this.positions = new Float32Array(count * 3)
    this.geometry.setAttribute('position', new BufferAttribute(this.positions, 3))

    const material = new LineBasicMaterial({
      color: 0x7ae6ff,
      transparent: true,
      opacity: 0.9,
    })

    this.line = new LineLoop(this.geometry, material)
    scene.add(this.line)
  }

  update(samples: Float32Array) {
    const len = Math.min(samples.length, this.count)
    const positions = this.line.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < len; i++) {
      const angle = (i / len) * Math.PI * 2
      // Create a circular waveform
      // Radius modulated by amplitude
      const radius = 2.0 + samples[i] * 0.8
      
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = samples[i] * 0.5 // Slight vertical displacement for 3D effect

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    this.line.geometry.attributes.position.needsUpdate = true
  }
}

export default LineWaveform
