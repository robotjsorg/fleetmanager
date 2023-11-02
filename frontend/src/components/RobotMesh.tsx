import { useRef, useState, useContext } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber"; // Vector3
// import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import selectionContext from "../context/selectionContext";

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

const RobotMesh = (props: ThreeElements['mesh']) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [ hovered, hover ] = useState(false);
  
  const { nodes, materials } = useGLTF("abb_irb52_7_120.gltf") as GLTFResult;
  const { setSelection } = useContext(selectionContext);

  // const state = useThree();
  // const viewport = useThree((state) => state.viewport)

  // useEffect(() => {
  //   console.log(ref.current)
  //   console.log(state)
  //   console.log(viewport)
  // })

  // TODO: Setup animation joint limits
  // const jointLimits = [[-180, 180], [-63, 110], [-235, 55], [-200, 200], [-115, 115], [-400, 400]];
  // TODO: Setup Tween animations

  useFrame((_state, delta) => (
    ref.current.children[0].rotation.z += delta,
    ref.current.children[0].children[0].rotation.y += delta,
    ref.current.children[0].children[0].children[0].rotation.y += delta,
    ref.current.children[0].children[0].children[0].children[0].rotation.x += delta,
    ref.current.children[0].children[0].children[0].children[0].children[0].rotation.y += delta,
    ref.current.children[0].children[0].children[0].children[0].children[0].children[0].rotation.x += delta
  ));

  return (
    <group dispose={null}>
      <mesh
        {...props}
        ref={ref}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={(_e) => hover(false)}
        onClick={(e) => (e.stopPropagation(), setSelection(ref.current.uuid))}
        castShadow
        receiveShadow
        geometry={nodes.base_link.geometry}
        material={materials.gkmodel0_base_link_geom0}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={hovered ? 1.1 : 1}
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
  );
}

useGLTF.preload("abb_irb52_7_120.gltf");

export default RobotMesh;