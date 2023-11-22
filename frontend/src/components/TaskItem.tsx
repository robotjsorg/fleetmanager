import { useCallback, useContext, useEffect, useState } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Text, ActionIcon, Group } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import { useMutate } from "../doctype";
import { IRobot } from "../@types/robot";
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
  const [ robot, setRobot ] = useState<IRobot>(robots[0]);
  useEffect(()=>{
    setRobot( robots.filter(( robot ) => ( robot.id == task.robotid ))[0] );
  }, [robots, task.robotid]);
  const mutate = useMutate( docId );
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteTask", id: task.id }).catch((err) => {
      console.error("Failed to delete", err);
    });
  }, [task.id, mutate]);

  return (
    <Group wrap="nowrap" justify="space-between" gap="sm" px={12} py={4}>
      <Group wrap="nowrap">
        <Text>
          { robot.description }: { task.description }
        </Text>
        <Text>
          { task.state }
        </Text>
      </Group>
      { !fbDisabled &&
        <ActionIcon onClick={ handleDelete } color="gray" variant="subtle" size={20}>
          <IconX />
        </ActionIcon>
      }
    </Group>
  );
};
