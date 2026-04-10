'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Glitch,
} from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'
import * as THREE from 'three'
import { SceneWrapper } from './SceneWrapper'

/**
 * Chaotic red/crimson particle storm.
 */
function StormParticles({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
      vel[i * 3] = (Math.random() - 0.5) * 0.3
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    }
    return { positions: pos, velocities: vel }
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      arr[ix] += velocities[ix] * delta + Math.sin(t + i) * 0.01
      arr[ix + 1] += velocities[ix + 1] * delta + Math.cos(t * 1.3 + i) * 0.01
      arr[ix + 2] += velocities[ix + 2] * delta + Math.sin(t * 0.7 + i) * 0.01

      // Wrap around bounds
      for (let k = 0; k < 3; k++) {
        if (arr[ix + k] > 10) arr[ix + k] = -10
        if (arr[ix + k] < -10) arr[ix + k] = 10
      }
    }
    attr.needsUpdate = true

    ref.current.rotation.y += delta * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ff1a2a"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * Lightning flash — briefly turns a directional light on at random intervals.
 */
function LightningFlash() {
  const lightRef = useRef<THREE.PointLight>(null)
  const [nextFlash, setNextFlash] = useState(2)
  const timer = useRef(0)
  const flashDur = useRef(0)

  useFrame((_, delta) => {
    timer.current += delta
    if (!lightRef.current) return

    if (flashDur.current > 0) {
      flashDur.current -= delta
      lightRef.current.intensity = flashDur.current > 0 ? Math.random() * 15 : 0
    } else if (timer.current > nextFlash) {
      timer.current = 0
      flashDur.current = 0.15 + Math.random() * 0.15
      setNextFlash(2 + Math.random() * 5)
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={[Math.random() * 6 - 3, 4, Math.random() * 6 - 3]}
      intensity={0}
      color="#ff4050"
      distance={30}
    />
  )
}

/**
 * Central ominous glowing orb.
 */
function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      ref.current.scale.setScalar(s)
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshBasicMaterial color="#ff2030" transparent opacity={0.85} />
    </mesh>
  )
}

function StormContents() {
  return (
    <>
      <fog attach="fog" args={['#100000', 4, 22]} />
      <color attach="background" args={['#050000']} />

      <ambientLight intensity={0.1} color="#400000" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ff1020" distance={15} />
      <LightningFlash />
      <LightningFlash />

      <CoreOrb />
      <StormParticles count={3500} />

      <EffectComposer>
        <Bloom intensity={1.4} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0025, 0.0025)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Glitch
          delay={new THREE.Vector2(2.5, 6.0)}
          duration={new THREE.Vector2(0.15, 0.4)}
          strength={new THREE.Vector2(0.1, 0.3)}
          mode={GlitchMode.SPORADIC}
          active
          ratio={0.85}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.95} />
      </EffectComposer>
    </>
  )
}

export function ParticleStormScene({ className }: { className?: string }) {
  return (
    <SceneWrapper className={className} cameraPosition={[0, 0, 8]} fov={65}>
      <StormContents />
    </SceneWrapper>
  )
}

export default ParticleStormScene
