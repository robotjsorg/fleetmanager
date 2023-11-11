/* eslint-disable react/no-unknown-property */
import { useContext } from "react";
import { useMantineContext } from "@mantine/core";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Line, Text } from "@react-three/drei"; // GizmoHelper, GizmoViewport, ContactShadows, Environment
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing";
import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { locSelectionContext } from "../context/locSelectionContext";

// import { Urdf } from "../components/Urdf";

import { Mesh_abb_irb52_7_120 } from "../meshes/Mesh_abb_irb52_7_120";
import { Mesh_cardboard_box_01 } from "../meshes/Mesh_cardboard_box_01";
// import { Mesh_RotatingBox } from "../meshes/Mesh_RotatingBox";

export const Fleetmanager = () => {
  const theme = useMantineContext();
  const { robots } = useContext( RobotContext );
  const { locSelection } = useContext( locSelectionContext );
  const { guiSelection, setGuiSelection } = useContext( guiSelectionContext );
  const filteredRobots = robots.filter(( robot )=>( robot.locationid == locSelection ));

  
  return ( 
    <Canvas dpr={[1, 2]} camera={{ position: [0, 3, 3], near: 0.01, far: 20 }}
      onPointerMissed={() => setGuiSelection("no selection")}>
      {/* <Environment background ground={{ height: 10, radius: 43, scale: 6 }}
        preset={ locSelection == "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" ? "warehouse" 
        : locSelection == "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d" ? "apartment" 
        : "city" } /> */}

      <Grid cellColor={theme.colorScheme == "dark" ? "white" : "black"} sectionColor={theme.colorScheme == "dark" ? "white" : "black"}
        cellSize={1} sectionSize={4} infiniteGrid={ true } position={ [0, -0.02, 0] } fadeDistance={ 16 } fadeStrength={ 6 } />
      <Line color={"red"} points={[[0, -0.01, 0], [1, -0.01, 0]]} />
      <Line color={"blue"} points={[[0, -0.01, 0], [0, -0.01, 1]]} />
      <Text color={"red"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.9, 0, -0.1]} fontSize={0.15}>X</Text>
      <Text color={"blue"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.1, 0, 0.9]} fontSize={0.15}>Z</Text>

      {/* <ambientLight intensity={1} /> */}
      <directionalLight intensity={2} position={ [5, 5, 5] } />
      <directionalLight intensity={2} position={ [5, 5, -5] } />
      <directionalLight intensity={2} position={ [-5, 5, 5] } />
      <directionalLight intensity={2} position={ [-5, 5, -5] } />
      {/* <ContactShadows scale={ 150 } position={ [0.33, -0.33, 0.33] } opacity={ 1.5 } /> */}

      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline blur visibleEdgeColor={theme.colorScheme == "dark" ? "white" : "blue"} edgeStrength={100} width={1000} />
        </EffectComposer>
        {filteredRobots.map((robot) => (
          <Mesh_abb_irb52_7_120 key={robot.id} robotid={robot.id} selected={guiSelection == robot.id ? true : false} />
        ))}
      </Selection>

      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />
      <Mesh_cardboard_box_01 />
      {/* <Mesh_RotatingBox /> */}
      {/* <Urdf /> */}
  
      <OrbitControls target={ [0, 1, 0] } maxPolarAngle={ Math.PI / 2 } enableZoom={ false } enablePan={ false } />
      {/* Breaks outlines */}
      {/* <GizmoHelper alignment="bottom-right" margin={ [80, 80] }>
        <GizmoViewport axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]} labelColor="white" />
      </GizmoHelper> */}
    </Canvas>
  );
};