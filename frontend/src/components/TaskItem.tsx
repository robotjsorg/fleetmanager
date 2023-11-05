import { Text, ActionIcon, Checkbox, Flex } from "@mantine/core";
import { useCallback } from "react";
import { IconX } from "@tabler/icons-react";
import { Mutation } from "../doctype";
import { ITask } from "../@types/task";

export const TaskItem = ({
  task,
  mutate,
}: {
  task: ITask;
  mutate: (m: Mutation) => Promise<void>;
}) => {
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteTask", id: task.id }).catch((err) => {
      console.error("Failed to delete", err);
    });
  }, [task.id, mutate]);

  const handleToggleCompleted = useCallback(() => {
    mutate({ tag: "ToggleCompleted", id: task.id }).catch((err) => {
      console.error("Failed to toggle completed", err);
    });
  }, [task.id, mutate]);

  return (
    <Flex style={{ alignItems: "center" }} gap="sm" pb={2}>
      <Checkbox checked={task.completed} onChange={handleToggleCompleted} disabled={task.completed} />
      <Text style={{ flex: 1 }}>{task.description}</Text>
      <ActionIcon color="red" variant="subtle" onClick={handleDelete} mr={20}>
        <IconX />
      </ActionIcon>
    </Flex>
  );
};
