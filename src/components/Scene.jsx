import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import DroneModel from './DroneModel.jsx'

/**
 * Cinematic "studio" stage for the Avata 2:
 * pure-black void, soft key + dramatic rear rim spotlight,
 * real shadow-catcher floor and studio HDRI reflections.
 */
export default function Scene({ progressRef }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.7, 7.8], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {/* faint base so PBR materials never go pitch black */}
        <ambientLight intensity={0.12} />

        {/* soft key from front-right with real shadows */}
        <directionalLight
          position={[4, 6, 6]}
          intensity={1.1}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0002}
        />

        {/* dramatic rim / edge light from above-behind */}
        <spotLight
          position={[-5, 7, -6]}
          angle={0.5}
          penumbra={0.9}
          intensity={90}
          color="#d6e6ff"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0002}
        />

        {/* whisper of front fill */}
        <pointLight position={[0, 0.5, 6]} intensity={5} color="#ffffff" distance={18} />

        <DroneModel progressRef={progressRef} />

        {/* invisible floor that only catches the shadow */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -1.9, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.5} />
        </mesh>

        {/* studio HDRI for metal / carbon reflections */}
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}
