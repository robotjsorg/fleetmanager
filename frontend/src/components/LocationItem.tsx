import { useCallback, useContext } from "react";
import { Link } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { Text, ActionIcon, Flex } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import { Mutation } from "../doctype";
import { ILocation } from "../@types/location";

import { guiSelectionContext } from "../context/guiSelectionContext";

export const LocationItem = ({
  location,
  mutate,
  docId
}: {
  location: ILocation;
  mutate: ( m: Mutation ) => Promise<void>;
  docId: JournalId;
}) => {
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteLocation", id: location.id })
      .catch((err) => {
        console.error("Failed to delete", err);
      });
  }, [location.id, mutate]);

  const { setLocationSelection } = useContext(guiSelectionContext);

  return (
    <Link to={"/" + journalIdToString( docId )}
      onClick={() => ( setLocationSelection( location.id ), console.log( "LocationItem.tsx: " + location.id ) )}>
      <Flex style={{ alignItems: "center" }} gap="sm" px={12} py={4} >
        <Text style={{ flex: 1 }}>{ location.description }</Text>
        <ActionIcon color="red" variant="subtle" onClick={ handleDelete }>
          <IconX />
        </ActionIcon>
      </Flex>
    </Link>
  );
};