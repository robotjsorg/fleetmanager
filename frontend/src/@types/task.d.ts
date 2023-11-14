export interface ITaskQuery {
  id: string;
  robotid: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export interface ITask {
  id: string;
  robotid: string;
  description: string;
  completed: boolean;
  created_at: string;
  state: string;
}