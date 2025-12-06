/* use context7 for MediaPipe Hands v0.10 integration and WebCam */
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision'

export type HandResultCallback = (result: HandLandmarkerResult) => void

export interface HandDetectorOptions {
  maxHands?: number
  minConfidence?: number
  runningMode?: 'VIDEO' | 'IMAGE'
}

export class HandDetector {
  private video?: HTMLVideoElement
  private landmarker?: HandLandmarker
  private onResult?: HandResultCallback
  private raf = 0
  private options: HandDetectorOptions

  constructor(options: HandDetectorOptions = {}) {
    this.options = options
  }

  async init(onResult: HandResultCallback) {
    this.onResult = onResult
    this.video = document.createElement('video')
    this.video.playsInline = true
    this.video.muted = true
    this.video.autoplay = true

    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
    this.video.srcObject = stream
    await this.video.play()

    const fileset = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm')
    this.landmarker = await HandLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      },
      numHands: this.options.maxHands ?? 2,
      minHandDetectionConfidence: this.options.minConfidence ?? 0.5,
      minHandPresenceConfidence: this.options.minConfidence ?? 0.5,
      minTrackingConfidence: this.options.minConfidence ?? 0.5,
      runningMode: 'VIDEO',
    })

    this.loop()
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.landmarker || !this.video || this.video.readyState < 2) return
    const now = performance.now()
    const result = this.landmarker.detectForVideo(this.video, now)
    if (result && this.onResult) {
      this.onResult(result)
    }
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    if (this.video && this.video.srcObject) {
      const tracks = (this.video.srcObject as MediaStream).getTracks()
      tracks.forEach((t) => t.stop())
    }
    this.landmarker?.close()
  }
}

export default HandDetector
