import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title } from "@mantine/core";

import { TaskListQuery } from "../components/TaskListQuery";
import { TaskForm } from "../components/TaskForm";

export const TasksView = ({ docId }: { docId: JournalId }) => {
  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Tasks
        </Center>
      </Flex>
      <TaskListQuery docId={docId} />
      <TaskForm docId={docId} />
    </>
  );
};
