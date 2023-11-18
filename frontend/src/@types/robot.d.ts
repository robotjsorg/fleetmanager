export interface IRobotQuery {
  id: string;
  locationid: string;
  description: string;
  created_at: string;
}

export interface IRobot {
  id: string;
  locationid: string;
  description: string;
  created_at: string;
  state: string;
  toolState: string;
  position: Vector3;
  rotation: Euler;
  jointAngles: number[];
}