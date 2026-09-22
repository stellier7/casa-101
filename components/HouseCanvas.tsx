"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  MASSING_COLORS,
  buildMassing,
  extrudeScale,
  lerpCamera,
  type MassingVolume,
} from "@/lib/massing";

const FLAT_ROLES = new Set(["lot", "drive", "deck", "pool"]);

type HouseCanvasProps = {
  progressRef: RefObject<number>;
  invalidateRef: RefObject<(() => void) | null>;
};

function VolumeMesh({ volume }: { volume: MassingVolume }) {
  const roughness = volume.role === "pool" ? 0.12 : 0.86;
  const metalness = volume.role === "pool" ? 0.18 : 0.02;
  return (
    <mesh position={volume.position} castShadow={false} receiveShadow={false}>
      <boxGeometry args={volume.size} />
      <meshStandardMaterial
        color={volume.color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

function RoofSlab({ volume }: { volume: MassingVolume }) {
  const [x, y, z] = volume.position;
  const [w, h, d] = volume.size;
  return (
    <mesh position={[x, y + h / 2 + 0.14, z]}>
      <boxGeometry args={[w + 0.45, 0.28, d + 0.45]} />
      <meshStandardMaterial
        color={MASSING_COLORS.roof}
        roughness={0.92}
        metalness={0.04}
      />
    </mesh>
  );
}

function Scene({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree();
  const extrudeRef = useRef<THREE.Group>(null);
  const volumes = useMemo(() => buildMassing(), []);
  const flat = volumes.filter((v) => FLAT_ROLES.has(v.role));
  const rising = volumes.filter((v) => !FLAT_ROLES.has(v.role));

  useFrame(() => {
    const p = progressRef.current;
    const cam = lerpCamera(p);
    camera.position.set(cam.position[0], cam.position[1], cam.position[2]);
    camera.lookAt(cam.lookAt[0], cam.lookAt[1], cam.lookAt[2]);
    if (extrudeRef.current) {
      extrudeRef.current.scale.y = extrudeScale(p);
    }
  });

  return (
    <>
      <color attach="background" args={[MASSING_COLORS.night]} />
      <fog attach="fog" args={[MASSING_COLORS.night, 70, 190]} />
      <hemisphereLight args={["#f0e4cf", "#1c1814", 0.75]} />
      <directionalLight
        position={[24, 36, 8]}
        intensity={1.15}
        color="#ffe4c2"
      />
      <directionalLight
        position={[-18, 10, 40]}
        intensity={0.28}
        color="#7aa0c4"
      />

      {flat.map((volume) => (
        <VolumeMesh key={volume.id} volume={volume} />
      ))}

      <group ref={extrudeRef} scale={[1, 0.03, 1]}>
        {rising.map((volume) => (
          <group key={volume.id}>
            <VolumeMesh volume={volume} />
            {volume.role === "garage" ||
            volume.role === "upper" ||
            volume.role === "pavilion" ||
            volume.role === "main" ? (
              <RoofSlab volume={volume} />
            ) : null}
          </group>
        ))}
      </group>
    </>
  );
}

export default function HouseCanvas({
  progressRef,
  invalidateRef,
}: HouseCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop="demand"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ fov: 36, near: 0.1, far: 260, position: [28, 64, -6] }}
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
      onCreated={({ gl, invalidate }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        invalidateRef.current = invalidate;
        invalidate();
        requestAnimationFrame(() => invalidate());
      }}
    >
      <VisibilityGuard />
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}

function VisibilityGuard() {
  const { gl } = useThree();
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) gl.setAnimationLoop(null);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [gl]);
  return null;
}
