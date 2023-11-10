import { useContext } from "react";

import { Table } from "@mantine/core";

import { RobotContext } from "../context/robotContext";
import { locSelectionContext } from "../context/locSelectionContext";

export const TaskTable = () => {
  const { robots, tasks } = useContext( RobotContext );
  const { locSelection } = useContext( locSelectionContext );
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ));
  const filteredRobotIds = filteredRobots.map(( robot ) => ( robot.id ));
  const filteredTasks = tasks.filter(( task ) => ( filteredRobotIds.includes( task.robotid ) ));
  
  // const robot = robots.filter(( robot ) => ( robot.id == task.robotid ))[0];

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Completed</Table.Th>
          <Table.Th>Robot</Table.Th>
          <Table.Th>Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
      {filteredTasks.map((task) => (
        <Table.Tr key={task.id}>
          <Table.Td>{task.completed}</Table.Td>
          <Table.Td>{task.robotid}</Table.Td>
          <Table.Td>{task.description}</Table.Td>
        </Table.Tr>
      ))}
      </Table.Tbody>
    </Table>
  );
};
