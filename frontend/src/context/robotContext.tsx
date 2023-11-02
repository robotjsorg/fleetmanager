import { FC, ReactNode, createContext, useState } from "react";

import { RobotContextType, IRobot } from "../@types/robot";

export const RobotContext = createContext<RobotContextType | null>(null);

type RobotProviderProps = {
  children: ReactNode;
  robots: IRobot[];
}

const RobotProvider: FC<RobotProviderProps> = ( props: RobotProviderProps ) => {
  const initrobots = props.robots;

  let [robots, setRobots] = useState<IRobot[]>([]);

  robots = initrobots;

  const saveRobot = ( id: string, locationid: string, description: string ) => {
    const newRobot: IRobot = {
      id: id,
      locationid: locationid,
      description: description,
    };
    setRobots([...robots, newRobot]);
  };

  const deleteRobot = ( id: string ) => {
    const filterRobots = robots.filter(function( obj ) {
      return obj.id !== id;
    });
    setRobots(filterRobots);
  };

  return <RobotContext.Provider value={{ robots, saveRobot, deleteRobot }} >{props.children}</RobotContext.Provider>;
};

export default RobotProvider;