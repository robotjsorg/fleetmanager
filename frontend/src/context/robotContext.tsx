import { FC, ReactNode, createContext, useEffect, useState } from "react";

import { RobotContextType } from "../@types/context";
import { IRobot } from "../@types/robot";

export const RobotContext = createContext<RobotContextType | null>(null);

interface RobotProviderProps {
  children: ReactNode;
  robots: IRobot[] | null;
}

export const RobotProvider: FC<RobotProviderProps> = ( props: RobotProviderProps ) => {
  const [ robots, setRobots ] = useState<IRobot[] | null>(null);

  useEffect(() => {
    setRobots(props.robots);
  }, [props.robots]);

  return (
    <RobotContext.Provider value={{ robots }} >
      { props.children }
    </RobotContext.Provider>
  );
};