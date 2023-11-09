import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, ScrollArea, Title } from "@mantine/core";

import { useQuery } from "../doctype";
import { ILocation } from "../@types/location";

import { LocationItem } from "./LocationItem";

export const LocationListQuery = ({
  docId,
  deleteDisabled
}: {
  docId: JournalId;
  deleteDisabled: boolean;
}) => {
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations ORDER BY created_at`
  );

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Locations
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(locations ?? []).map((location) => (
          <LocationItem docId={docId} key={location.id} location={location} deleteDisabled={deleteDisabled} />
        ))}
      </ScrollArea>
    </>
  );
};