/* use context7 for Three.js r160 InstancedMesh GPU instancing */
import {
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
  Scene,
} from 'three'

export class ParticleWaveform {
  private mesh: InstancedMesh
  private dummy: Object3D
  private color: Color
  private count: number

  constructor(scene: Scene, count = 2048) {
    this.count = count
    const geo = new SphereGeometry(0.03, 12, 12)
    const mat = new MeshStandardMaterial({
      color: 0x00c8ff,
      emissive: 0x003366,
      emissiveIntensity: 0.6,
      metalness: 0.2,
      roughness: 0.3,
    })
    this.mesh = new InstancedMesh(geo, mat, count)
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage)
    this.mesh.castShadow = false
    this.mesh.receiveShadow = false

    this.dummy = new Object3D()
    this.color = new Color()

    for (let i = 0; i < count; i++) {
      this.dummy.position.set(0, 0, 0)
      this.dummy.scale.set(0, 0, 0) // Hide initially
      this.dummy.updateMatrix()
      this.mesh.setMatrixAt(i, this.dummy.matrix)
      this.mesh.setColorAt(i, this.color.setHSL(i / count, 0.9, 0.55))
    }

    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
    this.mesh.instanceMatrix.needsUpdate = true
    scene.add(this.mesh)
  }

  update(samples: Float32Array, time: number) {
    const len = Math.min(samples.length, this.count)
    for (let i = 0; i < len; i++) {
      const t = i / len
      const sample = samples[i]
      const radius = 1.2 + sample * 0.9
      const angle = t * Math.PI * 2 + time * 0.6
      const y = sample * 0.8
      
      this.dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      this.dummy.scale.setScalar(0.6 + Math.abs(sample) * 1.4)
      this.dummy.updateMatrix()
      this.mesh.setMatrixAt(i, this.dummy.matrix)

      // Dynamic color based on amplitude
      const hue = (0.55 + sample * 0.4) % 1
      const lightness = 0.5 + Math.abs(sample) * 0.4
      this.mesh.setColorAt(i, this.color.setHSL(hue, 0.9, lightness))
    }
    // Hide unused instances
    for (let i = len; i < this.count; i++) {
      this.dummy.position.set(0, 0, 0)
      this.dummy.scale.set(0, 0, 0)
      this.dummy.updateMatrix()
      this.mesh.setMatrixAt(i, this.dummy.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
  }
}

export default ParticleWaveform
