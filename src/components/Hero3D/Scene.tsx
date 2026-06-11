'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function PhotoCard({ url, position, rotation, scale = 1, zIndexOffset = 0 }: any) {
  const group = useRef<THREE.Group>(null)
  const texture = useTexture(url)
  
  useFrame((state) => {
    if (!group.current) return
    
    // Calculate subtle parallax based on mouse
    const targetY = (state.pointer.x * Math.PI) / 8
    const targetX = -(state.pointer.y * Math.PI) / 8
    
    // Smoothly interpolate rotation
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rotation[1] + targetY, 0.05)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rotation[0] + targetX, 0.05)
  })

  // Assume textures are generally landscape or adjust based on actual aspect
  // We'll give it a standard 4:3 or 3:2 landscape aspect
  const aspect = texture.image ? texture.image.width / texture.image.height : 1.5
  const height = 3 * scale
  const width = height * aspect

  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={2} position={position}>
      <group ref={group} rotation={rotation}>
        {/* Photo Image */}
        <mesh position={[0, 0, 0.021]} castShadow receiveShadow>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={texture} roughness={0.2} metalness={0.1} toneMapped={false} />
        </mesh>
        
        {/* Physical Photo Backing/Border (like a thick art card) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width + 0.3, height + 0.3, 0.04]} />
          {/* Ivory paper color for the border */}
          <meshStandardMaterial color="#FCFAF7" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  )
}

export function Scene() {
  const { viewport } = useThree()
  
  // Shift the cluster of photos to the right on larger screens, center on mobile
  const isDesktop = viewport.width > 8
  const rightOffset = isDesktop ? viewport.width * 0.2 : 0

  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={1024} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#C4A87D" />

      {/* Floating Gallery Group */}
      <group position={[rightOffset, 0, 0]}>
        <PhotoCard 
          url="/media/missoula-history-site.jpg" 
          position={[0.5, 1.5, -1]} 
          rotation={[-0.05, -0.1, 0.08]} 
          scale={0.9} 
        />
        <PhotoCard 
          url="/media/fact-and-fiction.jpg" 
          position={[-2.5, -0.5, 1]} 
          rotation={[0.1, 0.25, -0.1]} 
          scale={0.8} 
        />
        <PhotoCard 
          url="/media/burns-street-bistro.jpg" 
          position={[2, -2, 0]} 
          rotation={[-0.15, -0.2, -0.12]} 
          scale={0.95} 
        />
        <PhotoCard 
          url="/media/rockin-rudys.jpg" 
          position={[-1, 3, -2]} 
          rotation={[0.1, 0.05, 0.15]} 
          scale={0.7} 
        />
        <PhotoCard 
          url="/media/missoula-hero-twilight.png" 
          position={[3, 2, -3]} 
          rotation={[0, -0.3, -0.05]} 
          scale={1.1} 
        />
      </group>
      
      {/* Studio lighting environment for highly realistic reflections on the glossy photos */}
      <Environment preset="studio" />
    </>
  )
}
