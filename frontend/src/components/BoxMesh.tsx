/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-const */
/* eslint-disable react/no-unknown-property */

import { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Euler, Vector3 } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    cardboard_box_01: THREE.Mesh;
  };
  materials: {
    ['default']: THREE.MeshStandardMaterial;
    cardboard_box_01: THREE.MeshStandardMaterial;
  };
};

const randomPosition = () => {
  const x = 6 * (Math.random() - 0.5);
  const z = 3 * (Math.random() - 0.5);
  return [x, 0.15, z] as Vector3;
};

const randomRotation = () => {
  const y = 2* Math.PI * (Math.random() - 0.0);
  return [0, y, 0] as Euler;
}

export function BoxMesh() {
  const { nodes, materials } = useGLTF("cardboard_box_01_4k.glb") as GLTFResult;
  const [ position ] = useState( randomPosition() );
  const [ rotation ] = useState( randomRotation() );

  return (
    <group dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cardboard_box_01.geometry}
        material={materials.cardboard_box_01}
        position={position}
        rotation={rotation}
      />
    </group>
  );
}

useGLTF.preload("cardboard_box_01_4k.glb");