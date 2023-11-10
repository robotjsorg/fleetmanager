import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea, Text } from "@mantine/core";

import { RobotContext } from "../context/robotContext";
import { locSelectionContext } from "../context/locSelectionContext";

import { TaskItem } from "./TaskItem";

export const TaskList = ({
  docId,
  fbDisabled
}: {
  docId: JournalId;
  fbDisabled: boolean;
}) => {
  const { robots, tasks } = useContext( RobotContext );
  const { locSelection } = useContext( locSelectionContext );
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ));
  const filteredRobotIds = filteredRobots.map(( robot ) => ( robot.id ));
  const filteredTasks = tasks.filter(( task ) => ( filteredRobotIds.includes( task.robotid ) ));

  return (
    <ScrollArea type="auto">
      {filteredTasks.length == 0 ? <Text>No Tasks</Text> :
        filteredTasks.map((task) => (
          <TaskItem docId={docId} key={task.id} task={task} fbDisabled={fbDisabled} />
        ))
      }
    </ScrollArea>
  );
};
