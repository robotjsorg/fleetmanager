import { useContext } from "react";

import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, ScrollArea, Title } from "@mantine/core";

import { useQuery } from "../doctype";
import { ITask } from "../@types/task";

import { RobotContext } from "../context/robotContext";

import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";

export const TaskListContext = ({ docId }: { docId: JournalId }) => {
  const { robots } = useContext( RobotContext )!;
  const ids = robots?.map(( robot )=>( robot.id ));

  const { rows: tasks } = useQuery<ITask>(
    docId,
    sql`SELECT id, robotid, description, completed FROM tasks ORDER BY created_at`
  );
  let filteredTasks: ITask[] = []
  if( Array.isArray( tasks ) ){
    filteredTasks = tasks.filter(( task )=>( ids?.includes( task.robotid ) ));
  }

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Tasks
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(filteredTasks ?? []).map((task) => (
          <TaskItem docId={docId} key={task.id} task={task} deleteDisabled={false} />
        ))}
      </ScrollArea>
    </>
  );
};
