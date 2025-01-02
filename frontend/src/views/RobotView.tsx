// import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Stack, Divider, Container, ScrollArea } from "@mantine/core"

import { RobotTable } from "../components/RobotTable"
import { RobotForm } from "../components/RobotForm"

export const RobotView = ({
  // docId,
  h
}: {
  // docId: JournalId
  h: number
}) => {  
  return (
    <>
      <Stack h={h}>
        <ScrollArea>
          <Container size="sm">
            {/*<RobotTable docId={docId} />*/}
            <RobotTable />
          </Container>
        </ScrollArea>
      </Stack>
      <Divider />
      <Container size="xs" p="xl">
        {/*<RobotForm docId={docId}/>*/}
        <RobotForm />
      </Container>
    </>
  )
}