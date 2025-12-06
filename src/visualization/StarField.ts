import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  Scene,
  MathUtils,
} from 'three'

export class StarField {
  private points: Points

  constructor(scene: Scene, count = 2000) {
    const geometry = new BufferGeometry()
    const positions = []
    const sizes = []

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      positions.push(x, y, z)
      sizes.push(Math.random() * 1.5)
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1))

    const material = new PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })

    this.points = new Points(geometry, material)
    scene.add(this.points)
  }

  update(time: number) {
    this.points.rotation.y = time * 0.05
    this.points.rotation.z = time * 0.02
  }
}

export default StarField
