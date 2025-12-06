/* use context7 for Three.js r160 and React integration patterns */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createBloomPass } from './bloomPass'
import LineWaveform from './LineWaveform'
import SpectrumVisualizer from './SpectrumVisualizer'
import StarField from './StarField'
import AudioEngine from '../audio/AudioEngine'

interface VisualizerProps {
  audio: AudioEngine | null
  running: boolean
}

export function Visualizer({ audio, running }: VisualizerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#060a0f')

    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 100)
    camera.position.set(0, 1.5, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 2
    controls.maxDistance = 12

    const ambient = new THREE.AmbientLight(0x66aaff, 0.6)
    scene.add(ambient)
    const key = new THREE.PointLight(0xffffff, 1.2, 20)
    key.position.set(4, 6, 6)
    scene.add(key)

    const particleLayer = new LineWaveform(scene, 2048)
    const spectrumLayer = new SpectrumVisualizer(scene, 128)
    const starField = new StarField(scene)

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    const bloom = createBloomPass(1.1, 0.6, 0.08)
    composer.addPass(renderPass)
    composer.addPass(bloom)

    containerRef.current.appendChild(renderer.domElement)

    let raf = 0

    const handleResize = () => {
      if (!containerRef.current) return
      const { clientWidth, clientHeight } = containerRef.current
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
      composer.setSize(clientWidth, clientHeight)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    const animate = (time: number) => {
      raf = requestAnimationFrame(animate)
      controls.update()

      if (audio && running) {
        const bins = audio.getFrequencyData()
        const wave = audio.getWaveformData()
        spectrumLayer.update(bins)
        particleLayer.update(wave)
      }
      
      starField.update(time * 0.001)

      composer.render()
    }

    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      renderer.dispose()
      composer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [audio, running])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default Visualizer
