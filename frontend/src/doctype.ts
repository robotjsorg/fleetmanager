import { createDocHooks } from "@orbitinghail/sqlsync-react";
import { DocType, serializeMutationAsJSON } from "@orbitinghail/sqlsync-worker";

const REDUCER_URL = new URL(
  "../../reducer/target/wasm32-unknown-unknown/release/reducer.wasm",
  import.meta.url
)

export type Mutation =
    {
      tag: "InitSchema"
  }
  | {
      tag: "PopulateLocations"
  }
  | {
      tag: "PopulateRobots"
  }
  | {
      tag: "PopulateTasks"
  }
  | {
      tag: "CreateLocation"
      id: string
      description: string
  }
  | {
      tag: "DeleteLocation"
      id: string
  }
  | {
      tag: "CreateRobot"
      id: string
      locationid: string
      description: string
      x: number
      z: number
      theta: number
    }
  | {
      tag: "DeleteRobot"
      id: string
    }
  | {
      tag: "UpdateRobotState"
      id: string
      state: string
    }
    | {
      tag: "UpdateRobotPosition"
      id: string
      x: number
      z: number
      theta: number
    }
  | {
      tag: "CreateTask"
      id: string
      robotid: string
      description: string
    }
  | {
      tag: "DeleteTask"
      id: string
    }
  | {
      tag: "UpdateTask"
      id: string
      state: string
  }

export const TaskDocType: DocType<Mutation> = {
  reducerUrl: REDUCER_URL,
  serializeMutation: serializeMutationAsJSON,
}

export const { useMutate, useQuery, useSetConnectionEnabled } = createDocHooks(TaskDocType)
