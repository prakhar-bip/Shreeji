import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";

export type RoomWall = "front" | "left" | "right" | "back";
export type RoomWallColors = Record<RoomWall, string>;

type MoveState = { forward: number; right: number };

const START_POSITION = new THREE.Vector3(0, 1.65, 4);
const FORWARD = new THREE.Vector3();
const RIGHT = new THREE.Vector3();
const MOVE = new THREE.Vector3();

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

function WalkCamera({ movement, resetSignal }: { movement: React.RefObject<MoveState>; resetSignal: number }) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(-0.04);
  const dragging = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const keys = useRef(new Set<string>());

  useEffect(() => {
    camera.position.copy(START_POSITION);
    camera.rotation.order = "YXZ";
    camera.rotation.set(pitch.current, yaw.current, 0);
  }, [camera, resetSignal]);

  useEffect(() => {
    const canvas = gl.domElement;
    const onPointerDown = (event: PointerEvent) => {
      dragging.current = true;
      pointer.current = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      const dx = event.clientX - pointer.current.x;
      const dy = event.clientY - pointer.current.y;
      pointer.current = { x: event.clientX, y: event.clientY };
      yaw.current -= dx * 0.004;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.003, -0.72, 0.72);
    };
    const onPointerUp = () => {
      dragging.current = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
        keys.current.add(event.code);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => keys.current.delete(event.code);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gl]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const pressed = keys.current;
    const forward =
      movement.current.forward +
      (pressed.has("KeyW") || pressed.has("ArrowUp") ? 1 : 0) -
      (pressed.has("KeyS") || pressed.has("ArrowDown") ? 1 : 0);
    const strafe =
      movement.current.right +
      (pressed.has("KeyD") || pressed.has("ArrowRight") ? 1 : 0) -
      (pressed.has("KeyA") || pressed.has("ArrowLeft") ? 1 : 0);

    camera.rotation.set(pitch.current, yaw.current, 0);
    camera.getWorldDirection(FORWARD);
    FORWARD.y = 0;
    FORWARD.normalize();
    RIGHT.crossVectors(FORWARD, camera.up).normalize();
    MOVE.set(0, 0, 0).addScaledVector(FORWARD, forward).addScaledVector(RIGHT, strafe);
    if (MOVE.lengthSq() > 0) {
      MOVE.normalize().multiplyScalar(2.35 * delta);
      camera.position.add(MOVE);
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -4.35, 4.35);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -4.35, 4.35);
    }
    camera.position.y = 1.65;
  });

  return null;
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
  movement,
  resetSignal,
}: {
  colors: RoomWallColors;
  selectedWall: RoomWall;
  onSelectWall: (wall: RoomWall) => void;
  movement: React.RefObject<MoveState>;
  resetSignal: number;
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

      <WalkCamera movement={movement} resetSignal={resetSignal} />
    </>
  );
}

export default function Room3D({
  colors,
  selectedWall,
  onSelectWall,
}: {
  colors: RoomWallColors;
  selectedWall: RoomWall;
  onSelectWall: (wall: RoomWall) => void;
}) {
  const movement = useRef<MoveState>({ forward: 0, right: 0 });
  const [resetSignal, setResetSignal] = useState(0);

  const hold = (axis: keyof MoveState, value: number) => () => {
    movement.current[axis] = value;
  };
  const release = (axis: keyof MoveState) => () => {
    movement.current[axis] = 0;
  };

  return (
    <div className="relative aspect-[4/3] min-h-[20rem] w-full overflow-hidden bg-sand sm:min-h-[28rem]" aria-label="Interactive 3D room color preview">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.65, 4], fov: 68, near: 0.1, far: 30 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <RoomScene colors={colors} selectedWall={selectedWall} onSelectWall={onSelectWall} movement={movement} resetSignal={resetSignal} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-end justify-between gap-2">
        <div className="pointer-events-auto grid grid-cols-3 gap-1 rounded-md border border-border bg-background/90 p-1 shadow-soft backdrop-blur-sm" aria-label="Walk around room">
          <span />
          <Button size="icon" variant="outline" aria-label="Walk forward" className="h-10 w-10 touch-none" onPointerDown={hold("forward", 1)} onPointerUp={release("forward")} onPointerLeave={release("forward")}>
            ↑
          </Button>
          <span />
          <Button size="icon" variant="outline" aria-label="Walk left" className="h-10 w-10 touch-none" onPointerDown={hold("right", -1)} onPointerUp={release("right")} onPointerLeave={release("right")}>
            ←
          </Button>
          <Button size="icon" variant="outline" aria-label="Walk backward" className="h-10 w-10 touch-none" onPointerDown={hold("forward", -1)} onPointerUp={release("forward")} onPointerLeave={release("forward")}>
            ↓
          </Button>
          <Button size="icon" variant="outline" aria-label="Walk right" className="h-10 w-10 touch-none" onPointerDown={hold("right", 1)} onPointerUp={release("right")} onPointerLeave={release("right")}>
            →
          </Button>
        </div>
        <Button type="button" variant="secondary" size="sm" className="pointer-events-auto shadow-soft" onClick={() => setResetSignal((value) => value + 1)}>
          Reset view
        </Button>
      </div>
      <p className="pointer-events-none absolute left-2 top-2 rounded-md bg-background/90 px-2 py-1 text-[11px] font-bold shadow-soft backdrop-blur-sm">
        Drag to look · Tap a wall to paint
      </p>
    </div>
  );
}

useGLTF.preload("/models/room/sofa.glb");
useGLTF.preload("/models/room/coffee-table.glb");
useGLTF.preload("/models/room/plant.glb");
useGLTF.preload("/models/room/rug.glb");
useGLTF.preload("/models/room/television.glb");
useGLTF.preload("/models/room/bookcase.glb");
useGLTF.preload("/models/room/lamp.glb");
