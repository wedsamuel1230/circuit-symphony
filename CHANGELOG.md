# Changelog

## [0.2.0] - 2025-12-06

### Added
- **Safety**: Added a volume warning modal before audio start to protect user hearing.
- **Audio Control**: Added `Detune` slider (-100 to +100 cents) for fine pitch adjustment and chorus effects.
- **Audio Control**: Added `Filter Type` selector (Lowpass, Highpass, Bandpass, Notch, Peaking).
- **Education**: Updated the in-app Guide to explain Filter Types and Detune concepts.

## [0.1.1] - 2025-12-06

### Fixed
- **Gestures**: Added robust error handling and video loading checks to `HandDetector`. Fixed TypeScript errors in `App.tsx` regarding MediaPipe result types.
- **Visualization**: Fixed "square waveform" artifact by synchronizing `ParticleWaveform` instance count (2048) with `AudioEngine` FFT size. Increased particle geometry detail (12x12 segments) and hid unused instances.
- **Stability**: Added try/catch blocks to application start sequence to prevent silent failures.

### Changed
- **Performance**: Optimized `ParticleWaveform` to only update active instances.
