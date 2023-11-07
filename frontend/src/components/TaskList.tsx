import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea } from "@mantine/core";

import { useQuery } from "../doctype";
import { ITask } from "../@types/task";

import { TaskItem } from "./TaskItem";

export const TaskList = ({ docId }: { docId: JournalId }) => {
  const { rows: tasks } = useQuery<ITask>(
    docId,
    sql`SELECT id, description, completed FROM tasks ORDER BY description`
  );

  return (
    <ScrollArea type="auto">
      {(tasks ?? []).map((task) => (
        <TaskItem docId={docId} key={task.id} task={task} deleteAction={false} />
      ))}
    </ScrollArea>
  );
};
