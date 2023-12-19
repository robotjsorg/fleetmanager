import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Stack, Divider, Container, ScrollArea } from "@mantine/core"

import { LocationTable } from "../components/LocationTable"
import { LocationForm } from "../components/LocationForm"

export const LocationsView = ({
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
            <LocationTable docId={docId} />
          </Container>
        </ScrollArea>
      </Stack>
      <Divider />
      <Container size="xs" p="xl">
        <LocationForm docId={docId} />
      </Container>
    </>
  )
}
