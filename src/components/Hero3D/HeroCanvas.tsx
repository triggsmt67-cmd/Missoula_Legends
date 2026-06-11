'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene } from './Scene'
import { PerspectiveCamera } from '@react-three/drei'

export default function HeroCanvas() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 10], fov: 45 }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
