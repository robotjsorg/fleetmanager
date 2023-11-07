import { useContext } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";

import { RobotMesh } from "../components/RobotMesh";
// import { Urdf } from "../components/Urdf";

export const Fleetmanager = () => {
  const { robots } = useContext(RobotContext)!;
  const { guiSelection, setGuiSelection } = useContext(guiSelectionContext);

  return (
    <Canvas camera={{ position: [0, 3, 3], near: 0.01, far: 20 }} onPointerMissed={() => setGuiSelection("no selection")}> 
      <Environment preset="warehouse" background ground={{ height: 10, radius: 43, scale: 6 }} />
      {/* <Urdf /> */}
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline blur edgeStrength={100} width={1000} />
        </EffectComposer>
        {robots.map((robot) => (
          <RobotMesh key={robot.id} robotid={robot.id} selected={guiSelection == robot.id ? true : false} />
        ))}
      </Selection>
      <ContactShadows scale={150} position={[0.33, -0.33, 0.33]} opacity={1.5} />
      <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
    </Canvas>
  );
};