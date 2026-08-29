'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene } from './Scene'

export default function HeroCanvas() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 10], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
