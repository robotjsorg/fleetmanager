import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Box, Divider } from "@mantine/core";

import { LocationList } from "../components/LocationList";
// import { LocationTable } from "../components/LocationTable";
import { LocationForm } from "../components/LocationForm";

export const LocationsView = ({ docId }: { docId: JournalId }) => {
  return (
    <Box p="lg">
      <Divider my="sm" />
      <LocationList docId={docId} fbDisabled={false} />
      {/* <Divider my="sm" />
      <LocationTable /> */}
      <Divider my="sm" />
      <Box maw={400} mx="auto">
        <LocationForm docId={docId} />
      </Box>
    </Box>
  );
};
