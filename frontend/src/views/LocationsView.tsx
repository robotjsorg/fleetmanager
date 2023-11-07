import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Paper, ScrollArea, Stack } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { LocationList } from "../components/LocationList";
import { LocationForm } from "../components/LocationForm";

export const LocationsView = ({ docId }: { docId: JournalId }) => {
  const { height } = useViewportSize();

  return (
    <Paper component={Stack} p="xs" h={(height-164)}>
      <ScrollArea type="auto">
        <LocationList docId={docId} />
      </ScrollArea>
      <LocationForm docId={docId} />
    </Paper>
  );
};
