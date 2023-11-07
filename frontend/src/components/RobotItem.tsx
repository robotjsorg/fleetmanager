import { useCallback, useContext } from "react";

import { Text, ActionIcon, Flex } from "@mantine/core";
import { useHover } from '@mantine/hooks';

import { IconX } from "@tabler/icons-react";

import { useMutate } from "../doctype";
import { IRobot } from "../@types/robot";

import { guiSelectionContext } from "../context/guiSelectionContext";
import { JournalId } from "@orbitinghail/sqlsync-worker";

export const RobotItem = ({
  docId,
  robot,
  selected
}: {
  docId: JournalId;
  robot: IRobot;
  selected: boolean;
}) => {
  const mutate = useMutate( docId );
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteRobot", id: robot.id })
      .catch((err) => {
        console.error("Failed to delete", err);
      });
  }, [robot.id, mutate]);

  const { setGuiSelection } = useContext(guiSelectionContext);
  const handleSelect = () => {
    setGuiSelection(robot.id);
  };

  const { hovered, ref } = useHover();

  return (
    <Flex ref={ref} style={{ alignItems: "center" }} gap="sm" px={12} py={4} onClick={handleSelect} bg={hovered || selected ? "#f8f9fa" : "none"}>
      <Text style={{ flex: 1 }}>{robot.description}</Text>
      <ActionIcon color="red" variant="subtle" onClick={handleDelete}>
        <IconX />
      </ActionIcon>
    </Flex>
  );
};