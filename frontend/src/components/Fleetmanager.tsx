/* eslint-disable react/no-unknown-property */
import { useContext, useEffect, useState } from "react";
import { useMantineContext } from "@mantine/core";

import { Canvas, useThree } from "@react-three/fiber";
import { Text, OrbitControls, TransformControls } from "@react-three/drei";
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing";

import { IRobot } from "../@types/robot";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { locSelectionContext } from "../context/locSelectionContext";
import { moveRobotContext } from "../context/moveRobotContext";

import { Mesh_abb_irb52_7_120 } from "../meshes/Mesh_abb_irb52_7_120";
import { Mesh_cardboard_box_01 } from "../meshes/Mesh_cardboard_box_01";

export const Fleetmanager = () => {
  const theme = useMantineContext();
  const { robots } = useContext( RobotContext );
  const { locSelection } = useContext( locSelectionContext );
  const { guiSelection, setGuiSelection } = useContext( guiSelectionContext );
  const { moveRobot } = useContext( moveRobotContext );

  const [ locationsRobots, setLocationRobots ] = useState<IRobot[]>([]);
  useEffect(() => {
    setLocationRobots( robots.filter(( robot )=>( robot.locationid == locSelection )) );
  }, [locSelection, robots]);

  // const [ selectedRobot, setSelectedRobot ] = useState<IRobot>();
  // useEffect(() => {
  //   setSelectedRobot( robots.filter(( robot )=>( robot.locationid == guiSelection ))[0] );
  // }, [guiSelection, robots]);

  const updatePosition=()=>{
    console.log("updatePosition");
  }
  const updateRotation=()=>{
    console.log("updatePosition");
  }

  const Controls = () => {
    const scene = useThree((state) => (state.scene));
    const object = scene.getObjectByName(guiSelection);

    return (
      <>
        {guiSelection != "" && moveRobot && <TransformControls object={object} showY={false} mode="translate" onMouseUp={updatePosition} />}
        {guiSelection != "" && moveRobot && <TransformControls object={object} showX={false} showZ={false} mode="rotate" onMouseUp={updateRotation} />}
      </>
    );
  };

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 4, 1], near: 0.01, far: 20 }}
      onPointerMissed={() => setGuiSelection("no selection")}>
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline visibleEdgeColor={theme.colorScheme == "dark" ? "white" : "blue"} blur edgeStrength={100} width={1000} />
        </EffectComposer>
        {locationsRobots.map((robot) => (
          <Mesh_abb_irb52_7_120 key={robot.id} robot={robot} selected={guiSelection == robot.id ? true : false} />
        ))}
      </Selection>
      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />
      
      <gridHelper args={[8, 8, theme.colorScheme == "dark" ? "white" : "black", "gray"]} position={[0, -0.02, 0]} rotation={[0, 0, 0]} />
      <axesHelper args={[1]} position={[-0.01, -0.01, -0.01]} />
      <Text color={"red"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.9, 0, -0.1]} fontSize={0.12}>X</Text>
      <Text color={"blue"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.1, 0, 0.9]} fontSize={0.12}>Z</Text>

      <directionalLight intensity={2} position={ [5, 5, 5] } />
      <directionalLight intensity={2} position={ [5, 5, -5] } />
      <directionalLight intensity={2} position={ [-5, 5, 5] } />
      <directionalLight intensity={2} position={ [-5, 5, -5] } />

      <Controls />
      {/* autoRotate={ true } */}
      <OrbitControls makeDefault screenSpacePanning={ false } enableZoom={ false } maxPolarAngle={Math.PI/2} enablePan={ true } target={ [0, 1, 0] } />

      {/* <Environment background ground={{ height: 10, radius: 43, scale: 6 }}
        preset={ locSelection == "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" ? "warehouse" 
        : locSelection == "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d" ? "apartment" 
        : "city" } /> */}
      {/* <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 10, 10]}>
        <planeGeometry />
        <meshBasicMaterial color="#d2d2d2" />
      </mesh> */}
      {/* <ambientLight intensity={1} /> */}
      {/* <ContactShadows scale={ 150 } position={ [0.33, -0.33, 0.33] } opacity={ 1.5 } /> */}
    </Canvas>
  );
};