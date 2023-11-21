import { useCallback, useContext, useEffect, useState } from "react";

import { Text, Box, Table, Button, Divider, NumberInput, Group, Flex, Select, NumberFormatter, SegmentedControl, Center } from "@mantine/core";
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
  updateRobot: (childData: {id: string, toolState: string, state: string, position: number[], rotation: number[], jointAngles: number[]}) => void
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
  const [ toolState, setToolState ] = useState("");
  const [ positionFields, setPositionFields ] = useState( true );
  const [ jointAngleFields, setJointAngleFields ] = useState( true );
  
  useEffect(()=>{
    const index = robots.findIndex((robot) => robot.id == guiSelection);
    setSelectedRobot( robots[index] );
    setPositionFields( true );
    setJointAngleFields( true );
  }, [guiSelection, robots]);

  useEffect(()=>{
    if ( selectedRobot ) {
      setState( selectedRobot.state );
      setToolState( selectedRobot.toolState );
    }
  }, [selectedRobot]); 

  const moveRobotForm = useForm({
    initialValues: {
      X: 0,
      Z: 0,
      theta: 0
    },
    validate: {
      X: (value) => (value < -GRID_BOUND || value > GRID_BOUND || value.toString() == "" || value.toString() == "-" && "Enter a number"),
      Z: (value) => (value < -GRID_BOUND || value > GRID_BOUND || value.toString() == "" || value.toString() == "-" && "Enter a number"),
      theta: (value) => (value < -Math.PI*RADS_DEGS || value > Math.PI*RADS_DEGS || value.toString() == "" || value.toString() == "-" && "Enter a number"),
    }
  });
  const handleMoveRobot = moveRobotForm.onSubmit(
    useCallback(
      ({ X, Z, theta }) => {
        selectedRobot && updateRobot({
          id: selectedRobot.id,
          state: "Off",
          toolState: selectedRobot.toolState,
          position: [X, selectedRobot.position[1], Z],
          rotation: [selectedRobot.rotation[0], selectedRobot.rotation[1], theta/RADS_DEGS],
          jointAngles: selectedRobot.jointAngles
        });
      }
    , [selectedRobot, updateRobot])
  );
  useEffect(()=>{
    if ( selectedRobot && positionFields ) {
      const { X: X, Z: Z, theta: theta } = moveRobotForm.values;
      if ( X != selectedRobot.position[0] || Z != selectedRobot.position[2] || theta != selectedRobot.rotation[2] ) {
        moveRobotForm.setFieldValue('X', selectedRobot.position[0]);
        moveRobotForm.setFieldValue('Z', selectedRobot.position[2]);
        moveRobotForm.setFieldValue('theta', selectedRobot.rotation[2]*RADS_DEGS);
        setPositionFields( false );
      }
    }
  }, [positionFields, moveRobotForm, selectedRobot]);

  const jointsForm = useForm({
    initialValues: {
      J1: 0,
      J2: 0,
      J3: 0,
      J4: 0,
      J5: 0,
      J6: 0
    },
    validate: {
      J1: (value) => (value/RADS_DEGS < JOINT_LIMITS[0][0] || value/RADS_DEGS > JOINT_LIMITS[0][1] || value.toString() == "" || value.toString() == "-" && "Enter a number"),
      J2: (value) => (value/RADS_DEGS < JOINT_LIMITS[1][0] || value/RADS_DEGS > JOINT_LIMITS[1][1] || value.toString() == "" || value.toString() == "-" && "Enter a number"),
      J3: (value) => (value/RADS_DEGS < JOINT_LIMITS[2][0] || value/RADS_DEGS > JOINT_LIMITS[2][1] || value.toString() == "" || value.toString() == "-" && "Enter a number"),
      J4: (value) => (value/RADS_DEGS < JOINT_LIMITS[3][0] || value/RADS_DEGS > JOINT_LIMITS[3][1] || value.toString() == "" || value.toString() == "-" && "Enter a number"),
      J5: (value) => (value/RADS_DEGS < JOINT_LIMITS[4][0] || value/RADS_DEGS > JOINT_LIMITS[4][1] || value.toString() == "" || value.toString() == "-" && "Enter a number"),
      J6: (value) => (value/RADS_DEGS < JOINT_LIMITS[5][0] || value/RADS_DEGS > JOINT_LIMITS[5][1] || value.toString() == "" || value.toString() == "-" && "Enter a number")
    }
  });
  const handleManualJoints = jointsForm.onSubmit(
    useCallback(
      ({ J1, J2, J3, J4, J5, J6 }) => {
        selectedRobot &&
        updateRobot({
          id: selectedRobot.id,
          state: "Manual",
          toolState: selectedRobot.toolState,
          position: selectedRobot.position,
          rotation: selectedRobot.rotation,
          jointAngles: [J1/RADS_DEGS, J2/RADS_DEGS, J3/RADS_DEGS, J4/RADS_DEGS, J5/RADS_DEGS, J6/RADS_DEGS]
        })
      }
    , [selectedRobot, updateRobot])
  );
  useEffect(()=>{
    if ( selectedRobot && jointAngleFields ) {
      const { J1: J1, J2: J2, J3: J3, J4: J4, J5: J5, J6: J6 } = jointsForm.values;
      if ( J1 != selectedRobot.jointAngles[0] || J2 != selectedRobot.jointAngles[1] || J3 != selectedRobot.jointAngles[2] || 
           J4 != selectedRobot.jointAngles[3] || J5 != selectedRobot.jointAngles[4] || J6 != selectedRobot.jointAngles[5]
      ) {
        jointsForm.setFieldValue('J1', selectedRobot.jointAngles[0]*RADS_DEGS);
        jointsForm.setFieldValue('J2', selectedRobot.jointAngles[1]*RADS_DEGS);
        jointsForm.setFieldValue('J3', selectedRobot.jointAngles[2]*RADS_DEGS);
        jointsForm.setFieldValue('J4', selectedRobot.jointAngles[3]*RADS_DEGS);
        jointsForm.setFieldValue('J5', selectedRobot.jointAngles[4]*RADS_DEGS);
        jointsForm.setFieldValue('J6', selectedRobot.jointAngles[5]*RADS_DEGS);
        setJointAngleFields( false );
      }
    }
  }, [jointAngleFields, jointsForm, selectedRobot]);

  const handleOff = () => {
    selectedRobot.state = "Off";
    updateRobot({
      id: selectedRobot.id,
      state: "Off",
      toolState: selectedRobot.toolState,
      position: selectedRobot.position,
      rotation: selectedRobot.rotation,
      jointAngles: selectedRobot.jointAngles
    });
    setSelectedRobot( selectedRobot );
    setState("Off");
  };
  const handleOn = () => {
    handleReset();
    // selectedRobot.state = "Error";
    // updateRobot({
    //   id: selectedRobot.id,
    //   state: "Error",
    //   toolState: selectedRobot.toolState,
    //   position: selectedRobot.position,
    //   rotation: selectedRobot.rotation,
    //   jointAngles: selectedRobot.jointAngles
    // });
    // setSelectedRobot( selectedRobot );
    // setState("Error");
    // setMoveRobot(false);
  };
  const handleReset = () => {
    selectedRobot.state = "Manual";
    updateRobot({
      id: selectedRobot.id,
      state: "Manual",
      toolState: selectedRobot.toolState,
      position: selectedRobot.position,
      rotation: selectedRobot.rotation,
      jointAngles: selectedRobot.jointAngles
    });
    setSelectedRobot( selectedRobot );
    setState("Manual");
    setMoveRobot(false);
  }
  const handleManual = () => {
    selectedRobot.state = "Manual";
    updateRobot({
      id: selectedRobot.id,
      state: "Manual",
      toolState: selectedRobot.toolState,
      position: selectedRobot.position,
      rotation: selectedRobot.rotation,
      jointAngles: selectedRobot.jointAngles
    });
    setSelectedRobot( selectedRobot );
    setState("Manual");
    setMoveRobot(false);
  };
  const handleAuto = () => {
    selectedRobot.state = "Auto";
    updateRobot({
      id: selectedRobot.id,
      state: "Auto",
      toolState: selectedRobot.toolState,
      position: selectedRobot.position,
      rotation: selectedRobot.rotation,
      jointAngles: selectedRobot.jointAngles
    });
    setSelectedRobot( selectedRobot );
    setState("Auto");
    setMoveRobot(false);
  };
  const handleActuate = () => {
    selectedRobot.toolState = "Actuated";
    updateRobot({
      id: selectedRobot.id,
      state: selectedRobot.state,
      toolState: "Actuated",
      position: selectedRobot.position,
      rotation: selectedRobot.rotation,
      jointAngles: selectedRobot.jointAngles
    });
    setSelectedRobot( selectedRobot );
    setToolState("Actuated");
  };
  const handleUnactuate = () => {
    selectedRobot.toolState = "Unactuated";
    updateRobot({
      id: selectedRobot.id,
      state: selectedRobot.state,
      toolState: "Unactuated",
      position: selectedRobot.position,
      rotation: selectedRobot.rotation,
      jointAngles: selectedRobot.jointAngles
    });
    setSelectedRobot( selectedRobot );
    setToolState("Unactuated");
  };

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
                <Text span c="gray" inherit>x: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.position[0]} decimalScale={1} /> : "-"}
              </Text>
              {/* <Text size="xs">
                <Text span c="gray" inherit>y: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.position[1]} decimalScale={1} /> : "-"}
              </Text> */}
              <Text size="xs">
                <Text span c="gray" inherit>z: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.position[2]} decimalScale={1} /> : "-"}
              </Text>
              {/* <Text size="xs">
                <Text span c="gray" inherit>&phi;: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.rotation[0]*RADS_DEGS} decimalScale={0} /> : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>&theta;: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.rotation[1]*RADS_DEGS} decimalScale={0} /> : "-"}
              </Text> */}
              <Text size="xs">
                <Text span c="gray" inherit>&psi;: </Text>
                { selectedRobot ? <NumberFormatter value={selectedRobot.rotation[2]*RADS_DEGS} decimalScale={0} /> : "-"}
              </Text>
            </Table.Td>
            {/* <Table.Td>
              <Text size="xs">
                <Text span c="gray" inherit>created: </Text>
                { selectedRobot ? selectedRobot.created_at.split(" ")[0] : "-"}
              </Text>
              <Text size="xs">
                <Text span c="gray" inherit>updated: </Text>
                { selectedRobot ? selectedRobot.created_at.split(" ")[0] : "-"}
              </Text>
            </Table.Td> */}
          </Table.Tr>
          <Table.Tr>
            <Table.Td pb="xs">
              <Text size="xs">
                <Text span c="gray" inherit>state: </Text>
                { selectedRobot ? selectedRobot.state : "-"}
              </Text>    
            </Table.Td>
            <Table.Td pb="xs">
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
              <Flex w="50%" gap="xs" px="xs" pb="xs" direction="column" align="center"
                onMouseOver={()=>{setPositionFields( true )}}
                onMouseUp={()=>{handleMoveRobot()}}>
                <NumberInput disabled={!moveRobot}
                  leftSection={<Text span size="xs">X</Text>}
                  size="xs"
                  clampBehavior="strict"
                  step={0.1}
                  min={-GRID_BOUND}
                  max={GRID_BOUND}
                  decimalScale={1}
                  onKeyUp={(e)=>{if(e.key != "Delete"){handleMoveRobot(), setPositionFields( true )}}}
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
                  onKeyUp={(e)=>{if(e.key != "Delete"){handleMoveRobot(), setPositionFields( true )}}}
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
                  onKeyUp={(e)=>{if(e.key != "Delete"){handleMoveRobot(), setPositionFields( true )}}}
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
              <Group gap={0} px="xs" pb="xs" onMouseUp={()=>{handleManualJoints()}}>
                <Flex w="50%" gap="xs" px="xs" direction="column">
                  <NumberInput
                    leftSection={<Text span size="xs">J1</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[0][0]*RADS_DEGS}
                    max={JOINT_LIMITS[0][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J1")}
                  />
                  <NumberInput
                    leftSection={<Text span size="xs">J2</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[1][0]*RADS_DEGS}
                    max={JOINT_LIMITS[1][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J2")}
                  />
                  <NumberInput
                    leftSection={<Text span size="xs">J3</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[2][0]*RADS_DEGS}
                    max={JOINT_LIMITS[2][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J3")}
                  />
                </Flex>
                <Flex w="50%" gap="xs" px="xs" direction="column">
                  <NumberInput
                    leftSection={<Text span size="xs">J4</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[3][0]*RADS_DEGS}
                    max={JOINT_LIMITS[3][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J4")}
                  />
                  <NumberInput
                    leftSection={<Text span size="xs">J5</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[4][0]*RADS_DEGS}
                    max={JOINT_LIMITS[4][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J5")}
                  />
                  <NumberInput
                    leftSection={<Text span size="xs">J6</Text>}
                    size="xs"
                    clampBehavior="strict"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[5][0]*RADS_DEGS}
                    max={JOINT_LIMITS[5][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J6")}
                  />
                </Flex>
              </Group>
            </form>
          : // Tool
            <form>
              <Group gap={0} px="xs" pb="xs">
                {/* <SegmentedControl data={['Unactuate', 'Actuate']} /> */}
                <Flex w="50%" gap="xs" px="xs" direction="column">
                  <Button onClick={handleUnactuate}
                    size="xs" variant="default" leftSection={<IconArrowBadgeLeft size={18}/>}>
                    Unactuate
                  </Button>
                </Flex>
                <Flex w="50%" gap="xs" px="xs" direction="column">
                  <Button onClick={handleActuate}
                    size="xs" variant="default" rightSection={<IconArrowBadgeRight size={18}/>}>
                    Actuate
                  </Button>
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