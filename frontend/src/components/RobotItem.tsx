import { Text, ActionIcon, Flex } from "@mantine/core";
import { useHover } from '@mantine/hooks';
import { useCallback, useContext } from "react";
import { IconX } from "@tabler/icons-react";
import { Mutation } from "../doctype";
import { IRobot } from "../@types/robot";
import { selectionContext } from "../context/selectionContext";

export const RobotItem = ({
  robot,
  mutate,
  selected,
}: {
  robot: IRobot;
  mutate: (m: Mutation) => Promise<void>;
  selected: boolean;
}) => {
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteRobot", id: robot.id })
      .catch((err) => {
        console.error("Failed to delete", err);
      });
  }, [robot.id, mutate]);
  const { setSelection } = useContext(selectionContext);
  const handleSelect = () => {
    setSelection(robot.id);
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