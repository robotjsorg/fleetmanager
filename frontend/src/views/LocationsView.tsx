import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Paper, ScrollArea, Stack, Title } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { useQuery } from "../doctype";
import { ILocation } from "../@types/location";

import { LocationItem } from "../components/LocationItem";
import { LocationForm } from "../components/LocationForm";

export const LocationsView = ({ docId }: { docId: JournalId }) => {
  const { height } = useViewportSize();
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations ORDER BY description`
  );

  return (
    <Paper component={Stack} p="xs" h={(height-164)}>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Locations
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(locations ?? []).map((location) => (
          <LocationItem docId={docId} key={location.id} location={location} />
        ))}
      </ScrollArea>
      <LocationForm docId={docId} />
    </Paper>
  );
};
