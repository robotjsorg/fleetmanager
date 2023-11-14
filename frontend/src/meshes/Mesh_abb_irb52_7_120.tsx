/* eslint-disable react/no-unknown-property */
import { useRef, useContext, useState, useEffect } from "react";

import { Euler, Vector3, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { GLTF } from "three-stdlib";
import { useSpring, animated, config } from "@react-spring/three";

import { guiSelectionContext } from "../context/guiSelectionContext";
import { RobotContext } from "../context/robotContext";
import { IRobot } from "../@types/robot";

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
    ["default"]: THREE.MeshStandardMaterial;
    gkmodel0_base_link_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_1_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_2_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_3_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_4_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_5_geom0: THREE.MeshStandardMaterial;
    gkmodel0_link_6_geom0: THREE.MeshStandardMaterial;
  };
};

export const randomJointAngles = () => {
  const jointLimits = [[-180*0.0174533, 180*0.0174533], [-63*0.0174533, 110*0.0174533], [-235*0.0174533, 55*0.0174533], [-200*0.0174533, 200*0.0174533], [-115*0.0174533, 115*0.0174533], [-400*0.0174533, 400*0.0174533]];
  const angles = [0, 0, 0, 0, 0, 0];
  for( let i = 0; i < jointLimits.length; i++ ){
    const big = jointLimits[i][1];
    const small = jointLimits[i][0];
    angles[ i ] = Math.random() * ( big - small ) - small;
  }
  return (
    angles
  );
}

export const Mesh_abb_irb52_7_120 = ({
  robot,
  selected
} : {
  robot: IRobot;
  selected: boolean;
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes, materials } = useGLTF( filepath ) as GLTFResult;
  const { tasks } = useContext( RobotContext );
  const { setGuiSelection } = useContext( guiSelectionContext );
  const [ hovered, hover ] = useState( false );
  const [ position ] = useState( robot.lastKnownPosition as Vector3 );
  const [ rotation ] = useState( robot.lastKnownRotation as Euler );
  const [ jointAngles, setJointAngles ] = useState( robot.lastKnownJointAngles );
  const filteredTasks = tasks.filter(( task ) => ( task.robotid == robot.id ));
  const containsSpinAroundDesc = filteredTasks.reduce((contains, task) => {return contains || (task.description == "Spin Around" && !task.completed)}, false);
  const containsRandomPositionsDesc = filteredTasks.reduce((contains, task) => {return contains || task.description == "Random Positions" && !task.completed}, false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  const handleTasks = (delta: number) => {
    if ( containsSpinAroundDesc ) {
      const newJointAngles = jointAngles;
      newJointAngles[0] += delta;
      newJointAngles[1] += delta;
      newJointAngles[2] += delta;
      newJointAngles[3] += delta;
      newJointAngles[4] += delta;
      newJointAngles[5] += delta;
      setJointAngles( newJointAngles );
    } else if ( containsRandomPositionsDesc ) {
      setJointAngles( randomJointAngles() );
    } // else Idle
  }

  useFrame((_state, delta) => (
    handleTasks(delta),
    ref.current.children[0].rotation.z = jointAngles[0],
    ref.current.children[0].children[0].rotation.y = jointAngles[1],
    ref.current.children[0].children[0].children[0].rotation.y = jointAngles[2],
    ref.current.children[0].children[0].children[0].children[0].rotation.x = jointAngles[3],
    ref.current.children[0].children[0].children[0].children[0].children[0].rotation.y = jointAngles[4],
    ref.current.children[0].children[0].children[0].children[0].children[0].children[0].rotation.x = jointAngles[5]
  ));

  const { scale } = useSpring({
    scale: selected ? 1.2 : 1,
    config: config.wobbly
  });

  const shadows = false;

  return (
    <Select enabled={ selected || hovered }>
      <group dispose={null}>
        <animated.mesh
          ref={ref}
          scale={scale}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onClick={(e) => (e.stopPropagation(), setGuiSelection(robot.id))}
          geometry={nodes.base_link.geometry}
          material={materials.gkmodel0_base_link_geom0}
          position={position}
          rotation={rotation}
          castShadow={shadows}
          receiveShadow={shadows}>
          <mesh
            geometry={nodes.link_1.geometry}
            material={materials.gkmodel0_link_1_geom0}
            position={[0, 0, 0.486]}
            castShadow={shadows}
            receiveShadow={shadows}>
            <mesh
              geometry={nodes.link_2.geometry}
              material={materials.gkmodel0_link_2_geom0}
              position={[0.15, 0, 0]}
              castShadow={shadows}
              receiveShadow={shadows}>
              <mesh
                geometry={nodes.link_3.geometry}
                material={materials.gkmodel0_link_3_geom0}
                position={[0, 0, 0.475]}
                castShadow={shadows}
                receiveShadow={shadows}>
                <mesh
                  geometry={nodes.link_4.geometry}
                  material={materials.gkmodel0_link_4_geom0}
                  position={[0.6, 0, 0]}
                  castShadow={shadows}
                  receiveShadow={shadows}>
                  <mesh
                    geometry={nodes.link_5.geometry}
                    material={materials.gkmodel0_link_5_geom0}
                    castShadow={shadows}
                    receiveShadow={shadows}>
                    <mesh
                      geometry={nodes.link_6.geometry}
                      material={materials.gkmodel0_link_6_geom0}
                      position={[0.065, 0, 0]}
                      castShadow={shadows}
                      receiveShadow={shadows}/>
                  </mesh>
                </mesh>
              </mesh>
            </mesh>
          </mesh>
        </animated.mesh>
      </group>
    </Select>
  );
}

useGLTF.preload( filepath );