'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { SceneWrapper } from './SceneWrapper'

/**
 * Procedural parchment/old-map shader for the globe.
 */
function useParchmentMaterial() {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uLightDir: { value: new THREE.Vector3(0.6, 0.8, 0.5).normalize() },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uLightDir;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
              mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
              u.y
            );
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p *= 2.0;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            // Parchment base colors (sepia)
            vec3 light = vec3(0.92, 0.78, 0.52);
            vec3 dark = vec3(0.45, 0.30, 0.15);

            float n = fbm(vUv * 6.0);
            float cont = smoothstep(0.45, 0.55, n); // continent mask
            vec3 base = mix(light, dark * 1.2, cont);

            // Stains
            float stain = fbm(vUv * 15.0 + 5.0);
            base *= 0.75 + stain * 0.45;

            // Lat/lon grid lines
            float lat = abs(fract(vUv.y * 12.0) - 0.5);
            float lon = abs(fract(vUv.x * 24.0) - 0.5);
            float grid = smoothstep(0.02, 0.0, lat) + smoothstep(0.02, 0.0, lon);
            base = mix(base, vec3(0.25, 0.15, 0.05), grid * 0.35);

            // Lighting
            float diff = max(dot(vNormal, uLightDir), 0.0);
            vec3 col = base * (0.4 + 0.85 * diff);

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  )
}

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const material = useParchmentMaterial()
  const [hovered, setHovered] = useState(false)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  useFrame((state, delta) => {
    material.uniforms.uTime.value += delta
    if (!meshRef.current) return

    if (hovered) {
      // Follow mouse
      const targetY = state.mouse.x * Math.PI
      const targetX = -state.mouse.y * Math.PI * 0.5
      mouseY.current += (targetY - mouseY.current) * 0.08
      mouseX.current += (targetX - mouseX.current) * 0.08
      meshRef.current.rotation.y = mouseY.current
      meshRef.current.rotation.x = mouseX.current
    } else {
      meshRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <mesh
      ref={meshRef}
      material={material}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[2, 64, 64]} />
    </mesh>
  )
}

/**
 * Floating compass rose built from thin torus + crossed boxes.
 */
function CompassRose() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.1
    }
  })

  const gold = new THREE.MeshStandardMaterial({
    color: '#c9a35a',
    metalness: 0.8,
    roughness: 0.3,
    emissive: '#5a3a10',
    emissiveIntensity: 0.2,
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={groupRef} position={[3.2, 1.6, 0.5]} scale={0.5}>
        <mesh material={gold}>
          <torusGeometry args={[1, 0.06, 16, 64]} />
        </mesh>
        <mesh material={gold}>
          <torusGeometry args={[0.75, 0.04, 16, 64]} />
        </mesh>
        {/* N-S */}
        <mesh material={gold}>
          <boxGeometry args={[0.08, 1.9, 0.02]} />
        </mesh>
        {/* E-W */}
        <mesh material={gold}>
          <boxGeometry args={[1.9, 0.08, 0.02]} />
        </mesh>
        {/* Diagonals */}
        <mesh material={gold} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.05, 1.6, 0.02]} />
        </mesh>
        <mesh material={gold} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.05, 1.6, 0.02]} />
        </mesh>
      </group>
    </Float>
  )
}

function GlobeContents() {
  return (
    <>
      <fog attach="fog" args={['#1a0f06', 10, 28]} />
      <color attach="background" args={['#0f0803']} />

      <ambientLight intensity={0.4} color="#c49a5a" />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffd58a" />
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#8a5a20" />

      <Globe />
      <CompassRose />

      <EffectComposer>
        <Vignette eskil={false} offset={0.15} darkness={0.8} />
      </EffectComposer>
    </>
  )
}

export function PapyrusGlobeScene({ className }: { className?: string }) {
  return (
    <SceneWrapper className={className} cameraPosition={[0, 0.5, 6]} fov={55}>
      <GlobeContents />
    </SceneWrapper>
  )
}

export default PapyrusGlobeScene
