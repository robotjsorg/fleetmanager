import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Box, Stack, Divider } from "@mantine/core";

import { TaskList } from "../components/TaskList";
// import { TaskTable } from "../components/TaskTable";
import { TaskForm } from "../components/TaskForm";

export const TasksView = ({ docId, h }: { docId: JournalId; h: number; }) => {  
  return (
    <>
      <Divider />
      <Stack h={h} p="lg" maw={800} mx="auto">
        <TaskList docId={docId} fbDisabled={false} />
        {/* <TaskTable /> */}
      </Stack>
      <Divider my="lg" />
      <Box maw={400} mx="auto">
        <TaskForm docId={docId} />
      </Box>
    </>
  );
};
