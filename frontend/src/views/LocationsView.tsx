import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title, Box } from "@mantine/core";

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
      <Box maw={400} mx="auto">
        <LocationForm docId={docId} />
      </Box>
    </>
  );
};
