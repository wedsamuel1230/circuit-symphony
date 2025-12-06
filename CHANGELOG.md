# Changelog

## [0.1.1] - 2025-12-06

### Fixed
- **Gestures**: Added robust error handling and video loading checks to `HandDetector`. Fixed TypeScript errors in `App.tsx` regarding MediaPipe result types.
- **Visualization**: Fixed "square waveform" artifact by synchronizing `ParticleWaveform` instance count (2048) with `AudioEngine` FFT size. Increased particle geometry detail (12x12 segments) and hid unused instances.
- **Stability**: Added try/catch blocks to application start sequence to prevent silent failures.

### Changed
- **Performance**: Optimized `ParticleWaveform` to only update active instances.
