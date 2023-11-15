import { useContext, useEffect, useState } from "react";

import { Text, Box, Table, Button, Divider, NumberInput, Group, Flex, Select } from "@mantine/core";

import { IRobot } from "../@types/robot";
import { ITask } from "../@types/task";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { moveRobotContext } from "../context/moveRobotContext";

import { JOINT_LIMITS } from "../meshes/Mesh_abb_irb52_7_120";
import { useForm } from "@mantine/form";
import { IconLock, IconLockOpen } from "@tabler/icons-react";

export const RobotSelection = () => {
  const { robots, tasks } = useContext( RobotContext );
  const { guiSelection } = useContext( guiSelectionContext );
  const { moveRobot, setMoveRobot } = useContext(moveRobotContext);

  const [ selectedRobot, setSelectedRobot ] = useState<IRobot | null>(null);
  useEffect(()=>{
    const selectedRobots = robots.filter(( robot ) => ( robot.id == guiSelection ));
    if ( Array.isArray( selectedRobots ) && selectedRobots.length > 0 ) {
      setSelectedRobot( selectedRobots[0] );
    }
  }, [guiSelection, robots]);

  const [ jointAngles, setJointAngles ] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [state, setState] = useState("");
  const [toggleManual, setToggleManual] = useState(true);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0 ,0]);
  useEffect(()=>{
    if ( selectedRobot ) {
      setJointAngles( selectedRobot.lastKnownJointAngles as [number, number, number, number, number, number]  );
      setDescription( selectedRobot.description );
      setCreatedAt( selectedRobot.created_at );
      setState( selectedRobot.state );
      setPosition( selectedRobot.lastKnownPosition as [number, number, number] );
      setRotation( selectedRobot.lastKnownPosition as [number, number, number] );  
    }
  }, [selectedRobot])
  
  const [ filteredTasks, setFilteredTasks ] = useState<ITask[]>([]);
  useEffect(()=>{
    setFilteredTasks(tasks.filter(( task ) => ( task.robotid == guiSelection )) );
  }, [guiSelection, tasks])

  const [ toolState, setToolState ] = useState( "Unactuated" );

  const handleOff = () => {
    setState( "Off" );
    if ( selectedRobot ) {
      selectedRobot.state = "Off";
    }
  };

  const handleOn = () => {
    setState( "Error" );
    if ( selectedRobot ) {
      selectedRobot.state = "Error";
    }
  };

  const handleReset = () => {
    setState( "Manual" );
    if ( selectedRobot ) {
      selectedRobot.state = "Manual";
    }
  }

  const handleManual = () => {
    setState( "Manual" );
    if ( selectedRobot ) {
      selectedRobot.state = "Manual";
    }
  };

  const handleAuto = () => {
    setState( "Auto" );
    if ( selectedRobot ) {
      selectedRobot.state = "Auto" ;
    }
  };

  const jointsForm = useForm({
    initialValues: {
      J1: jointAngles[0],
      J2: jointAngles[1],
      J3: jointAngles[2],
      J4: jointAngles[3],
      J5: jointAngles[4],
      J6: jointAngles[5]
    },
    validate: {
      J1: (value) => (value),
      J2: (value) => (value),
      J3: (value) => (value),
      J4: (value) => (value),
      J5: (value) => (value),
      J6: (value) => (value)
    }
  });

  const toolForm = useForm({
    initialValues: {
      X: 0,
      Y: 0,
      Z: 0
    },
    validate: {
      X: (value) => (value),
      Y: (value) => (value),
      Z: (value) => (value)
    }
  });

  // const handleManualJoints = form.onSubmit(
  //   ({ J1, J2, J3, J4, J5, J6 }) => {
  //     setJointAngles([J1, J2, J3, J4, J5, J6]);
  //   }
  // );

  // const handleManualTool = form.onSubmit(
  //   ({ X, Y, Z }) => {
  //     // TODO: Inverse kinematics
  //     setJointAngles([J1, J2, J3, J4, J5, J6]);
  //   }
  // );

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
                <Text span c="gray" inherit>part: </Text>
                { guiSelection != "no selection" ? "Not Present" : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>tool: </Text>
                { guiSelection != "no selection" ? toolState : "-"}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>created: </Text>
                { guiSelection != "no selection" ? createdAt.split(" ")[0] : "-"}
              </Text>
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
                <Text span c="gray" inherit>state: </Text>
                { guiSelection != "no selection" ? state : "-"}
              </Text>    
            </Table.Td>
            <Table.Td>
              { guiSelection == "no selection" ?
                <Box h={30}></Box>
              : state == "Error" ?
                <>
                  <Button onClick={handleReset} variant="default" color="gray" size="xs">
                    Reset
                  </Button>
                  <Button onClick={handleOff} variant="default" color="gray" size="xs" ml={8}>
                    Off
                  </Button>
                </>
              : state == "Manual" ?
                <>
                  <Button onClick={handleAuto} variant="default" color="gray" size="xs">
                    Auto
                  </Button>
                  <Button onClick={handleOff} variant="default" color="gray" size="xs" ml={8}>
                    Off
                  </Button>
                </>
              : state == "Auto" ?
                <>
                  <Button onClick={handleManual} variant="default" color="gray" size="xs">
                    Manual
                  </Button>
                  <Button onClick={handleOff} variant="default" color="gray" size="xs" ml={8}>
                    Off
                  </Button>
                </>
              : // state == "Off"
                <Button onClick={handleOn} variant="default" color="gray" size="xs">
                  Power On
                </Button>
              }
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      {state == "Off" && guiSelection != "no selection" ?
        <>
          <Divider mx="xs" />
          <form>
            <Group gap={0} p="xs">
              <Flex w="50%" gap="xs" px="xs" pb="xs" direction="column" align="center">
                <Button onClick={()=>{moveRobot ? setMoveRobot(false) : setMoveRobot(true)}}
                  variant={moveRobot ? "outline" : "default"} color="gray" size="xs"
                  leftSection={moveRobot ? <IconLockOpen size={18} /> : <IconLock size={18} />}>
                  Move Robot
                </Button>
              </Flex>
              <Flex w="50%" gap="xs" px="xs" pb="xs" direction="column" align="center">
                <NumberInput disabled={!moveRobot}
                  leftSection={<Text span size="xs">X</Text>}
                  size="xs"
                  clampBehavior="strict"
                  step={0.1}
                  startValue={0}
                  min={-10}
                  max={10}
                  {...toolForm.getInputProps("X")}
                />
                <NumberInput disabled={!moveRobot}
                  leftSection={<Text span size="xs">Y</Text>}
                  size="xs"
                  clampBehavior="strict"
                  step={0.1}
                  startValue={0}
                  min={-10}
                  max={10}
                  {...toolForm.getInputProps("Y")}
                />
                <NumberInput disabled={!moveRobot}
                  leftSection={<Text span size="xs">Z</Text>}
                  size="xs"
                  clampBehavior="strict"
                  step={0.1}
                  startValue={0}
                  min={-10}
                  max={10}
                  {...toolForm.getInputProps("Z")}
                />
              </Flex>
            </Group>
          </form>
        </>
        : state == "Error" && guiSelection != "no selection" ?
        <>
          <Divider mx="xs" />
          <Group gap={0} p="xs">
            <Text size="xs">
              <Text span c="red" inherit>message: </Text>
              Robot error text placeholder.
            </Text>
          </Group>
        </>
      : state == "Manual" && guiSelection != "no selection" ?
        <>
          <Divider mx="xs" />
          <Group gap="xs" py="xs" justify="center">
            <Button onClick={()=>setToggleManual(true)} variant={toggleManual ? "light" : "subtle"} color="gray" size="xs">
              Joints
            </Button>
            <Button onClick={()=>setToggleManual(false)} variant={!toggleManual ? "light" : "subtle"}  color="gray" size="xs" ml={8}>
              Tool
            </Button>
          </Group>
          {toggleManual ? // Joints
            <form>
              <Group gap={0} px="xs" pb="xs">
                <Flex w="50%" gap="xs" px="xs" direction="column">
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J1</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={jointAngles[0]}
                    min={JOINT_LIMITS[0][0]}
                    max={JOINT_LIMITS[0][1]}
                    {...jointsForm.getInputProps("J1")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J2</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={jointAngles[1]}
                    min={JOINT_LIMITS[1][0]}
                    max={JOINT_LIMITS[1][1]}
                    {...jointsForm.getInputProps("J2")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J3</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={jointAngles[2]}
                    min={JOINT_LIMITS[2][0]}
                    max={JOINT_LIMITS[2][1]}
                    {...jointsForm.getInputProps("J3")}
                  />
                </Flex>
                <Flex w="50%" gap="xs" px="xs" direction="column">
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J4</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={jointAngles[3]}
                    min={JOINT_LIMITS[3][0]}
                    max={JOINT_LIMITS[3][1]}
                    {...jointsForm.getInputProps("J4")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J5</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={jointAngles[4]}
                    min={JOINT_LIMITS[4][0]}
                    max={JOINT_LIMITS[4][1]}
                    {...jointsForm.getInputProps("J5")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J6</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={jointAngles[5]}
                    min={JOINT_LIMITS[5][0]}
                    max={JOINT_LIMITS[5][1]}
                    {...jointsForm.getInputProps("J6")}
                  />
                </Flex>
              </Group>
            </form>
          : // Tool
            <form>
              <Group gap={0} px="xs" pb="xs">
                <Flex w="50%" gap="xs" px="xs" direction="column">
                  <NumberInput disabled
                    leftSection={<Text span size="xs">X</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={0}
                    min={-10}
                    max={10}
                    {...toolForm.getInputProps("X")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">Y</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={0}
                    min={-10}
                    max={10}
                    {...toolForm.getInputProps("Y")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">Z</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={0}
                    min={-10}
                    max={10}
                    {...toolForm.getInputProps("Z")}
                  />
                </Flex>
                <Flex w="50%" gap="xs" px="xs" direction="column">
                  <Button onClick={()=>{setToolState("Actuated")}} size="xs" variant="default">
                    Actuate
                  </Button>
                  <Button onClick={()=>{setToolState("Unactuated")}} size="xs" variant="default">
                    Unactuate
                  </Button>
                  {/* <Select
                    size="xs"
                    data={['Actuated', 'Unactuated']}
                    defaultValue={toolState}
                    onChange={(e)=>{setToolState(e!.valueOf())}}
                  /> */}
                </Flex>
              </Group>
            </form> 
          }
        </>
      : state == "Auto" && guiSelection != "no selection" &&
        <>
          <Divider mx="xs" />
          <Table withRowBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Td w="50%">
                  <Text size="xs">
                    <Text span c="gray" inherit>task: </Text>
                    {filteredTasks.length > 0 ? filteredTasks.map(( task ) => ( task.description )) : "-"}
                  </Text>
                </Table.Td>
                <Table.Td w="50%">
                  <Text size="xs">
                    <Text span c="gray" inherit>created: </Text>
                    {filteredTasks.length > 0 ? filteredTasks.map(( task ) => ( task.created_at.split(" ")[0] )) : "-"}
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>
                  <Text size="xs">
                    <Text span c="gray" inherit>state: </Text>
                    {filteredTasks.length > 0 ? filteredTasks.map(( task ) => ( task.state )) : "-"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs">
                    <Text span c="gray" inherit>completed: </Text>
                    {filteredTasks.length > 0 ? filteredTasks.map(( task ) => ( task.completed ? "True" : "False" )) : "-"}
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </>
      }
    </Box>
  );
};