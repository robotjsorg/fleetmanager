export interface IRobotQuery {
  id: string
  locationid: string
  description: string
  state: string
  created_at: string
  updated_at: string
  x: number
  z: number
  theta: number
}

export interface IRobotLocal {
  id: string
  position: number[]
  rotation: number[]
  toolState: string
  jointAngles: number[]
}

export type IRobot = IRobotQuery & IRobotLocal