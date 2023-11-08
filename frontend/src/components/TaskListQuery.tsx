import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";

import { useQuery } from "../doctype";
import { ITask } from "../@types/task";

import { TaskItem } from "./TaskItem";

export const TaskListQuery = ({ docId }: { docId: JournalId }) => {
  const { rows: tasks } = useQuery<ITask>(
    docId,
    sql`SELECT id, description, completed FROM tasks ORDER BY description`
  );

  return (
    <>
      {(tasks ?? []).map((task) => (
        <TaskItem docId={docId} key={task.id} task={task} deleteDisabled={false} />
      ))}
    </>
  );
};
