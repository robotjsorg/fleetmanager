import { FC, ReactNode, createContext, useState } from "react";

import { RobotContextType } from "../@types/context";
import { IRobot } from "../@types/robot";

export const RobotContext = createContext<RobotContextType | null>(null);

interface RobotProviderProps {
  children: ReactNode;
  robots: IRobot[];
}

export const RobotProvider: FC<RobotProviderProps> = ( props: RobotProviderProps ) => {
  let [ robots ] = useState<IRobot[] | null>(null);
  robots = props.robots;  

  return (
    <RobotContext.Provider value={{ robots }} >
      { props.children }
    </RobotContext.Provider>
  );
};