import { useCallback, useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Text, ActionIcon, Checkbox, Group, Box } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import { useMutate } from "../doctype";
import { ITask } from "../@types/task";

import { RobotContext } from "../context/robotContext";

export const TaskItem = ({
  docId,
  task,
  fbDisabled
}: {
  docId: JournalId;
  task: ITask;
  fbDisabled: boolean;
}) => {
  const { robots } = useContext( RobotContext );
  const robot = robots.filter(( robot ) => ( robot.id == task.robotid ))[0];
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
    <Group justify="space-between" gap="sm" px={12} py={4}>
      <Group>
        <Checkbox checked={ task.completed } onChange={ handleToggleCompleted } color="gray" />
        <Text>
          { robot.description }: { task.description }
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
