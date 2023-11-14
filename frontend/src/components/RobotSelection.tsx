import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea, Text, Divider, Box } from "@mantine/core"; // Table,

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";

import { TaskItemWidget } from "./TaskItemWidget";

export const RobotSelection = ({
  docId,
  fbDisabled
}: {
  docId: JournalId;
  fbDisabled: boolean;
}) => {
  const { robots, tasks } = useContext( RobotContext );
  const { guiSelection } = useContext( guiSelectionContext );
  const filteredRobots = robots.filter(( robot ) => ( robot.id == guiSelection ));
  
  let selectedRobotDescription = ""
  if ( Array.isArray( filteredRobots ) && filteredRobots.length > 0 ){
    selectedRobotDescription = filteredRobots[0].description;
  }
  const filteredTasks = tasks.filter(( task ) => ( task.robotid == guiSelection ));

  return (
    <>
      { guiSelection == "no selection" ?
        <Box h={19}>
          <Divider mt={9} />
        </Box> :
        <Divider label={selectedRobotDescription} labelPosition="center" /> }
      
      {/* <Table>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Desc1</Table.Td>
            <Table.Td>Val1</Table.Td>
            <Table.Td>Desc2</Table.Td>
            <Table.Td>Val2</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Desc3</Table.Td>
            <Table.Td>Val3</Table.Td>
            <Table.Td>Desc4</Table.Td>
            <Table.Td>Val4</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Desc5</Table.Td>
            <Table.Td>Val6</Table.Td>
            <Table.Td>Desc6</Table.Td>
            <Table.Td>Val6</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table> */}
      <ScrollArea type="auto">
        { guiSelection == "no selection" ?
          <Text>No Selection</Text> :
        filteredTasks.length == 0 ?
          <Text>Robot has No Tasks</Text> :
        filteredTasks.map((task) => (
          <TaskItemWidget docId={docId} key={task.id} task={task} fbDisabled={fbDisabled} />
        ))
        }
      </ScrollArea>
    </>
  );
};