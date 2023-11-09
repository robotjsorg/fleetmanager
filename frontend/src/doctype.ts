import { DocType, createDocHooks, serializeMutationAsJSON } from "@orbitinghail/sqlsync-react";

const REDUCER_URL = new URL(
  "../../reducer/target/wasm32-unknown-unknown/release/reducer.wasm",
  import.meta.url
);

export type Mutation =
    {
      tag: "InitSchema";
  }
  | {
      tag: "PopulateDB";
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

export const TaskDocType: DocType<Mutation> = {
  reducerUrl: REDUCER_URL,
  serializeMutation: serializeMutationAsJSON,
};

export const { useMutate, useQuery, useSetConnectionEnabled } = createDocHooks(TaskDocType);
