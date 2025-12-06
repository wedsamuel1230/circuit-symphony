import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  DoubleSide,
  Color
} from 'three'

export class RibbonWaveform {
  private mesh: Mesh
  private geometry: BufferGeometry
  private positions: Float32Array
  private count: number
  private width: number

  constructor(scene: Scene, count = 512, width = 0.1) {
    this.count = count
    this.width = width
    this.geometry = new BufferGeometry()
    
    // Triangle strip: 2 vertices per sample point
    const vertexCount = count * 2
    this.positions = new Float32Array(vertexCount * 3)
    
    // Initialize flat
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * 10 - 5
      // Top vertex
      this.positions[i * 6] = x
      this.positions[i * 6 + 1] = width / 2
      this.positions[i * 6 + 2] = 0
      
      // Bottom vertex
      this.positions[i * 6 + 3] = x
      this.positions[i * 6 + 4] = -width / 2
      this.positions[i * 6 + 5] = 0
    }

    this.geometry.setAttribute('position', new BufferAttribute(this.positions, 3))

    const material = new MeshBasicMaterial({
      color: 0x7ae6ff,
      side: DoubleSide,
      transparent: true,
      opacity: 0.8,
    })

    this.mesh = new Mesh(this.geometry, material)
    scene.add(this.mesh)
  }

  update(samples: Float32Array) {
    // Downsample if needed or just take the first N samples
    // We want to map the waveform across the screen width (-5 to 5)
    
    const step = Math.floor(samples.length / this.count)
    const positions = this.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < this.count; i++) {
      const sampleIndex = i * step
      const sample = samples[sampleIndex] || 0
      
      // Map x from -6 to 6
      const x = (i / (this.count - 1)) * 12 - 6
      
      // Y is amplitude
      const y = sample * 2.5
      
      // We create a ribbon by offsetting Z or Y. 
      // Let's make it face the camera (Z-up roughly).
      // Top vertex
      positions[i * 6] = x
      positions[i * 6 + 1] = y + this.width / 2
      positions[i * 6 + 2] = 0
      
      // Bottom vertex
      positions[i * 6 + 3] = x
      positions[i * 6 + 4] = y - this.width / 2
      positions[i * 6 + 5] = 0
    }

    this.geometry.attributes.position.needsUpdate = true
  }
}

export default RibbonWaveform
