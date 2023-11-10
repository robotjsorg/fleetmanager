/* eslint-disable react/no-unknown-property */
import { useRef, useContext, useState, useEffect } from "react";

import { Euler, useFrame, Vector3 } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { GLTF } from "three-stdlib";

import { guiSelectionContext } from "../context/guiSelectionContext";

const isLocalhost = location.hostname === "localhost" || location.hostname.startsWith("192.168");
const localFilepath = "../../assets/gltf/";
const filename = "abb_irb52_7_120.glb";
const filepath = isLocalhost ? localFilepath + filename : filename;

type GLTFResult = GLTF & {
  nodes: {
    abb_irb52_7_120: THREE.Mesh;
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

const randomPosition = () => {
  const x = 4 * (Math.random() - 0.5);
  const z = 2 * (Math.random() - 0.5);
  return [x, 0, z] as Vector3;
};

const randomRotation = () => {
  const z = 2 * Math.PI * (Math.random() - 0.0);
  return [-Math.PI / 2, 0, z] as Euler;
}

export const Mesh_abb_irb52_7_120 = ({
  robotid,
  selected
} : {
  robotid: string;
  selected: boolean;
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes, materials } = useGLTF( filepath ) as GLTFResult;
  const { setGuiSelection } = useContext( guiSelectionContext );
  const [ hovered, hover ] = useState( false );
  const [ position ] = useState( randomPosition() );
  const [ rotation ] = useState( randomRotation() );
  const [ jointAngles ] = useState( [ 0, 0, 0, 0, 0, 0 ] );

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useFrame((_state, delta) => (
    jointAngles[0] += delta,
    jointAngles[1] += delta,
    jointAngles[2] += delta,
    jointAngles[3] += delta,
    jointAngles[4] += delta,
    jointAngles[5] += delta,
    ref.current.children[0].rotation.z = jointAngles[0],
    ref.current.children[0].children[0].rotation.y = jointAngles[1],
    ref.current.children[0].children[0].children[0].rotation.y = jointAngles[2],
    ref.current.children[0].children[0].children[0].children[0].rotation.x = jointAngles[3],
    ref.current.children[0].children[0].children[0].children[0].children[0].rotation.y = jointAngles[4],
    ref.current.children[0].children[0].children[0].children[0].children[0].children[0].rotation.x = jointAngles[5]
  ));

  return (
    <Select enabled={ selected || hovered }>
      <group dispose={null}>
        <mesh
          ref={ref}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onClick={(e) => (e.stopPropagation(), setGuiSelection(robotid))}
          castShadow
          receiveShadow
          geometry={nodes.base_link.geometry}
          material={materials.gkmodel0_base_link_geom0}
          position={position}
          rotation={rotation}
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

useGLTF.preload( filepath );