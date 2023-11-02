import { useSqlSync } from "@orbitinghail/sqlsync-react/sqlsync-react.tsx";
import { useCallback } from "react";

import { Mutation } from "../@types/mutation";
import { ITask } from "../@types/task";
import Checkbox from "../components/Checkbox";

const Task = (props: ITask) => {
    const { mutate } = useSqlSync<Mutation>();
  
    const handleDelete = useCallback(async () => {
      await mutate({ tag: "DeleteTask", id: props.id });
    }, [props.id, mutate]);
  
    const handleToggleCompleted = useCallback(async () => {
      await mutate({ tag: "ToggleCompleted", id: props.id });
    }, [props.id, mutate]);
  
    return (
      <div className="flex mb-4 items-center">
        <div className="flex-no-shrink mr-4">
          <Checkbox checked={props.completed} onChange={handleToggleCompleted} />
        </div>
        <p className="w-full">{props.description}</p>
        <button
          onClick={handleDelete}
          className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red-500"
        >
          Remove
        </button>
      </div>
    );
  }

  export default Task;