/* eslint-disable react/no-unknown-property */
import { useContext, useState } from "react";
import { useMantineContext } from "@mantine/core";

import { Canvas, Vector3 } from "@react-three/fiber";
import { Grid, Line, Text, OrbitControls, ContactShadows } from "@react-three/drei"; // Environment
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing";
import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { locSelectionContext } from "../context/locSelectionContext";

import { Mesh_abb_irb52_7_120 } from "../meshes/Mesh_abb_irb52_7_120";
import { Mesh_cardboard_box_01 } from "../meshes/Mesh_cardboard_box_01";

export const Fleetmanager = () => {
  const theme = useMantineContext();
  const { robots } = useContext( RobotContext );
  const { locSelection } = useContext( locSelectionContext );
  const { guiSelection, setGuiSelection } = useContext( guiSelectionContext );
  const filteredRobots = robots.filter(( robot )=>( robot.locationid == locSelection ));

  const initTarget: Vector3 = [0, 1, 0];
  const [ target ] = useState( initTarget ); // setTarget
  
  return ( 
    <Canvas dpr={[1, 2]} camera={{ position: [0, 4, 1], near: 0.01, far: 20 }}
      onPointerMissed={() => setGuiSelection("no selection")}>

      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline visibleEdgeColor={theme.colorScheme == "dark" ? "white" : "blue"} blur edgeStrength={100} width={1000} />
        </EffectComposer>
        {filteredRobots.map((robot) => (
          <Mesh_abb_irb52_7_120 key={robot.id} robotid={robot.id} selected={guiSelection == robot.id ? true : false} />
        ))}
      </Selection>

      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />

      <Grid cellColor={theme.colorScheme == "dark" ? "white" : "blue"} sectionColor={theme.colorScheme == "dark" ? "white" : "blue"}
        cellSize={1} sectionSize={4} infiniteGrid={ true } position={ [0, -0.02, 0] } fadeDistance={ 16 } fadeStrength={ 6 } />
      <Line color={"red"} points={[[0, -0.01, 0], [1, -0.01, 0]]} />
      <Line color={"blue"} points={[[0, -0.01, 0], [0, -0.01, 1]]} />
      <Text color={"red"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.9, 0, -0.1]} fontSize={0.15}>X</Text>
      <Text color={"blue"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.1, 0, 0.9]} fontSize={0.15}>Z</Text>

      <directionalLight intensity={2} position={ [5, 5, 5] } />
      <directionalLight intensity={2} position={ [5, 5, -5] } />
      <directionalLight intensity={2} position={ [-5, 5, 5] } />
      <directionalLight intensity={2} position={ [-5, 5, -5] } />

      <OrbitControls maxPolarAngle={ Math.PI / 2 } enableZoom={ false } enablePan={ true } target={ target } />

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