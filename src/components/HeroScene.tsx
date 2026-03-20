import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function AnimatedSphere() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.15;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={mesh} args={[1.8, 64, 64]} position={[2.5, 0, 0]}>
        <MeshDistortMaterial
          color="#2E7D32"
          roughness={0.2}
          metalness={0.8}
          distort={0.35}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

function SmallSpheres() {
  const positions = useMemo(
    () => [
      [1, 1.5, -2],
      [5, -1.5, -1],
      [2, -2, 1],
      [4.5, 2, -3],
      [0.5, 0.5, -1.5],
      [3, 2.5, -2],
    ] as [number, number, number][],
    []
  );
  return (
    <>
      {positions.map((pos, i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={0.8}>
          <Sphere args={[0.15 + i * 0.05, 32, 32]} position={pos}>
            <meshStandardMaterial
              color={i % 2 === 0 ? "#4CAF50" : "#81C784"}
              roughness={0.3}
              metalness={0.6}
              transparent
              opacity={0.7}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

function RecycleRing() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) {
      ring.current.rotation.z = state.clock.elapsedTime * 0.3;
      ring.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    }
  });
  return (
    <mesh ref={ring} position={[2.5, 0, 0]}>
      <torusGeometry args={[2.8, 0.04, 16, 100]} />
      <meshStandardMaterial color="#66BB6A" transparent opacity={0.5} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -5, 5]} intensity={0.6} color="#4CAF50" />
        <pointLight position={[3, 3, -3]} intensity={0.4} color="#81C784" />
        <Stars
          radius={50}
          depth={60}
          count={1500}
          factor={3}
          saturation={0.1}
          fade
          speed={0.8}
        />
        <AnimatedSphere />
        <SmallSpheres />
        <RecycleRing />
      </Canvas>
    </div>
  );
}
