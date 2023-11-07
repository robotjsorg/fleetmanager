import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea } from "@mantine/core";

import { useQuery } from "../doctype";
import { ILocation } from "../@types/location";

import { LocationItem } from "./LocationItem";

export const LocationList = ({ docId }: { docId: JournalId }) => {
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations ORDER BY description`
  );

  return (
    <ScrollArea type="auto">
      {(locations ?? []).map((location) => (
        <LocationItem docId={docId} key={location.id} location={location} deleteAction={false} />
      ))}
    </ScrollArea>
  );
};
