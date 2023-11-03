import { ReactNode, useContext } from "react";
import { Canvas, Vector3 } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";

import { RobotContextType } from "../@types/robot";
import { RobotContext } from "../context/robotContext";
import RobotMesh from "../components/RobotMesh";

const RobotMeshGroup = (props: { children: ReactNode; name: string; }) => {
  return (
    <group name={props.name}>
      {props.children}
    </group>
  );
};

const FleetmanagerView = () => {
  const { robots } = useContext(RobotContext) as RobotContextType;
  const randomPosition = () => {
    const x = 4 * (Math.random() - 0.5);
    const z = 2 * (Math.random() - 0.5);
    return [x, 0, z] as Vector3;
  };

  return (
    <div className="bg-white rounded shadow p-6 m-0 mb-4 w-full">
      <div className="mb-4">
        <h1 className="text-grey-darkest">Location &gt; Fleetmanager</h1>
        <div className="canvasDiv flex mt-4">
          <Canvas camera={{ position: [0, 3, 3], near: 0.01, far: 20 }}>
            <Environment preset="warehouse" background ground={{ height: 10, radius: 43, scale: 6 }} />
            <RobotMeshGroup name={"robotGroup"}>
              {robots.map((robot) => (
                <RobotMesh key={robot.id} position={randomPosition()} />
              ))}
            </RobotMeshGroup>
            <ContactShadows scale={150} position={[0.33, -0.33, 0.33]} opacity={1.5} />
            <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default FleetmanagerView;