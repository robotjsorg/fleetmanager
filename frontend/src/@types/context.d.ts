import { ILocation } from "../@types/location";
import { IRobot } from "../@types/robot";
import { ITask } from "../@types/task";

export interface RobotContextType {
  locations: ILocation[];
  robots: IRobot[];
  tasks: ITask[];
}