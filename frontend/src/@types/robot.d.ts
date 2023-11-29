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

export interface IRobot {
  id: string
  locationid: string
  description: string
  state: string
  created_at: string
  updated_at: string 
  x: number
  z: number
  theta: number
  toolState: string
  position: number[]
  rotation: number[]
  jointAngles: number[]
}