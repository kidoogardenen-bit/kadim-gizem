'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { StarField } from './StarField'
import { SceneWrapper } from './SceneWrapper'

/**
 * Accretion disk with custom shader (orange/yellow/white gradient, rotating).
 */
function AccretionDisk() {
  const meshRef = useRef<THREE.Mesh>(null)

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPosition;

        // Simple hash noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        void main() {
          float dist = length(vPosition.xz);
          float inner = 1.2;
          float outer = 3.0;
          float ring = smoothstep(inner, inner + 0.2, dist) *
                       (1.0 - smoothstep(outer - 0.5, outer, dist));

          float angle = atan(vPosition.z, vPosition.x);
          float swirl = noise(vec2(angle * 4.0 + uTime * 2.0, dist * 3.0 - uTime * 3.0));
          swirl = pow(swirl, 1.5);

          // Gradient: inner white -> yellow -> orange -> dark
          float t = smoothstep(inner, outer, dist);
          vec3 innerCol = vec3(1.0, 0.95, 0.85);
          vec3 midCol = vec3(1.0, 0.7, 0.2);
          vec3 outerCol = vec3(0.9, 0.25, 0.05);
          vec3 col = mix(innerCol, midCol, smoothstep(0.0, 0.4, t));
          col = mix(col, outerCol, smoothstep(0.4, 1.0, t));

          float alpha = ring * (0.55 + swirl * 0.9);
          col *= (1.3 + swirl * 1.5);

          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((_, delta) => {
    shaderMaterial.uniforms.uTime.value += delta
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2.3, 0, 0]} material={shaderMaterial}>
      <ringGeometry args={[1.2, 3.0, 128, 8]} />
    </mesh>
  )
}

/**
 * Central event horizon with subtle distortion (gravitational lensing suggestion).
 */
function EventHorizon() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#000000"
        distort={0.15}
        speed={1}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

/**
 * Slow camera orbit around the black hole.
 */
function CameraRig() {
  const { camera } = useThree()
  const angleRef = useRef(0)

  useFrame((_, delta) => {
    angleRef.current += delta * 0.08
    const radius = 7
    camera.position.x = Math.cos(angleRef.current) * radius
    camera.position.z = Math.sin(angleRef.current) * radius
    camera.position.y = Math.sin(angleRef.current * 0.4) * 1.2 + 1.5
    camera.lookAt(0, 0, 0)
  })

  return null
}

function BlackHoleSceneContents() {
  return (
    <>
      <fog attach="fog" args={['#000005', 8, 30]} />
      <color attach="background" args={['#000003']} />

      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa55" distance={10} />

      <StarField count={5000} radius={60} size={0.06} />
      <EventHorizon />
      <AccretionDisk />
      <CameraRig />

      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

export function BlackHoleScene({ className }: { className?: string }) {
  return (
    <SceneWrapper className={className} cameraPosition={[0, 1.5, 7]} fov={60}>
      <BlackHoleSceneContents />
    </SceneWrapper>
  )
}

export default BlackHoleScene
