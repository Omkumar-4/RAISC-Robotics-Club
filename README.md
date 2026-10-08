# RAISC — GKCIET Robotics Club landing page

High-performance interactive landing page with a scroll-assembled 3D drone.

## Stack
- React 18 + Vite
- Tailwind CSS v4
- Three.js via @react-three/fiber + @react-three/drei
- GSAP + ScrollTrigger

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## 3D scroll experience
- `src/components/Scene.jsx` — fixed Canvas, camera `[0, 0.6, 8.2]`, ambient + directional + spot + cyan/magenta/volt point lights, `Environment preset="city"`, `ContactShadows`.
- `src/components/DroneModel.jsx` — procedural quadcopter split into groups:
  - `chassis` — Hero (always visible, floating)
  - `motorGroups` + `wiring` — About (progress 0.18 → 0.5)
  - `propGroups` + `gimbal` — Projects (progress 0.5 → 0.75)
  - LEDs (`emissiveIntensity`) + hover (`sin(t)`, independent of scroll) — Footer (progress 0.78 → 1)
- `src/App.jsx` — master `ScrollTrigger` maps full-page scroll to `progressRef.current` (0..1) consumed in `useFrame` with lerp, plus `.reveal` entrance animations.

## Swap in a real GLB later
```jsx
import { useGLTF } from '@react-three/drei'
const { scene } = useGLTF('/drone.glb')
```
Split its nodes into the same 5 groups and drive them with the existing `motorP / wireP / propP / gimbalP / powerP` smoothstep values.

## Responsive
Drone scale: `<480px → 0.62`, `<768px → 0.8`, else `1.0`. Text uses fluid Tailwind sizes; foreground cards use `backdrop-blur` glass so the drone stays visible.
