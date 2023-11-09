import { Vector3 } from "@react-three/fiber";

export interface IRobot {
  id: string;
  locationid: string;
  description: string;
  position: Vector3;
}