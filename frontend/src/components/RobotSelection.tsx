import { useContext, useEffect, useState } from "react";

import { Text, Box, Table, Button, Divider } from "@mantine/core";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { ITask } from "../@types/task";
import { IRobot } from "../@types/robot";

export const RobotSelection = () => {
  const { robots, tasks } = useContext( RobotContext );
  const { guiSelection } = useContext( guiSelectionContext );

  let description = "";
  let createdAt = "";
  let state = "";
  let position: [number, number, number] = [0, 0, 0];
  let rotation: [number, number, number] = [0, 0, 0];
  const [ selectedRobot, setSelectedRobot ] = useState<IRobot | null>(null);
  useEffect(()=>{
    const selectedRobots = robots.filter(( robot ) => ( robot.id == guiSelection ));
    if ( Array.isArray( selectedRobots ) && selectedRobots.length > 0 ) {
      setSelectedRobot( selectedRobots[0] );
    }
  },[guiSelection, robots]);

  if ( selectedRobot ) {
    description = selectedRobot.description;
    createdAt = selectedRobot.created_at;
    state = selectedRobot.state;
    position = selectedRobot.lastKnownPosition as [number, number, number];
    rotation = selectedRobot.lastKnownPosition as [number, number, number];  
  }

  const [ filteredTasks, setFilteredTasks ] = useState<ITask[]>([]);
  useEffect(()=>{
    setFilteredTasks(tasks.filter(( task ) => ( task.robotid == guiSelection )) );
  },[guiSelection, tasks])

  return (
    <Box>
      <Table withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="50%">
              <Text size="xs">
              <Text span c="gray" inherit>name: </Text>
                { guiSelection != "no selection" ? description : "-"}
              </Text>
            </Table.Th>
            <Table.Th w="50%">
              <Text size="xs">
                <Text span c="gray" inherit>type: </Text>
                { guiSelection != "no selection" ? "ABB IRB 52" : "-"}
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>created: </Text>
                { guiSelection != "no selection" ? createdAt.split(" ")[0] : "-"}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>updated: </Text>
                { guiSelection != "no selection" ? createdAt.split(" ")[0] : "-"}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>x: </Text>
                { guiSelection != "no selection" ? position[0].toPrecision(3) : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>y: </Text>
                { guiSelection != "no selection" ? position[1].toPrecision(3) : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>z: </Text>
                { guiSelection != "no selection" ? position[2].toPrecision(3) : "-"}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>&phi;: </Text>
                { guiSelection != "no selection" ? rotation[0].toPrecision(3) : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>&theta;: </Text>
                { guiSelection != "no selection" ? rotation[1].toPrecision(3) : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>&psi;: </Text>
                { guiSelection != "no selection" ? rotation[2].toPrecision(3) : "-"}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>part: </Text>
                { guiSelection != "no selection" ? "Not Present" : "-"}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>tool: </Text>
                { guiSelection != "no selection" ? "Unactuated" : "-"}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>state: </Text>
                { guiSelection != "no selection" ? state : "-"}
              </Text>    
            </Table.Td>
            <Table.Td>
              { guiSelection == "no selection" ?
                <Box h={30}></Box>
              : state == "Error" ?
                <Button variant="default" color="gray" size="xs">
                  Reset
                </Button>
              : state == "Manual" ?
                <>
                  <Button variant="default" color="gray" size="xs">
                    Automatic
                  </Button>
                  <Button variant="default" color="gray" size="xs" ml={8}>
                    Off
                  </Button>
                </>
              : state == "Automatic" ?
                <>
                  <Button variant="default" color="gray" size="xs">
                    Manual
                  </Button>
                  <Button variant="default" color="gray" size="xs" ml={8}>
                    Off
                  </Button>
                </>
              : // state == "Off"
                <Button variant="default" color="gray" size="xs">
                  Power On
                </Button>
              }
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      {state == "Error" && guiSelection != "no selection" ?
        <>
          <Divider />
          <Box>
            Error
          </Box>
        </>
      : state == "Manual" && guiSelection != "no selection" ?
        <>
          <Divider />
          <Box>
            Manual
          </Box>
        </>
      : state == "Automatic" && guiSelection != "no selection" ?
        <>
          <Divider />
          <Table withRowBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Td>
                  <Text size="xs">
                    <Text span c="gray" inherit>task: </Text>
                    {filteredTasks.length > 0 ? filteredTasks.map(( task ) => ( task.description )) : "-"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs">
                    <Text span c="gray" inherit>completed: </Text>
                    {filteredTasks.length > 0 ? filteredTasks.map(( task ) => ( task.completed ? "True" : "False" )) : "-"}
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
            </Table.Tbody>
          </Table>
        </>
      : guiSelection != "no selection" ? // state == "Off"
      <>
        <Divider />
        <Box>
          Off
        </Box>
      </>
      :
        <></>
      }
    </Box>
  );
};