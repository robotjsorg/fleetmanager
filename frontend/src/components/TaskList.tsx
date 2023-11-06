import { Center, Flex, ScrollArea, Title } from "@mantine/core";
import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { useMutate, useQuery } from "../doctype";
import { ITask } from "../@types/task";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";

export const TaskList = ({ docId }: { docId: JournalId }) => {
  const { rows: tasks } = useQuery<ITask>(
    docId,
    sql`select id, description, completed from tasks order by description`
  );
  const mutate = useMutate(docId);

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Tasks
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(tasks ?? []).map((task) => (
          <TaskItem key={task.id} task={task} mutate={mutate} />
        ))}
      </ScrollArea>
      <TaskForm docId={docId} mutate={mutate} />
    </>
  );
};
