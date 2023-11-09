import { ReactNode, createContext, useEffect, useState } from "react";

import { RobotContextType } from "../@types/context";
import { ILocation } from "../@types/location";
import { IRobot } from "../@types/robot";
import { ITask } from "../@types/task";

export const RobotContext = createContext<RobotContextType>({locations: [], robots: [], tasks: []});

interface RobotProviderProps {
  children: ReactNode;
  locations: ILocation[];
  robots: IRobot[];
  tasks: ITask[];
}

export const RobotProvider = ( props: RobotProviderProps ) => {
  const [ locations, setLocations ] = useState<ILocation[]>([]);
  const [ robots, setRobots ] = useState<IRobot[]>([]);
  const [ tasks, setTasks ] = useState<ITask[]>([]);

  useEffect(() => {
    setLocations(props.locations);
    setRobots(props.robots);
    setTasks(props.tasks);
  }, [props.locations, props.robots, props.tasks]);

  return (
    <RobotContext.Provider value={{ locations, robots, tasks }} >
      { props.children }
    </RobotContext.Provider>
  );
};