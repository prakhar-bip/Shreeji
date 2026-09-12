import { Suspense, useMemo } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export type RoomWall = "front" | "left" | "right" | "back";
export type RoomWallColors = Record<RoomWall, string>;

function FurnitureModel({
  path,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return copy;
  }, [scene]);

  return <primitive object={clone} position={position} rotation={rotation} scale={scale} />;
}

function PaintWall({
  wall,
  position,
  size,
  color,
  selected,
  onSelect,
}: {
  wall: RoomWall;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  selected: boolean;
  onSelect: (wall: RoomWall) => void;
}) {
  const choose = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > 5) return;
    event.stopPropagation();
    onSelect(wall);
  };

  return (
    <mesh position={position} receiveShadow onClick={choose}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        emissive={selected ? color : "#000000"}
        emissiveIntensity={selected ? 0.08 : 0}
      />
    </mesh>
  );
}

function RoomScene({
  colors,
  selectedWall,
  onSelectWall,
}: {
  colors: RoomWallColors;
  selectedWall: RoomWall;
  onSelectWall: (wall: RoomWall) => void;
}) {
  return (
    <>
      <color attach="background" args={["#ece6dc"]} />
      <fog attach="fog" args={["#ece6dc", 11, 19]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[2, 7, 4]} intensity={1.55} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment>
        <Lightformer intensity={2.2} position={[0, 4, 2]} scale={[7, 7, 1]} />
        <Lightformer intensity={1.1} color="#d7b98b" position={[-4, 2, 0]} rotation-y={Math.PI / 2} scale={[7, 3, 1]} />
      </Environment>

      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[10, 0.16, 10]} />
        <meshStandardMaterial color="#8f6946" roughness={0.78} />
      </mesh>
      <mesh position={[0, 4.58, 0]} receiveShadow>
        <boxGeometry args={[10, 0.16, 10]} />
        <meshStandardMaterial color="#f3eee6" roughness={0.92} />
      </mesh>
      
      <PaintWall wall="front" position={[0, 2.25, -5]} size={[10, 4.5, 0.14]} color={colors.front} selected={selectedWall === "front"} onSelect={onSelectWall} />
      <PaintWall wall="back" position={[0, 2.25, 5]} size={[10, 4.5, 0.14]} color={colors.back} selected={selectedWall === "back"} onSelect={onSelectWall} />
      <PaintWall wall="left" position={[-5, 2.25, 0]} size={[0.14, 4.5, 10]} color={colors.left} selected={selectedWall === "left"} onSelect={onSelectWall} />
      <PaintWall wall="right" position={[5, 2.25, 0]} size={[0.14, 4.5, 10]} color={colors.right} selected={selectedWall === "right"} onSelect={onSelectWall} />

      <group>
        <FurnitureModel path="/models/room/sofa.glb" position={[-1.65, 0, -2.6]} rotation={[0, 0.15, 0]} scale={1.25} />
        <FurnitureModel path="/models/room/coffee-table.glb" position={[0.25, 0, -1.55]} scale={1.15} />
        <FurnitureModel path="/models/room/rug.glb" position={[0.2, 0.02, -1.5]} scale={1.5} />
        <FurnitureModel path="/models/room/bookcase.glb" position={[3.55, 0, -4.45]} rotation={[0, Math.PI, 0]} scale={1.15} />
        <FurnitureModel path="/models/room/television.glb" position={[0.4, 1.35, -4.82]} rotation={[0, Math.PI, 0]} scale={1.3} />
        <FurnitureModel path="/models/room/plant.glb" position={[-4.15, 0, -4.25]} scale={1.2} />
        <FurnitureModel path="/models/room/lamp.glb" position={[3.8, 0, -2.9]} scale={1.25} />
      </group>

      <OrbitControls 
        makeDefault 
        enablePan={false}
        enableZoom={true} 
        minDistance={0.1}
        maxDistance={4}
        target={[0, 1.65, -0.01]} 
      />
    </>
  );
}

export default function Room3D({
  colors,
  selectedWall,
  onSelectWall,
  className,
}: {
  colors: RoomWallColors;
  selectedWall: RoomWall;
  onSelectWall: (wall: RoomWall) => void;
  className?: string | undefined;
}) {
  return (
    <div className={className || "relative aspect-[4/3] min-h-[20rem] w-full overflow-hidden bg-sand sm:min-h-[28rem] touch-none cursor-move rounded-md"} aria-label="Interactive 3D room color preview">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.65, 0.1], fov: 75, near: 0.1, far: 30 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <RoomScene colors={colors} selectedWall={selectedWall} onSelectWall={onSelectWall} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="rounded-full bg-background/80 px-4 py-2 text-xs font-medium backdrop-blur-sm shadow-sm">
          Swipe to look around
        </div>
      </div>
    </div>
  );
}
