/* use context7 for Three.js r160 BufferGeometry and material updates */
import {
  BoxGeometry,
  Color,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Object3D,
  Scene,
} from 'three'

export class SpectrumVisualizer {
  private mesh: InstancedMesh
  private dummy: Object3D
  private color: Color
  private binCount: number

  constructor(scene: Scene, binCount = 128) {
    this.binCount = binCount
    const geo = new BoxGeometry(0.08, 0.5, 0.08)
    const mat = new MeshStandardMaterial({
      color: 0x99ffcc,
      emissive: 0x113322,
      emissiveIntensity: 0.8,
      metalness: 0.15,
      roughness: 0.35,
    })
    this.mesh = new InstancedMesh(geo, mat, binCount)
    this.dummy = new Object3D()
    this.color = new Color()

    for (let i = 0; i < binCount; i++) {
      const x = (i / binCount) * 6 - 3
      this.dummy.position.set(x, 0.25, -1.2)
      this.dummy.updateMatrix()
      this.mesh.setMatrixAt(i, this.dummy.matrix)
      this.mesh.setColorAt(i, this.color.setHSL(i / binCount, 0.8, 0.55))
    }
    this.mesh.instanceMatrix.needsUpdate = true
    this.mesh.instanceColor!.needsUpdate = true
    scene.add(this.mesh)
  }

  update(bins: Uint8Array) {
    const len = Math.min(bins.length, this.binCount)
    const mat = new Matrix4()
    for (let i = 0; i < len; i++) {
      const magnitude = bins[i] / 255
      const height = 0.2 + magnitude * 2.8
      const x = (i / this.binCount) * 6 - 3
      this.dummy.position.set(x, height / 2, -1.2)
      this.dummy.scale.set(1, height, 1)
      this.dummy.updateMatrix()
      this.mesh.setMatrixAt(i, this.dummy.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true
  }
}

export default SpectrumVisualizer
