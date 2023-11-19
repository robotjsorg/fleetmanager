import { useCallback, useContext, useEffect, useState } from "react";

import { Text, Box, Table, Button, Divider, NumberInput, Group, Flex, Select, NumberFormatter } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconArrowBadgeLeft, IconArrowBadgeRight, IconLock, IconLockOpen } from "@tabler/icons-react";

import { IRobot } from "../@types/robot";
import { ITask } from "../@types/task";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { moveRobotContext } from "../context/moveRobotContext";

import { GRID_BOUND } from "./Fleetmanager";
import { JOINT_LIMITS } from "../meshes/Mesh_abb_irb52_7_120";

const RADS_DEGS = 57.2958;

export const RobotSelection = (
  {
  updateRobot
}: {
  updateRobot: (childData: {id: string, state: string, position: number[], rotation: number[]}) => void
}
) => {
  const { robots, tasks } = useContext( RobotContext );
  const { guiSelection } = useContext( guiSelectionContext );
  const [ selectedRobot, setSelectedRobot ] = useState<IRobot>(robots[robots.findIndex((robot) => robot.id == guiSelection)]);
  const [ filteredTasks, setFilteredTasks ] = useState<ITask[]>([]);
  useEffect(()=>{
    setFilteredTasks( tasks.filter(( task ) => ( task.robotid == guiSelection )) );
  }, [guiSelection, tasks]);

  const { moveRobot, setMoveRobot } = useContext( moveRobotContext );
  const [ toggleManual, setToggleManual ] = useState( true );

  const [ state, setState ] = useState("");
  const [ initFields, setInitFields ] = useState( true );
  useEffect(()=>{
    const index = robots.findIndex((robot) => robot.id == guiSelection);
    setSelectedRobot( robots[index] );
    setInitFields( true );
  }, [guiSelection, robots]);

  useEffect(()=>{
    if ( selectedRobot ) {
      setState( selectedRobot.state );
    }
  }, [selectedRobot]);

  const moveRobotForm = useForm({
    initialValues: {
      X: 0,
      Z: 0,
      theta: 0
    },
    // validate: {
    //   X: (value) => (value),
    //   Z: (value) => (value),
    //   theta: (value) => (value)
    // }
  });
  const handleMoveRobot = moveRobotForm.onSubmit(
    useCallback(
    ({ X, Z, theta }) => {
      selectedRobot && updateRobot({
        id: selectedRobot.id, 
        state: "Off", 
        position: [X, selectedRobot.position[1], Z], 
        rotation: [selectedRobot.rotation[0], selectedRobot.rotation[1], theta/RADS_DEGS]});
    }
    , [selectedRobot, updateRobot])
  );
  // TODO: Update field controls when transform controls updates, more than once. Field controls should only require one click.
  useEffect(()=>{
    if ( selectedRobot && initFields ) {
      if ( moveRobotForm.isTouched() ) {
        setInitFields( false );
      }
      moveRobotForm.setFieldValue('X', selectedRobot.position[0]);
      moveRobotForm.setFieldValue('Z', selectedRobot.position[2]);
      moveRobotForm.setFieldValue('theta', selectedRobot.rotation[2]*RADS_DEGS);
      moveRobotForm.resetTouched();
      moveRobotForm.resetDirty();
    }
  }, [initFields, moveRobotForm, selectedRobot]);

  const jointsForm = useForm({
    initialValues: {
      J1: selectedRobot ? selectedRobot.jointAngles[0] : 0,
      J2: selectedRobot ? selectedRobot.jointAngles[1] : 0,
      J3: selectedRobot ? selectedRobot.jointAngles[2] : 0,
      J4: selectedRobot ? selectedRobot.jointAngles[3] : 0,
      J5: selectedRobot ? selectedRobot.jointAngles[4] : 0,
      J6: selectedRobot ? selectedRobot.jointAngles[5] : 0
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
  // const handleManualJoints = form.onSubmit(
  //   ({ J1, J2, J3, J4, J5, J6 }) => {
  //     setJointAngles([J1, J2, J3, J4, J5, J6]);
  //   }
  // );

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
  // const handleManualTool = form.onSubmit(
  //   ({ X, Y, Z }) => {
  //     // TODO: Inverse kinematics
  //     setJointAngles([J1, J2, J3, J4, J5, J6]);
  //   }
  // );

  const handleOff = () => {
    selectedRobot.state = "Off";
    updateRobot({ id: selectedRobot.id, state: selectedRobot.state, position: selectedRobot.position, rotation: selectedRobot.rotation })
    setSelectedRobot( selectedRobot );
    setState("Off");
  };
  const handleOn = () => {
    selectedRobot.state = "Error";
    updateRobot({ id: selectedRobot.id, state: "Error", position: selectedRobot.position, rotation: selectedRobot.rotation })
    setSelectedRobot( selectedRobot );
    setState("Error");
    setMoveRobot(false);
  };
  const handleReset = () => {
    selectedRobot.state = "Manual";
    updateRobot({ id: selectedRobot.id, state: "Manual", position: selectedRobot.position, rotation: selectedRobot.rotation })
    setSelectedRobot( selectedRobot );
    setState("Manual");
    setMoveRobot(false);
  }
  const handleManual = () => {
    selectedRobot.state = "Manual";
    updateRobot({ id: selectedRobot.id, state: "Manual", position: selectedRobot.position, rotation: selectedRobot.rotation })
    setSelectedRobot( selectedRobot );
    setState("Manual");
    setMoveRobot(false);
  };
  const handleAuto = () => {
    selectedRobot.state = "Auto";
    updateRobot({ id: selectedRobot.id, state: "Auto", position: selectedRobot.position, rotation: selectedRobot.rotation })
    setSelectedRobot( selectedRobot );
    setState("Auto");
    setMoveRobot(false);
  };

  // const handleActuate = () = {

  // }
  // const handleUnactuate = () = {
    
  // }

  return (
    <Box>
      <Table withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="50%">
              <Text size="xs">
              <Text span c="gray" inherit>name: </Text>
                { selectedRobot ? selectedRobot.description : "-"}
              </Text>
            </Table.Th>
            <Table.Th w="50%">
              <Text size="xs">
                <Text span c="gray" inherit>type: </Text>
                { selectedRobot ? "ABB IRB 52" : "-"}
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>part: </Text>
                { selectedRobot ? "Not Present" : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>tool: </Text>
                { selectedRobot ? selectedRobot.toolState : "-"}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>created: </Text>
                { selectedRobot ? selectedRobot.created_at.split(" ")[0] : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>updated: </Text>
                { selectedRobot ? selectedRobot.created_at.split(" ")[0] : "-"}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>x: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.position[0]} decimalScale={1} /> : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>y: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.position[1]} decimalScale={1} /> : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>z: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.position[2]} decimalScale={1} /> : "-"}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>&phi;: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.rotation[0]*RADS_DEGS} decimalScale={1} /> : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>&theta;: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.rotation[1]*RADS_DEGS} decimalScale={1} /> : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>&psi;: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.rotation[2]*RADS_DEGS} decimalScale={0} /> : "-"}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>state: </Text>
                { selectedRobot ? selectedRobot.state : "-"}
              </Text>    
            </Table.Td>
            <Table.Td>
              { !selectedRobot ?
                <Box h={30}></Box>
              : selectedRobot.state == "Error" ?
                <>
                  <Button onClick={handleReset} variant="default" color="gray" size="xs">
                    Reset
                  </Button>
                  <Button onClick={handleOff} variant="default" color="gray" size="xs" ml={8}>
                    Off
                  </Button>
                </>
              : selectedRobot.state == "Manual" ?
                <>
                  <Button onClick={handleAuto} variant="default" color="gray" size="xs">
                    Auto
                  </Button>
                  <Button onClick={handleOff} variant="default" color="gray" size="xs" ml={8}>
                    Off
                  </Button>
                </>
              : selectedRobot.state == "Auto" ?
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
      { selectedRobot && state == "Off" ?
        <>
          <Divider mx="xs" />
          <form onSubmit={handleMoveRobot}>
            <Group gap={0} p="xs">
              <Flex w="50%" gap="xs" px="xs" pb="xs" direction="column" align="center">
                <Button onClick={()=>{moveRobot ? setMoveRobot(false) : setMoveRobot(true)}}
                  variant={moveRobot ? "outline" : "default"} color="gray" size="xs"
                  leftSection={moveRobot ? <IconLockOpen size={18} /> : <IconLock size={18} />}>
                  Move Robot
                </Button>
              </Flex>
              <Flex w="50%" gap="xs" px="xs" pb="xs" direction="column" align="center" onMouseUp={()=>{handleMoveRobot()}}>
                <NumberInput disabled={!moveRobot}
                  leftSection={<Text span size="xs">X</Text>}
                  size="xs"
                  clampBehavior="strict"
                  step={0.1}
                  min={-GRID_BOUND}
                  max={GRID_BOUND}
                  decimalScale={1}
                  onKeyUp={()=>{handleMoveRobot()}}
                  {...moveRobotForm.getInputProps("X")}
                />
                <NumberInput disabled={!moveRobot}
                  leftSection={<Text span size="xs">Z</Text>}
                  size="xs"
                  clampBehavior="strict"
                  step={0.1}
                  min={-GRID_BOUND}
                  max={GRID_BOUND}
                  decimalScale={1}
                  onKeyUp={()=>{handleMoveRobot()}}
                  {...moveRobotForm.getInputProps("Z")}
                />
                <NumberInput disabled={!moveRobot}
                  leftSection={<Text span size="xs">&theta;</Text>}
                  size="xs"
                  clampBehavior="strict"
                  step={15.0}
                  min={-Math.PI*RADS_DEGS}
                  max={Math.PI*RADS_DEGS}
                  allowDecimal={false}
                  onKeyUp={()=>{handleMoveRobot()}}
                  {...moveRobotForm.getInputProps("theta")}
                />
              </Flex>
            </Group>
          </form>
        </>
        : selectedRobot && state == "Error" ?
        <>
          <Divider mx="xs" />
          <Group gap={0} p="xs">
            <Text size="xs">
              <Text span c="red" inherit>message: </Text>
              Robot error text placeholder.
            </Text>
          </Group>
        </>
      : selectedRobot && state == "Manual" ?
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
                    startValue={selectedRobot.jointAngles[0]}
                    min={JOINT_LIMITS[0][0]}
                    max={JOINT_LIMITS[0][1]}
                    {...jointsForm.getInputProps("J1")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J2</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={selectedRobot.jointAngles[1]}
                    min={JOINT_LIMITS[1][0]}
                    max={JOINT_LIMITS[1][1]}
                    {...jointsForm.getInputProps("J2")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J3</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={selectedRobot.jointAngles[2]}
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
                    startValue={selectedRobot.jointAngles[3]}
                    min={JOINT_LIMITS[3][0]}
                    max={JOINT_LIMITS[3][1]}
                    {...jointsForm.getInputProps("J4")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J5</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={selectedRobot.jointAngles[4]}
                    min={JOINT_LIMITS[4][0]}
                    max={JOINT_LIMITS[4][1]}
                    {...jointsForm.getInputProps("J5")}
                  />
                  <NumberInput disabled
                    leftSection={<Text span size="xs">J6</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={0.1}
                    startValue={selectedRobot.jointAngles[5]}
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
                  <Button onClick={()=>{ selectedRobot.toolState = "Actuated" }}
                    size="xs" variant="default" rightSection={<IconArrowBadgeRight size={18}/>}>
                    Actuate
                  </Button>
                  <Button onClick={()=>{ selectedRobot.toolState = "Unactuated" }}
                    size="xs" variant="default" leftSection={<IconArrowBadgeLeft size={18}/>}>
                    Unactuate
                  </Button>
                  <Select
                    size="xs"
                    placeholder="Move"
                    data={['Home', 'Pre Pick A', 'Pick A', 'Post Pick A', 'Pre Place B', 'Place B', 'Post Place B']}
                  />
                </Flex>
              </Group>
            </form> 
          }
        </>
      : selectedRobot && state == "Auto" &&
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