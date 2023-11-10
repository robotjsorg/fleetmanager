import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { Text, ActionIcon, Group } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import { useMutate } from "../doctype";
import { ILocation } from "../@types/location";

import { locSelectionContext } from "../context/locSelectionContext";
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
  const { locSelection, setLocationSelection } = useContext( locSelectionContext );

  const mutate = useMutate( docId );
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteLocation", id: location.id })
      .then(() => {
        if ( location.id == locSelection ) {
          setLocationSelection( "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" );
        }
      })
      .catch((err) => {
        console.error("Failed to delete", err);
      });
  }, [location.id, locSelection, mutate, setLocationSelection]);

  const navigate = useNavigate();
  const handleLocationSelect = () => {
    setLocationSelection( location.id );
    navigate( "/" + journalIdToString( docId ) );
  };

  const { hovered, ref } = useHover();
  const selected = () => { 
    return locSelection == location.id;
  };

  return (
    <Group wrap="nowrap" ref={ref} bg={ hovered || selected() ? "gray" : "none" }
      onClick={ handleLocationSelect }
      justify="space-between" gap="sm" px={12} py={4}
      styles={{
        root: { cursor: "pointer" }
      }}>
      <Text>
        { location.description }
      </Text>
      { (fbDisabled) ? <></> : 
        <ActionIcon onClick={ handleDelete } color="gray" variant="subtle" size={20}>
          <IconX />
        </ActionIcon>
      }
    </Group>
  );
};