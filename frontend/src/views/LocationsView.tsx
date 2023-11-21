import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Box, Stack, Divider } from "@mantine/core";

import { LocationList } from "../components/LocationList";
// import { LocationTable } from "../components/LocationTable";
import { LocationForm } from "../components/LocationForm";

export const LocationsView = ({ docId, h }: { docId: JournalId; h: number; }) => {
  return (
    <>
      <Divider />
      <Stack h={h} p="lg" maw={800} mx="auto">
        <LocationList docId={docId} fbDisabled={false} />
        {/* <LocationTable /> */}
      </Stack>
      <Divider my="lg" />
      <Box maw={400} mx="auto">
        <LocationForm docId={docId} />
      </Box>
    </>
  );
};
