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
  lastKnownPosition: Vector3;
  lastKnownRotation: Vector3;
  lastKnownJointAngles: number[];
}