/* eslint-disable react/no-unknown-property */
import { useContext } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Grid } from "@react-three/drei"; // GizmoHelper, GizmoViewport
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { locationSelectionContext } from "../context/locationSelectionContext";

import { RobotMesh } from "../components/RobotMesh";
import { BoxMesh } from "../components/BoxMesh";
// import { Urdf } from "../components/Urdf";

export const Fleetmanager = () => {
  const { robots } = useContext( RobotContext )!;
  const { guiSelection, setGuiSelection } = useContext( guiSelectionContext );
  const { locationSelection } = useContext( locationSelectionContext );

  return (
    <Canvas camera={{ position: [0, 3, 3], near: 0.01, far: 20 }} onPointerMissed={() => setGuiSelection("no selection")}> 
      <Environment background ground={{ height: 10, radius: 43, scale: 6 }}
        preset={ locationSelection == "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" ? "warehouse" 
        : locationSelection == "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d" ? "apartment" 
        : "city" } />
      {/* <Urdf /> */}
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline blur edgeStrength={100} width={1000} />
        </EffectComposer>
        {robots.map((robot) => (
          <RobotMesh key={robot.id} robotid={robot.id} selected={guiSelection == robot.id ? true : false} />
        ))}
        <BoxMesh />
        <BoxMesh />
        <BoxMesh />
        <BoxMesh />
        <BoxMesh />
        <BoxMesh />
      </Selection>
      <Grid infiniteGrid={ true } position={ [0, -0.01, 0] } fadeDistance={ 16 } fadeStrength={ 3 } />
      <ContactShadows scale={ 150 } position={ [0.33, -0.33, 0.33] } opacity={ 1.5 } />
      <OrbitControls target={ [0, 1, 0] } maxPolarAngle={ Math.PI / 2 } enableZoom={ false } enablePan={ false } />
      {/* Breaks outlines */}
      {/* <GizmoHelper alignment="bottom-right" margin={ [80, 80] }>
        <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
      </GizmoHelper> */}
    </Canvas>
  );
};