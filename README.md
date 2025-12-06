# Circuit Symphony

A Vite + React + Three.js playground where Web Audio meets gesture control. Gestures via MediaPipe Hands, state via Zustand, visuals via instanced meshes.

## Quickstart
```powershell
npm install
npm run dev
```
Open the dev URL. For webcam gestures, use HTTPS or allow camera for localhost.

## Scripts
- `npm run dev` — start Vite dev server.
- `npm run build` — production build.
- `npm run preview` — preview production build.
- `npm run deploy` — build and push `dist` to `gh-pages` (requires `GITHUB_TOKEN` in CI or locally authenticated).

## Docs
- `docs/OVERVIEW.md` — architecture + Mermaid flow.
- `docs/API_REFERENCE.md` — module APIs.
- `docs/DEPLOYMENT.md` — GH Pages + local notes.

## Notes
- Vite `base` is `/circuit-symphony/` to match GitHub Pages.
- Gesture detection starts after clicking **Start audio** (resumes AudioContext and camera permissions).
