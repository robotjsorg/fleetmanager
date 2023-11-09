import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { Text, ActionIcon, Group } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import { useMutate } from "../doctype";
import { ILocation } from "../@types/location";

import { locationSelectionContext } from "../context/locationSelectionContext";
import { useHover } from "@mantine/hooks";

export const LocationItem = ({
  docId,
  location,
  fbDisabled
}: {
  docId: JournalId;
  location: ILocation;
  fbDisabled: boolean;
}) => {
  const { locationSelection, setLocationSelection } = useContext( locationSelectionContext );

  const mutate = useMutate( docId );
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteLocation", id: location.id })
      .then(() => {
        if ( location.id == locationSelection ) {
          setLocationSelection( "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" );
        }
      })
      .catch((err) => {
        console.error("Failed to delete", err);
      });
  }, [location.id, locationSelection, mutate, setLocationSelection]);

  const navigate = useNavigate();
  const handleLocationSelect = () => {
    setLocationSelection( location.id );
    navigate( "/" + journalIdToString( docId ) );
  };

  const { hovered, ref } = useHover();
  const selected = () => { 
    return locationSelection == location.id;
  };

  return (
    <Group ref={ref} justify="space-between" gap="sm" px={12} py={4}
      bg={ hovered || selected() ? "gray" : "none" }>
      <Text style={{ flex: 1 }} onClick={ handleLocationSelect }>
        { location.description }
      </Text>
      { (location.id == "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" || fbDisabled) ? <></> : 
        <ActionIcon onClick={ handleDelete } color="gray" variant="subtle">
          <IconX />
        </ActionIcon>
      }
    </Group>
  );
};