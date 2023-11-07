import { useCallback, useContext } from "react";

import { Text, ActionIcon, Group } from "@mantine/core";
import { useHover } from '@mantine/hooks';

import { IconX } from "@tabler/icons-react";

import { useMutate } from "../doctype";
import { IRobot } from "../@types/robot";

import { guiSelectionContext } from "../context/guiSelectionContext";
import { JournalId } from "@orbitinghail/sqlsync-worker";

export const RobotItem = ({
  docId,
  robot,
  deleteAction
}: {
  docId: JournalId;
  robot: IRobot;
  deleteAction: boolean;
}) => {
  const mutate = useMutate( docId );
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteRobot", id: robot.id })
      .catch((err) => {
        console.error("Failed to delete", err);
      });
  }, [robot.id, mutate]);

  const { guiSelection, setGuiSelection } = useContext(guiSelectionContext);
  const handleSelect = () => {
    setGuiSelection(robot.id);
  };

  const { hovered, ref } = useHover();
  const selected = () => { 
    return guiSelection == robot.id;
  };
  
  return (
    <Group ref={ref} onClick={ handleSelect } justify="space-between" gap="sm" px={12} py={4} bg={ hovered || selected() ? "#f8f9fa" : "none" }>
      <Text style={{ flex: 1 }}>
        { robot.description }
      </Text>
      { deleteAction ? <></> : 
        <ActionIcon onClick={ handleDelete } color="red" variant="subtle">
          <IconX />
        </ActionIcon>
      }
    </Group>
  );
};