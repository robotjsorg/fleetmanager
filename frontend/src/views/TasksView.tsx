import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, ScrollArea, Title } from "@mantine/core";

import { useQuery } from "../doctype";
import { ITask } from "../@types/task";

import { TaskItem } from "../components/TaskItem";
import { TaskForm } from "../components/TaskForm";

export const TasksView = ({ docId }: { docId: JournalId }) => {
  const { rows: tasks } = useQuery<ITask>(
    docId,
    sql`SELECT id, description, completed FROM tasks ORDER BY description`
  );

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Tasks
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(tasks ?? []).map((task) => (
          <TaskItem docId={docId} key={task.id} task={task} />
        ))}
      </ScrollArea>
      <TaskForm docId={docId} />
    </>
  );
};
