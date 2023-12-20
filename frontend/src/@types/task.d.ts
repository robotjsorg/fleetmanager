export interface ITask { // ITaskQuery
  id: string
  robotid: string
  description: string
  state: string
  created_at: string
}

export interface ITaskLocal {
  robot_desc: string
}

// export type ITask = ITaskQuery & ITaskLocal