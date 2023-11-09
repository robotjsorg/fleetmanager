import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title, Box, Divider } from "@mantine/core";

import { LocationList } from "../components/LocationList";
import { LocationForm } from "../components/LocationForm";

export const LocationsView = ({ docId }: { docId: JournalId }) => {
  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Locations
        </Center>
      </Flex>
      <LocationList docId={docId} fbDisabled={false} />
      <Divider my="sm" />
      <Box maw={400} mx="auto">
        <LocationForm docId={docId} />
      </Box>
    </>
  );
};
