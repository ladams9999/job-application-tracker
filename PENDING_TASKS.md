# Pending Tasks

## 1. Reduce large production bundle warning

- `npm run build` succeeds, but Vite warns that the main JS chunk is larger than 500 kB after minification
- Current build output reports `dist/assets/index-*.js` at roughly 688 kB

**Verifiable outcome:** the production build no longer emits the chunk-size warning, or the warning threshold/config is intentionally adjusted with documented justification
