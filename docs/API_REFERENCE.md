# API Reference

## AudioEngine (`src/audio/AudioEngine.ts`)
- `start()`: resumes/creates AudioContext and connects nodes.
- `setWaveform(type)`: sets oscillator type (`'sine' | 'square' | 'sawtooth' | 'triangle'`).
- `setFrequency(hz)`: smooth frequency ramp.
- `setQ(value)`: updates biquad Q with smoothing.
- `setGain(db)`: converts dB to linear and ramps gain.
- `setAnalyserSmoothing(value)`: sets analyser `smoothingTimeConstant`.
- `getAnalyser()`: returns analyser node for visualization.

## Filter Designer (`src/audio/filterDesigner.ts`)
Helpers returning coefficient objects for filters:
- `designRCLowpass(cutoffHz, resistance, capacitance)`
- `designRLCBandpass(centerHz, r, l, c)`
- `designButterworth(order, cutoffHz, sampleRate)`
- `designChebyshev(order, rippleDb, cutoffHz, sampleRate)`

## Signal Generator (`src/audio/signalGenerator.ts`)
- `generateWaveform(type, length)`: fills an array with the chosen waveform.
- `generateHarmonics(length, baseFreq)`: harmonic series sample array.

## Gestures
- `HandDetector` (`src/gestures/HandDetector.ts`): wraps MediaPipe Hands. `init(onResult)` starts stream and callbacks results `{ landmarks, handedness, timestamp }`. Call `dispose()` to stop camera/renderer.
- `ParameterMapper` (`src/gestures/ParameterMapper.ts`): `map(handDistance, fingerSpread, confidence)` → `{ frequency, q, gain }` with smoothing/clamping.

## Visualization
- `Visualizer` component (`src/visualization/Visualizer.tsx`): sets up Three.js scene, composer, and drives `ParticleWaveform` + `SpectrumVisualizer` using analyser FFT/time-domain data.
- `ParticleWaveform`: `update(data)` updates instanced particles positions/colors.
- `SpectrumVisualizer`: `update(freqData)` updates instanced bar scales/colors.
- `bloomPass`: helper returning `UnrealBloomPass` tuned for neon glow.

## State Store (`src/state/useAppStore.ts`)
State shape: `{ started, waveform, frequency, q, gain, mode, analyserSmoothing }`.
Actions: `setWaveform`, `setFrequency`, `setQ`, `setGain`, `setMode`, `setAnalyserSmoothing`, `markStarted`.

## UI (`src/components/ControlPanel.tsx`)
Props: `{ onStart, onWaveformChange, onFrequencyChange, onQChange, onGainChange, onSmoothingChange, started }`. Renders controls for manual parameter overrides.
