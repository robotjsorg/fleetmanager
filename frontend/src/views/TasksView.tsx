import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Stack, Divider, Container, ScrollArea } from "@mantine/core"

import { TaskTable } from "../components/TaskTable"
import { TaskForm } from "../components/TaskForm"

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
        <ScrollArea>
          <Container size="sm">
            <TaskTable docId={docId} />
          </Container>
        </ScrollArea>
      </Stack>
      <Divider />
      <Container size="xs" p="xl">
        <TaskForm docId={docId} />
      </Container>
    </>
  )
}