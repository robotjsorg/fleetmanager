export interface IRobot {
  id: string;
  locationid: string;
  description: string;
};

export type RobotContextType = {
  robots: IRobot[];
  saveRobot: (id: string, locationid: string, description: string) => void;
  deleteRobot: (id: string) => void;
};
