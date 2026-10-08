import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/drone.glb', '/draco/')

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (x, a, b) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * Realistic DJI Avata 2 model (Draco-compressed GLB in /public).
 *
 * Exploded-view assembly, driven by page scroll (GSAP ScrollTrigger
 * scrub -> progressRef 0..1):
 *  - Every mesh's original local position/rotation is stored.
 *  - At the top of the page (progress 0) parts rest pushed outward
 *    along their offset from the model center -> disassembled.
 *  - Scrolling down eases every part back to its original transform,
 *    assembling the drone dead-center. Scrolling up reverses it.
 * The camera also dollies in as assembly completes, and an idle
 * float runs independent of scroll once assembled.
 */
export default function DroneModel({ progressRef }) {
  const root = useRef()
  const size = useThree((s) => s.size)
  const { scene } = useGLTF('/drone.glb', '/draco/')

  const responsive = size.width < 640 ? 0.72 : size.width < 1024 ? 0.9 : 1

  const { model, parts } = useMemo(() => {
    const cloned = scene.clone(true)

    // Normalize to a ~3.4-unit footprint, centered on origin
    const box = new THREE.Box3().setFromObject(cloned)
    const dim = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(dim)
    box.getCenter(center)
    const s = 3.4 / Math.max(dim.x, dim.y, dim.z)
    cloned.scale.setScalar(s)
    cloned.position.set(-center.x * s, -center.y * s, -center.z * s)
    cloned.updateMatrixWorld(true)

    // Record every mesh: original transform + outward explode vector
    // (world offset from center, converted into the parent's local space
    // so nested groups separate correctly).
    const origin = new THREE.Vector3(0, 0, 0)
    const parts = []
    const tmpQ = new THREE.Quaternion()
    cloned.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = true
      o.receiveShadow = true
      const mats = Array.isArray(o.material) ? o.material : [o.material]
      mats.forEach((m) => {
        if (m && 'envMapIntensity' in m) m.envMapIntensity = 0.9
      })

      const wp = new THREE.Vector3()
      o.getWorldPosition(wp)
      const dir = wp.clone().sub(origin)
      if (dir.lengthSq() < 1e-6) {
        // Centered part: give it a deterministic outward nudge
        dir.set(Math.sin(parts.length * 12.9), 0.8, Math.cos(parts.length * 7.7))
      }
      const dist = dir.length()
      dir.normalize()
      o.parent.getWorldQuaternion(tmpQ).invert()
      const localDir = dir.clone().applyQuaternion(tmpQ)

      parts.push({
        o,
        origPos: o.position.clone(),
        origRot: o.rotation.clone(),
        localDir,
        // Farther parts travel farther; clamped so the exploded
        // composition stays in frame
        travel: Math.min(0.35 + dist * 0.55, 1.35),
        spin: (parts.length % 2 === 0 ? 1 : -1) * (0.25 + (parts.length % 5) * 0.06),
      })
    })
    return { model: cloned, parts }
  }, [scene])

  useFrame((state) => {
    const p = progressRef.current ?? 0
    const t = state.clock.elapsedTime
    if (!root.current) return

    // 0 at page top (exploded) -> 1 once assembled (~45% of the page)
    const assembled = smooth(p, 0.0, 0.45)
    const k = 1 - assembled

    // Scatter / gather every part
    for (let i = 0; i < parts.length; i++) {
      const pt = parts[i]
      pt.o.position.set(
        pt.origPos.x + pt.localDir.x * pt.travel * k,
        pt.origPos.y + pt.localDir.y * pt.travel * k,
        pt.origPos.z + pt.localDir.z * pt.travel * k
      )
      pt.o.rotation.set(
        pt.origRot.x + pt.spin * 0.35 * k,
        pt.origRot.y + pt.spin * k,
        pt.origRot.z
      )
    }

    // Cinematic turn + rise, then idle hover once assembled
    root.current.rotation.y = 0.55 + p * Math.PI * 2 + Math.sin(t * 0.4) * 0.04
    root.current.rotation.x = 0.1 - p * 0.08 + Math.sin(t * 0.6) * 0.015 * assembled
    root.current.position.y = -0.15 + p * 0.5 + Math.sin(t * 1.2) * 0.07 * assembled
    root.current.scale.setScalar((0.97 + p * 0.05) * responsive)

    // Dolly in as the drone comes together (wide for exploded, close for hero)
    const cam = state.camera
    cam.position.z = 9.6 - assembled * 1.8
    cam.position.y = 1.0 - assembled * 0.3
  })

  return (
    <group ref={root}>
      <primitive object={model} />
    </group>
  )
}
