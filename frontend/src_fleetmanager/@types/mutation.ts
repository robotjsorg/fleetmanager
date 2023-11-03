// matches the Mutation type in demo/demo-reducer
export type Mutation =
  | {
      tag: "InitSchema";
  }
  | {
      tag: "CreateLocation";
      id: string;
      description: string;
}
| {
      tag: "DeleteLocation";
      id: string;
}
| {
      tag: "CreateRobot";
      id: string;
      locationid: string;
      description: string;
  }
| {
      tag: "DeleteRobot";
      id: string;
  }
| {
      tag: "CreateTask";
      id: string;
      robotid: string;
      description: string;
  }
| {
      tag: "DeleteTask";
      id: string;
  }
| {
      tag: "ToggleCompleted";
      id: string;
  };
