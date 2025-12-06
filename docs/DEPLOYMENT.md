# Deployment

## GitHub Pages (preconfigured)
- Workflow: `.github/workflows/deploy.yml` builds on `main` and publishes `dist` to `gh-pages` using `peaceiris/actions-gh-pages`.
- Site path: `https://<user>.github.io/circuit-symphony/` (Vite `base` is `/circuit-symphony/`).
- Manual publish: `npm run deploy` runs `vite build` then `gh-pages -d dist`.

## Local
```powershell
npm install
npm run dev
```
Open the shown localhost URL (with HTTPS if you want webcam/gesture access; else allow insecure camera in browser flags only for testing).

## Environment
No secrets required. Webcam permission is requested at runtime when gestures start.

## Troubleshooting
- Blank page on GitHub Pages: ensure repository name matches `base` (`/circuit-symphony/`) or adjust `vite.config.ts` accordingly.
- HTTPS requirement: GitHub Pages is HTTPS by default. For local HTTPS, use a dev proxy like `vite --host --https` with a cert.
- Gesture performance: close other camera apps; lower resolution via `HandDetector` options if needed.
