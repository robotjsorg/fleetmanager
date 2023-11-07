import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Paper, Stack, Title } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { LocationForm } from "../components/LocationForm";
import { LocationList } from "../components/LocationList";

export const LocationsView = ({ docId }: { docId: JournalId }) => {
  const { height } = useViewportSize();

  return (
    <Paper component={Stack} p="xs" h={(height-164)}>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Locations
        </Center>
      </Flex>
      <LocationList docId={docId} />
      <LocationForm docId={docId} />
    </Paper>
  );
};
