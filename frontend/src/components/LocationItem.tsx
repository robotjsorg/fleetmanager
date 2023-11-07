import { useCallback, useContext } from "react";
import { Link } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { Text, ActionIcon, Group } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import { Mutation } from "../doctype";
import { ILocation } from "../@types/location";

import { guiSelectionContext } from "../context/guiSelectionContext";
import { locationSelectionContext } from "../context/locationSelectionContext";

export const LocationItem = ({
  location,
  mutate,
  docId
}: {
  location: ILocation;
  mutate: ( m: Mutation ) => Promise<void>;
  docId: JournalId;
}) => {
  const { setGuiSelection } = useContext( guiSelectionContext );
  const { locationSelection, setLocationSelection } = useContext( locationSelectionContext );

  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteLocation", id: location.id })
      .then(() => {
        if ( location.id == locationSelection ) {
          setGuiSelection("no selection");
          setLocationSelection( "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" );
        }
      })
      .catch((err) => {
        console.error("Failed to delete", err);
      });
  }, [location.id, locationSelection, mutate, setGuiSelection, setLocationSelection]);

  const handleLocationSelect = () => {
    setGuiSelection("no selection");
    setLocationSelection( location.id );
  };

  return (
    <Group justify="space-between" gap="sm" px={12} py={4}>
      <Link to={ "/" + journalIdToString( docId ) } onClick={ handleLocationSelect }>
        <Text style={{ flex: 1 }} >
          { location.description }
        </Text>
      </Link>
      { location.id == "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" ? <></> : 
        <ActionIcon color="red" variant="subtle" onClick={ handleDelete }>
          <IconX />
        </ActionIcon>
      }
    </Group>
  );
};