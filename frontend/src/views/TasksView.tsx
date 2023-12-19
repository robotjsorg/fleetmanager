import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Box, Stack, Divider } from "@mantine/core";

import { TaskTable } from "../components/TaskTable";
import { TaskForm } from "../components/TaskForm";

export const TasksView = ({
  docId,
  h
}: {
  docId: JournalId
  h: number
}) => {
  return (
    <>
      <Divider />
      <Stack h={h}>
        <TaskTable docId={docId} />
      </Stack>
      <Divider mb="xl" />
      <Box maw={400} mx="auto">
        <TaskForm docId={docId} />
      </Box>
    </>
  );
};
