import { Text, ActionIcon, Flex } from "@mantine/core";
import { useCallback, useContext } from "react";
import { IconX } from "@tabler/icons-react";
import { Mutation } from "../doctype";
import { IRobot } from "../@types/robot";
import selectionContext from "../context/selectionContext";

export const RobotItem = ({
  robot,
  mutate,
}: {
  robot: IRobot;
  mutate: (m: Mutation) => Promise<void>;
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

  return (
    <Flex style={{ alignItems: "center" }} gap="sm" pb={2} onClick={handleSelect}>
      <Text style={{ flex: 1 }}>{robot.description}</Text>
      <ActionIcon color="red" variant="subtle" onClick={handleDelete} mr={20}>
        <IconX />
      </ActionIcon>
    </Flex>
  );
};
