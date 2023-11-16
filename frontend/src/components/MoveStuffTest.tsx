/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Suspense, useState } from 'react';

import { Canvas, Euler, Vector3, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, useGLTF, useCursor, Text } from '@react-three/drei';
import { GLTF } from "three-stdlib";
import { proxy, useSnapshot } from 'valtio';
import { useMantineContext } from '@mantine/core';

const isLocalhost = location.hostname === "localhost" || location.hostname.startsWith("192.168");
const localFilepath = "../../assets/gltf/";
const filename = "cardboard_box_01_4k.gltf";
const filepath = isLocalhost ? localFilepath + filename : filename;

const randomPosition = () => {
  const x = 6 * (Math.random() - 0.5);
  const z = 3 * (Math.random() - 0.5);
  return [x, 0.15, z] as Vector3;
};

const randomRotation = () => {
  const y = 2* Math.PI * (Math.random() - 0.0);
  return [0, y, 0] as Euler;
};

type GLTFResult = GLTF & {
  nodes: {
    cardboard_box_01: THREE.Mesh;
  };
  materials: {
    ["default"]: THREE.MeshStandardMaterial;
    cardboard_box_01: THREE.MeshStandardMaterial;
  };
};

const state = proxy({ current: ""});

function Model({ ...props }) {
  const { nodes, materials } = useGLTF( filepath ) as GLTFResult;

  const SHADOWS = false;
  const [hovered, setHovered] = useState( false );
  useCursor( hovered );
  return (
    <mesh
      onClick={(e) => (e.stopPropagation(), (state.current = props.name as string))}
      onPointerMissed={(e) => e.type === 'click' && (state.current = "")}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      name={props.name}
      position={props.position}
      rotation={props.rotation}
      geometry={nodes.cardboard_box_01.geometry}
      material={materials.cardboard_box_01}
      castShadow={SHADOWS}
      receiveShadow={SHADOWS}
      scale={0.8}
      {...props}
      dispose={null}
    />
  );
}

export default function MoveStuffTest() {
  const theme = useMantineContext();
  const [ position1, setPosition1 ] = useState( randomPosition() );
  const [ rotation1, setRotation1 ] = useState( randomRotation() );
  // const [ position2, setPosition2 ] = useState( randomPosition() );
  // const [ rotation2, setRotation2 ] = useState( randomRotation() );
  // const [ position3, setPosition3 ] = useState( randomPosition() );
  // const [ rotation3, setRotation3 ] = useState( randomRotation() );

  function Controls() {
    const snap = useSnapshot(state);
    const scene = useThree((state) => state.scene);
    return (
      <>
        {snap.current && <TransformControls showY={false} object={scene.getObjectByName(snap.current)} mode={"translate"} 
          onMouseUp={()=>{setPosition1(scene.getObjectByName(snap.current)?.position as Vector3)}}/>}
        {snap.current && <TransformControls showX={false} showZ={false} object={scene.getObjectByName(snap.current)} mode={"rotate"} 
          onMouseUp={()=>{setRotation1(scene.getObjectByName(snap.current)?.rotation as Euler)}}/>}
        <OrbitControls makeDefault screenSpacePanning={ false } enableZoom={ false } maxPolarAngle={Math.PI/2} target={[0, 1, 0]}/>
      </>
    );
  }

  return (
    <Canvas camera={{ position: [0, 4, 1], fov: 50 }} dpr={[1, 2]} onPointerMissed={(e) => e.type === 'click' && (state.current = "")}>
      <directionalLight intensity={2} position={ [5, 5, 5] } />
      <directionalLight intensity={2} position={ [5, 5, -5] } />
      <directionalLight intensity={2} position={ [-5, 5, 5] } />
      <directionalLight intensity={2} position={ [-5, 5, -5] } />
      <gridHelper args={[8, 8, theme.colorScheme == "dark" ? "white" : "black", "gray"]} position={[0, -0.02, 0]} rotation={[0, 0, 0]} />
      <axesHelper args={[1]} position={[-0.01, -0.01, -0.01]} />
      <Text color={"red"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.9, 0, -0.1]} fontSize={0.12}>X</Text>
      <Text color={"blue"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.1, 0, 0.9]} fontSize={0.12}>Z</Text>
      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <Model name="Box1" position={position1} rotation={rotation1} />
          {/* <Model name="Box2" position={position2} rotation={rotation2} />
          <Model name="Box3" position={position3} rotation={rotation3} /> */}
        </group>
      </Suspense>
      <Controls />
    </Canvas>
  );
}
