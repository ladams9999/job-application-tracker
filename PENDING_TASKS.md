# Pending Tasks

## 1. Clean up Jest configuration and noisy test output

- Full Jest currently passes, but `ts-jest` warns that config under `globals` is deprecated
- The test run also emits excessive `console.log` and `console.warn` output from component tests

**Verifiable outcome:** `npx jest --runInBand` runs without the deprecated `ts-jest` warning and without excessive console noise from expected test paths

## 2. Reduce large production bundle warning

- `npm run build` succeeds, but Vite warns that the main JS chunk is larger than 500 kB after minification
- Current build output reports `dist/assets/index-*.js` at roughly 688 kB

**Verifiable outcome:** the production build no longer emits the chunk-size warning, or the warning threshold/config is intentionally adjusted with documented justification
