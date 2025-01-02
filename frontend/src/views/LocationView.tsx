// import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Stack, Divider, Container, ScrollArea } from "@mantine/core"

import { LocationTable } from "../components/LocationTable"
import { LocationForm } from "../components/LocationForm"

export const LocationView = ({
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
            {/*<LocationTable docId={docId} />*/}
            <LocationTable />
          </Container>
        </ScrollArea>
      </Stack>
      <Divider />
      <Container size="xs" p="xl">
        {/*<LocationForm docId={docId} />*/}
        <LocationForm />
      </Container>
    </>
  )
}
