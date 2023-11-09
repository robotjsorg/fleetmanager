import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea } from "@mantine/core";

import { RobotContext } from "../context/robotContext";
import { locationSelectionContext } from "../context/locationSelectionContext";

import { TaskItem } from "./TaskItem";

export const TaskList = ({
  docId,
  fbDisabled
}: {
  docId: JournalId;
  fbDisabled: boolean;
}) => {
  const { robots, tasks } = useContext( RobotContext );
  const { locationSelection } = useContext( locationSelectionContext );
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locationSelection ));
  const filteredRobotIds = filteredRobots.map(( robot ) => ( robot.id ));
  const filteredTasks = tasks.filter(( task ) => ( filteredRobotIds.includes( task.robotid ) ));

  return (
    <ScrollArea type="auto">
      {filteredTasks.map((task) => (
        <TaskItem docId={docId} key={task.id} task={task} fbDisabled={fbDisabled} />
      ))}
    </ScrollArea>
  );
};
