import { IRobot } from "./robot"

export interface RobotContextType {
  robots: IRobot[] | null;
}