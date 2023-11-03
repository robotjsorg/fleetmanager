import { useQuery, useSqlSync } from "@orbitinghail/sqlsync-react/sqlsync-react.tsx";
import { useCallback, useState } from "react";

import { Mutation } from "../@types/mutation";
import { ITask } from "../@types/task";
import Task from "../components/Task";

const TasksView = () => {
  const { mutate } = useSqlSync<Mutation>();
  const [inputValue, setInputValue] = useState("");
  const { rows: tasks } = useQuery<ITask>("select * from tasks order by id");
  const handleCreate = useCallback(async () => {
    if (!inputValue.trim()) {
      return;
    }
    const id = crypto.randomUUID();
    const robotid = crypto.randomUUID();
    await mutate({ tag: "CreateTask", id, robotid, description: inputValue });
    setInputValue("");
  }, [inputValue, mutate]);

  return (
    <div className="bg-white rounded shadow p-6 m-0 mb-4 w-full">
      <div className="mb-4">
        <h1 className="text-grey-darkest">Tasks</h1>
        <div>
          {tasks.map((task) => (
            <Task key={task.id} {...task} />
          ))}
        </div>
        <div className="flex mt-4">
          <input
            name="newTask"
            className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
            placeholder="Add Task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={async (e) => {
              if (e.key === "Enter") {
                await handleCreate();
              }
            }}
          />
          <button
            type="submit"
            onClick={handleCreate}
            className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal-500"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default TasksView;