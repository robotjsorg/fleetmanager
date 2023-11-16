/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Euler, Vector3 } from "@react-three/fiber";

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

export function Mesh_cardboard_box_01() {
  const { nodes, materials } = useGLTF( filepath ) as GLTFResult;
  const [ position ] = useState( randomPosition() );
  const [ rotation ] = useState( randomRotation() );

  const SHADOWS = false;

  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.cardboard_box_01.geometry}
        material={materials.cardboard_box_01}
        position={position}
        rotation={rotation}
        castShadow={SHADOWS}
        receiveShadow={SHADOWS}
        scale={0.8}
      />
    </group>
  );
}

useGLTF.preload( filepath );