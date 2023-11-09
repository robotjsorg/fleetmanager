/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-const */
/* eslint-disable react/no-unknown-property */
import { useRef, useContext, useState } from "react";

import { Euler, useFrame, Vector3 } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { GLTF } from "three-stdlib"; //, ColladaLoader

// import "@tweenjs/tween.js";
// import createjs from "@types/tweenjs";

import { guiSelectionContext } from "../context/guiSelectionContext";

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

export const RobotMesh = ({
  robotid,
  task,
  selected
} : {
  robotid: string;
  task: string;
  selected: boolean;
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  // ("abb_irb52_7_120.gltf")
  const { nodes, materials } = useGLTF("../../assets/gltf/abb_irb52_7_120.gltf") as GLTFResult;
  const { setGuiSelection } = useContext( guiSelectionContext );
  const [ hovered, hover ] = useState( false );
  const [ position ] = useState( randomPosition() );
  const [ rotation ] = useState( randomRotation() );
  const [ jointAngles ] = useState( [ 0, 0, 0, 0, 0, 0 ] );

  // let kinematics: object = {joints: null}
  // let kinematicsTween;
  // let tweenParameters = {};
  // const loader = new ColladaLoader();
  // loader.load( './dae/abb_irb52_7_120.dae', function ( collada ) {
  //   let dae = collada.scene;
  //   dae.traverse( function ( child ) {
  //     if ( child instanceof THREE.Mesh ) {
  //       // model does not have normals
  //       child.material.flatShading = true;
  //     }
  //   } );
  //   dae.scale.x = dae.scale.y = dae.scale.z = 10.0;
  //   dae.updateMatrix();
  //   kinematics = collada.kinematics; // loader.jointIndex;
  //   // init(); // deprecated to react-three-fiber
  //   // animate(); // deprecated to useFrame()
  //   onload
  // });
  // const setupTween = () => {
  //   const duration = Math.random() * 4000 + 1000;
  //   let target = {};
  //   // array1.forEach((element) => console.log(element));
  //   kinematics.joints.forEach(( joint )=>(
  //     joint.hasOwnProperty
  //     if ( joint.hasOwnProperty() ) {
  //       if ( ! kinematics.joints[ prop ].static ) {
  //         // let joint = kinematics.joints[ prop ];
  //         let old = tweenParameters[ prop ];
  //         let position = old ? old : joint.zeroPosition;
  //         tweenParameters[ prop ] = position;
  //         target[ prop ] = Math.random() * (joint.limits.max - joint.limits.min) + joint.limits.min;
  //       }
  //     }
  //   ));
  // };
  // kinematicsTween = Tween( tweenParameters ).to( target, duration ).easing( Easing.Quadratic.Out );
  // kinematicsTween.onUpdate( function() {
  //   for ( let prop in kinematics.joints ) {
  //     if ( kinematics.joints.hasOwnProperty( prop ) ) {
  //       if ( ! kinematics.joints[ prop ].static ) {
  //         kinematics.setJointValue( prop, this[ prop ] );
  //       }
  //     }
  //   }
  // });
  // kinematicsTween.start();
  // setTimeout( setupTween, duration );

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

// ("abb_irb52_7_120.gltf")
useGLTF.preload("../../assets/gltf/abb_irb52_7_120.gltf");