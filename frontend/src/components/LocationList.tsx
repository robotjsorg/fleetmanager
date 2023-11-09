import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea } from "@mantine/core";

import { RobotContext } from "../context/robotContext";

import { LocationItem } from "./LocationItem";

export const LocationList = ({
  docId,
  fbDisabled
}: {
  docId: JournalId;
  fbDisabled: boolean;
}) => {
  const { locations } = useContext( RobotContext );
  
  return (
    <ScrollArea type="auto">
      {locations.map((location) => (
        <LocationItem docId={docId} key={location.id} location={location} fbDisabled={fbDisabled} />
      ))}
    </ScrollArea>
  );
};