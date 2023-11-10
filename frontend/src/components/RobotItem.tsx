import { useCallback, useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Text, ActionIcon, Group, useMantineContext } from "@mantine/core";
import { useHover } from '@mantine/hooks';

import { IconX } from "@tabler/icons-react";

import { useMutate } from "../doctype";
import { IRobot } from "../@types/robot";

import { guiSelectionContext } from "../context/guiSelectionContext";

export const RobotItem = ({
  docId,
  robot,
  fbDisabled
}: {
  docId: JournalId;
  robot: IRobot;
  fbDisabled: boolean;
}) => {
  const theme = useMantineContext();
  const mutate = useMutate( docId );
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteRobot", id: robot.id })
      .catch((err) => {
        console.error("Failed to delete", err);
      });
  }, [robot.id, mutate]);

  const { guiSelection, setGuiSelection } = useContext(guiSelectionContext);
  const handleSelect = () => {
    if ( fbDisabled ) { // Counter-intuitive
      setGuiSelection(robot.id);
    }
  };

  const { hovered, ref } = useHover();
  const selected = () => { 
    return guiSelection == robot.id;
  };
  
  return (
    <Group wrap="nowrap" ref={ref} bg={ ( fbDisabled && hovered ) || selected() ? theme.colorScheme == "dark" ? "#2a2c30" : "#f3f3f" : "none" }
      onClick={ handleSelect }
      justify="space-between" gap="sm" px={12} py={4}
      styles={{
        root: fbDisabled ? { cursor: "pointer" } : {}
      }}>
      <Text>
        { robot.description }
      </Text>
      { fbDisabled ? <></> : 
        <ActionIcon onClick={ handleDelete } color="gray" variant="subtle" size={20}>
          <IconX />
        </ActionIcon>
      }
    </Group>
  );
};