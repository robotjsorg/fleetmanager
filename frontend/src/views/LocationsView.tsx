import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Paper, ScrollArea, Stack } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { LocationListQuery } from "../components/LocationListQuery";
import { LocationForm } from "../components/LocationForm";

export const LocationsView = ({ docId }: { docId: JournalId }) => {
  const { height } = useViewportSize();

  return (
    <Paper component={Stack} p="xs" h={(height-164)}>
      <ScrollArea type="auto">
        <LocationListQuery docId={docId} deleteDisabled={false} />
      </ScrollArea>
      <LocationForm docId={docId} />
    </Paper>
  );
};
