/* eslint-disable react/no-unknown-property */
import { useRef, useContext, useState } from "react";
import { useFrame, Vector3 } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { GLTF } from "three-stdlib";

import { selectionContext } from "../context/selectionContext";

type GLTFResult = GLTF & {
  nodes: {
    Robot: THREE.Mesh;
    base_link: THREE.Mesh;
    link_1: THREE.Mesh;
    link_2: THREE.Mesh;
    link_3: THREE.Mesh;
    link_4: THREE.Mesh;
    link_5: THREE.Mesh;
    link_6: THREE.Mesh;
  };
  materials: {
    ['default']: THREE.MeshStandardMaterial;
    gkmodel0_base_link_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_1_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_2_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_3_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_4_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_5_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_6_geom0: THREE.MeshStandardMaterial;
  };
};

interface RobotMeshProps {
  position: Vector3;
  robotid: string;
  selected: boolean;
}

export const RobotMesh = (props: RobotMeshProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes, materials } = useGLTF("../abb_irb52_7_120.gltf") as GLTFResult;
  const { setSelection } = useContext(selectionContext);
  const [hovered, hover] = useState(false);

  useFrame((_state, delta) => (
    ref.current.children[0].rotation.z += delta,
    ref.current.children[0].children[0].rotation.y += delta,
    ref.current.children[0].children[0].children[0].rotation.y += delta,
    ref.current.children[0].children[0].children[0].children[0].rotation.x += delta,
    ref.current.children[0].children[0].children[0].children[0].children[0].rotation.y += delta,
    ref.current.children[0].children[0].children[0].children[0].children[0].children[0].rotation.x += delta
  ));

  return (
    <Select enabled={props.selected || hovered}>
      <group dispose={null}>
        <mesh
          {...props}
          ref={ref}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onClick={(e) => (e.stopPropagation(), setSelection(props.robotid))}
          castShadow
          receiveShadow
          geometry={nodes.base_link.geometry}
          material={materials.gkmodel0_base_link_geom0}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.link_1.geometry}
            material={materials.gkmodel0_link_1_geom0}
            position={[0, 0, 0.486]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.link_2.geometry}
              material={materials.gkmodel0_link_2_geom0}
              position={[0.15, 0, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.link_3.geometry}
                material={materials.gkmodel0_link_3_geom0}
                position={[0, 0, 0.475]}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.link_4.geometry}
                  material={materials.gkmodel0_link_4_geom0}
                  position={[0.6, 0, 0]}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.link_5.geometry}
                    material={materials.gkmodel0_link_5_geom0}
                  >
                    <mesh
                      castShadow
                      receiveShadow
                      geometry={nodes.link_6.geometry}
                      material={materials.gkmodel0_link_6_geom0}
                      position={[0.065, 0, 0]}
                    />
                  </mesh>
                </mesh>
              </mesh>
            </mesh>
          </mesh>
        </mesh>
      </group>
    </Select>
  );
}

useGLTF.preload("../abb_irb52_7_120.gltf");