import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Box, Divider } from "@mantine/core";

import { TaskList } from "../components/TaskList";
// import { TaskTable } from "../components/TaskTable";
import { TaskForm } from "../components/TaskForm";

export const TasksView = ({ docId }: { docId: JournalId }) => {  
  return (
    <>
      <Divider />
      <Box p="lg">
        <TaskList docId={docId} fbDisabled={false} />
        {/* <Divider my="lg" />
        <TaskTable /> */}
        <Divider my="lg" />
        <Box maw={400} mx="auto">
          <TaskForm docId={docId} />
        </Box>
      </Box>
    </>
  );
};
