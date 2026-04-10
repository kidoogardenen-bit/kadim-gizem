'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, ReactNode } from 'react'

interface SceneWrapperProps {
  children: ReactNode
  className?: string
  cameraPosition?: [number, number, number]
  fov?: number
}

export function SceneWrapper({
  children,
  className,
  cameraPosition = [0, 0, 5],
  fov = 60,
}: SceneWrapperProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}

export default SceneWrapper
