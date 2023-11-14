import { useCallback } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Text, ActionIcon, Checkbox, Group } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import { useMutate } from "../doctype";
import { ITask } from "../@types/task";

export const TaskItemWidget = ({
  docId,
  task,
  fbDisabled
}: {
  docId: JournalId;
  task: ITask;
  fbDisabled: boolean;
}) => {
  const mutate = useMutate( docId );
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
    <Group wrap="nowrap" justify="space-between" gap="sm" px={12} py={4}>
      <Group wrap="nowrap">
        <Checkbox checked={ task.completed } onChange={ handleToggleCompleted } color="gray" />
        <Text>
          { task.description }: { task.state }
        </Text>
      </Group>
      { fbDisabled ? <></> : 
        <ActionIcon onClick={ handleDelete } color="gray" variant="subtle" size={20}>
          <IconX />
        </ActionIcon>
      }
    </Group>
  );
};
