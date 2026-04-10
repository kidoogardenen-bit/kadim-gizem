'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { SceneWrapper } from './SceneWrapper'

/**
 * Procedural marble-like material using noise in fragment shader.
 */
function useMarbleMaterial() {
  return useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColorA: { value: new THREE.Color('#e8d9b8') },
        uColorB: { value: new THREE.Color('#7a6a4a') },
        uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.5).normalize() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uLightDir;
        varying vec3 vNormal;
        varying vec3 vPosition;

        float hash(vec3 p) {
          return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        void main() {
          float n = noise(vPosition * 2.5);
          n += noise(vPosition * 7.0) * 0.5;
          n = fract(n * 2.0);
          vec3 base = mix(uColorA, uColorB, smoothstep(0.3, 0.7, n));
          float diff = max(dot(vNormal, uLightDir), 0.0);
          vec3 col = base * (0.35 + 0.9 * diff);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
  }, [])
}

function Pillar({ position }: { position: [number, number, number] }) {
  const material = useMarbleMaterial()
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, -2.2, 0]} material={material}>
        <boxGeometry args={[1.4, 0.3, 1.4]} />
      </mesh>
      {/* Shaft */}
      <mesh material={material}>
        <cylinderGeometry args={[0.5, 0.55, 4, 24]} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 2.2, 0]} material={material}>
        <boxGeometry args={[1.2, 0.35, 1.2]} />
      </mesh>
    </group>
  )
}

/**
 * Volumetric god-ray light cones using additive cones.
 */
function GodRay({ position }: { position: [number, number, number] }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  return (
    <mesh position={position} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[1.5, 8, 32, 1, true]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ffd68a"
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/**
 * Floating dust particles in the light beams.
 */
function DustParticles({ count = 400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.002
      arr[i * 3] += Math.cos(t * 0.3 + i) * 0.001
    }
    pos.needsUpdate = true
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
        size={0.04}
        color="#ffe2a8"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function PillarsContents() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <>
      <fog attach="fog" args={['#0a0705', 6, 25]} />
      <color attach="background" args={['#050302']} />

      <ambientLight intensity={0.15} color="#3a2a10" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.8}
        color="#ffd27a"
        castShadow
      />
      <pointLight position={[0, 6, 0]} intensity={1.2} color="#ffb75a" />

      <group ref={groupRef}>
        <Pillar position={[-3, 0, -2]} />
        <Pillar position={[3, 0, -2]} />
        <Pillar position={[-3, 0, 2]} />
        <Pillar position={[3, 0, 2]} />

        <GodRay position={[-3, 4, -2]} />
        <GodRay position={[3, 4, -2]} />
        <GodRay position={[-3, 4, 2]} />
        <GodRay position={[3, 4, 2]} />

        <Float speed={0.5} rotationIntensity={0}>
          <DustParticles count={500} />
        </Float>
      </group>

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1a1208" roughness={1} />
      </mesh>

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </>
  )
}

export function AncientPillarsScene({ className }: { className?: string }) {
  return (
    <SceneWrapper className={className} cameraPosition={[0, 1, 9]} fov={55}>
      <PillarsContents />
    </SceneWrapper>
  )
}

export default AncientPillarsScene
