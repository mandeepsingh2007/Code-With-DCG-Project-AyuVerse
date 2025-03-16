"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

function PulsePoint({ position, color = "#00b8ff", size = 0.05, intensity = 1.5 }) {
  const ref = useRef()
  const [scale, setScale] = useState(1)

  useFrame((state) => {
    // Pulsing effect
    const t = state.clock.getElapsedTime()
    setScale(1 + Math.sin(t * 2) * 0.2)

    // Rotate to face camera
    if (ref.current) {
      ref.current.lookAt(state.camera.position)
    }
  })

  return (
    <group position={position}>
      <mesh ref={ref}>
        <planeGeometry args={[size * scale, size * scale]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color={color} intensity={intensity} distance={0.5} />
    </group>
  )
}

function HumanModel() {
  const model = useRef()

  // In a real app, we would load an actual human body model
  // For this example, we'll create a simple representation

  useFrame((state) => {
    if (model.current) {
      model.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  // Pulse points positioned around the body
  const pulsePoints = [
    { position: [0, 0.8, 0.2], color: "#00b8ff", size: 0.08 }, // Heart
    { position: [0.4, 0.5, 0.1], color: "#00b8ff", size: 0.05 }, // Right arm
    { position: [-0.4, 0.5, 0.1], color: "#00b8ff", size: 0.05 }, // Left arm
    { position: [0.2, 0, 0.1], color: "#00b8ff", size: 0.05 }, // Right leg
    { position: [-0.2, 0, 0.1], color: "#00b8ff", size: 0.05 }, // Left leg
    { position: [0, 1.2, 0.1], color: "#00ffcc", size: 0.07 }, // Head
  ]

  return (
    <group ref={model}>
      {/* Simple body representation */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.2}
          roughness={0.8}
          emissive="#0066cc"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.2}
          roughness={0.8}
          emissive="#0066cc"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[0.4, 0.5, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 8, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.2}
          roughness={0.8}
          emissive="#0066cc"
          emissiveIntensity={0.05}
        />
      </mesh>
      <mesh position={[-0.4, 0.5, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 8, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.2}
          roughness={0.8}
          emissive="#0066cc"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[0.15, -0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.7, 8, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.2}
          roughness={0.8}
          emissive="#0066cc"
          emissiveIntensity={0.05}
        />
      </mesh>
      <mesh position={[-0.15, -0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.7, 8, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.2}
          roughness={0.8}
          emissive="#0066cc"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Pulse points */}
      {pulsePoints.map((point, index) => (
        <PulsePoint key={index} position={point.position} color={point.color} size={point.size} />
      ))}

      {/* Ambient glow */}
      <pointLight position={[0, 0.5, 0]} color="#0066cc" intensity={0.5} distance={2} />
    </group>
  )
}

export function HumanBodyModel() {
  return (
    <div className="h-full w-full rounded-md bg-gradient-to-b from-black/50 to-black/80">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0.5, 2]} fov={45} />
        <Suspense fallback={null}>
          <HumanModel />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={1.5}
          maxDistance={4}
        />
      </Canvas>
    </div>
  )
}

