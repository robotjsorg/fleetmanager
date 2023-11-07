import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title } from "@mantine/core";

import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";

export const TasksView = ({ docId }: { docId: JournalId }) => {
  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Tasks
        </Center>
      </Flex>
      <TaskList docId={docId} />
      <TaskForm docId={docId} />
    </>
  );
};
