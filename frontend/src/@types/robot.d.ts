export interface IRobot {
  id: string;
  locationid: string;
  description: string;
}

export interface RobotContextType {
  robots: IRobot[];
}

export interface SelectionType {
  selection: string;
}
