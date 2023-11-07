import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Paper, ScrollArea, Stack, Title } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { useMutate, useQuery } from "../doctype";
import { ILocation } from "../@types/location";

import { LocationItem } from "../components/LocationItem";
import { LocationForm } from "../components/LocationForm";

export const LocationsView = ({ docId }: { docId: JournalId }) => {
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`select * from locations order by description`
  );

  const mutate = useMutate( docId );
  const { height } = useViewportSize();

  return (
    <Paper component={Stack} p="xs" h={(height-164)}>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Locations
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(locations ?? []).map((location) => (
          <LocationItem key={location.id} location={location} mutate={mutate} docId={docId} />
        ))}
      </ScrollArea>
      <LocationForm mutate={mutate} />
    </Paper>
  );
};
