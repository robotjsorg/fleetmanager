import { useCallback, useContext, useEffect, useState } from "react";

import { Text, Button, Divider, NumberInput, Group, Flex, Select, NumberFormatter, Stack, Center } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconAngle, IconArrowBadgeLeft, IconArrowBadgeRight, IconBrandAppleArcade, IconLock, IconLockOpen, IconPower, IconSettingsAutomation, IconTool } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";

import { IRobot } from "../@types/robot";
import { ITask } from "../@types/task";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { moveRobotContext } from "../context/moveRobotContext";

import { GRID_BOUND } from "./Fleetmanager";
import { JOINT_LIMITS } from "../meshes/Mesh_abb_irb52_7_120";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { useMutate } from "../doctype";

const RADS_DEGS = 57.2958;

export const FleetmanagerWidget = ({
  docId,
  updateRobot
}: {
  docId: JournalId;
  updateRobot: (childData: {id: string, toolState: string, state: string, position: number[], rotation: number[], jointAngles: number[]}) => void
}) => {
  const { robots, tasks } = useContext( RobotContext );
  const { guiSelection } = useContext( guiSelectionContext );
  const [ selectedRobot, setSelectedRobot ] = useState<IRobot>(robots[robots.findIndex((robot) => robot.id == guiSelection)]);
  const [ currentTask, setCurrentTask ] = useState<ITask>();
  useEffect(() => {
    const activeTasks = tasks.filter(( task ) => ( task.robotid == guiSelection && task.state == "Active" )).toSorted();
    if ( Array.isArray( activeTasks ) && activeTasks.length > 0 ) {
      setCurrentTask( activeTasks[0] );
    } else {
      setCurrentTask( undefined );
    }
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

  const autoSelectForm = useForm({
    initialValues: {
      description: ""
    },
    validate: {
      description: (value) => (value.trim().length === 0 ? "Select Task" : null)
    }
  });

  const mutate = useMutate( docId );

  const handleAutoSelect = autoSelectForm.onSubmit(
    useCallback(
      ({ description }) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
          mutate({ tag: "CreateTask", id, robotid: selectedRobot.id, description })
          .then(() => {
            autoSelectForm.reset();
            console.log("Task created.");
          })
          .catch((err) => {
            autoSelectForm.setFieldError("description", String(err));
            autoSelectForm.setErrors({ description: String(err) });
            console.error("Failed to create task", err);
          });
      }, [autoSelectForm, mutate, selectedRobot]
    )
  )

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
    <>
      <Group gap={0} p="xs" align="start">
        <Stack w="50%" gap="xs">
          <Text size="xs" truncate="end">
            <Text span c="gray" inherit>name: </Text>
            { selectedRobot ? selectedRobot.description : "-"}
          </Text>
          <Text size="xs" truncate="end">
            <Text span c="gray" inherit>part: </Text>
            { selectedRobot ? "Not Present" : "-"}<br/>
            <Text span c="gray" inherit>tool: </Text>
            { selectedRobot ? toolState : "-"}
          </Text>
          <Text size="xs" truncate="end">
            <Text span c="gray" inherit>state: </Text>
            { selectedRobot ? state : "-"}
          </Text>
        </Stack>
        <Stack w="50%" gap="xs">
          <Text size="xs" truncate="end">
            <Text span c="gray" inherit>type: </Text>
            { selectedRobot ? "ABB IRB 52" : "-"}
          </Text>
          <Text size="xs">
            <Text span c="gray" inherit>x: </Text>
            { selectedRobot ? <NumberFormatter value={selectedRobot.position[0]} decimalScale={1} /> : "-"}<br/>
            <Text span c="gray" inherit>z: </Text>
            { selectedRobot ? <NumberFormatter value={selectedRobot.position[2]} decimalScale={1} /> : "-"}<br/>
            <Text span c="gray" inherit>&theta;: </Text>
            { selectedRobot ? <NumberFormatter value={selectedRobot.rotation[2]*RADS_DEGS} decimalScale={0} /> : "-"}
          </Text>
        </Stack>
      </Group>
      <Center p="xs">
        <Group gap={0}>
          { !selectedRobot ? // State Controls Buttons
            <></>
          : state == "Error" ?
            <Group>
              <Button onClick={handleReset} variant="default" size="xs">
                Reset
              </Button>
              <Button onClick={handleOff} variant="default" size="xs"
                leftSection={<IconPower size={18} />}>
                Off
              </Button>
            </Group>
          : state == "Manual" ?
            <Group>
              <Button onClick={handleAuto} variant="default" size="xs"
                leftSection={<IconSettingsAutomation size={18} />}>
                Auto
              </Button>
              <Button onClick={handleOff} variant="default" size="xs"
                leftSection={<IconPower size={18} />}>
                Off
              </Button>
            </Group>
          : state == "Auto" ?
            <Group>
              <Button onClick={handleManual} variant="default" size="xs"
                leftSection={<IconBrandAppleArcade size={18} />}>
                Manual
              </Button>
              <Button onClick={handleOff} variant="default" size="xs"
                leftSection={<IconPower size={18} />}>
                Off
              </Button>
            </Group>
          : // state == "Off"
            <Button onClick={handleOn} variant="default" size="xs"
              leftSection={<IconPower size={18} />}>
              Power On
            </Button>
          }
        </Group>
      </Center>
      { selectedRobot && state == "Off" ?
        <>
          <Divider mx="xs" />
          <Center p="xs">
            <Button onClick={()=>{moveRobot ? setMoveRobot(false) : setMoveRobot(true)}}
              variant={moveRobot ? "outline" : "default"} size="xs"
              leftSection={moveRobot ? <IconLockOpen size={18} /> : <IconLock size={18} />}>
              Move
            </Button>
          </Center>
          <form>
            <Center>
              <Stack gap="xs" w="50%" px="xs"
                onMouseOver={()=>{setPositionFields( true )}}
                onMouseUp={()=>{handleMoveRobot()}}>
                <NumberInput disabled={!moveRobot}
                  leftSection={<Text span size="xs">X</Text>}
                  size="xs"
                  clampBehavior="blur"
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
                  clampBehavior="blur"
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
                  clampBehavior="blur"
                  step={15.0}
                  min={-Math.PI*RADS_DEGS}
                  max={Math.PI*RADS_DEGS}
                  allowDecimal={false}
                  onKeyUp={(e)=>{if(e.key != "Delete"){handleMoveRobot(), setPositionFields( true )}}}
                  {...moveRobotForm.getInputProps("theta")}
                />
              </Stack>
            </Center>
          </form>
        </>
      : selectedRobot && state == "Error" ?
        <>
          <Divider mx="xs" />
          <Group gap={0} p="xs">
            <Text size="xs" truncate="end">
              <Text span c="red" inherit>message: </Text>
              Robot error text placeholder.
            </Text>
          </Group>
        </>
      : selectedRobot && state == "Manual" ?
        <>
          <Divider mx="xs" />
          <Group gap="xs" p="xs" justify="center">
            {/* <SegmentedControl data={['Joints', 'Tool']} /> */}
            <Button color="gray" onClick={()=>setToggleManual(true)} variant={toggleManual ? "light" : "subtle"} size="xs" leftSection={<IconAngle size={18}/>}>
              Joints
            </Button>
            <Button color="gray" onClick={()=>setToggleManual(false)} variant={!toggleManual ? "light" : "subtle"} size="xs" leftSection={<IconTool size={18}/>}>
              Tool
            </Button>
          </Group>
          {toggleManual ? // Joints
            <form>
              <Group gap={0} px="xs" onMouseUp={()=>{handleManualJoints()}}>
                <Stack w="50%" gap="xs" pr="xs">
                  <NumberInput
                    leftSection={<Text span size="xs">J1</Text>}
                    size="xs"
                    clampBehavior="blur"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[0][0]*RADS_DEGS}
                    max={JOINT_LIMITS[0][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J1")}
                  />
                  <NumberInput
                    leftSection={<Text span size="xs">J2</Text>}
                    size="xs"
                    clampBehavior="blur"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[1][0]*RADS_DEGS}
                    max={JOINT_LIMITS[1][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J2")}
                  />
                  <NumberInput
                    leftSection={<Text span size="xs">J3</Text>}
                    size="xs"
                    clampBehavior="blur"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[2][0]*RADS_DEGS}
                    max={JOINT_LIMITS[2][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J3")}
                  />
                </Stack>
                <Stack w="50%" gap="xs" pl="xs">
                  <NumberInput
                    leftSection={<Text span size="xs">J4</Text>}
                    size="xs"
                    clampBehavior="blur"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[3][0]*RADS_DEGS}
                    max={JOINT_LIMITS[3][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J4")}
                  />
                  <NumberInput
                    leftSection={<Text span size="xs">J5</Text>}
                    size="xs"
                    clampBehavior="blur"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[4][0]*RADS_DEGS}
                    max={JOINT_LIMITS[4][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J5")}
                  />
                  <NumberInput
                    leftSection={<Text span size="xs">J6</Text>}
                    size="xs"
                    clampBehavior="blur"
                    step={15}
                    allowDecimal={false}
                    min={JOINT_LIMITS[5][0]*RADS_DEGS}
                    max={JOINT_LIMITS[5][1]*RADS_DEGS}
                    {...jointsForm.getInputProps("J6")}
                  />
                </Stack>
              </Group>
            </form>
          : // Tool
            <form>
              <Group gap="xs" p="xs" justify="center">
                {/* <SegmentedControl data={['Unactuate', 'Actuate']} /> */}
                <Button onClick={handleUnactuate}
                  size="xs" variant="default" leftSection={<IconArrowBadgeLeft size={18}/>}>
                  Unactuate
                </Button>
                <Button onClick={handleActuate}
                  size="xs" variant="default" rightSection={<IconArrowBadgeRight size={18}/>}>
                  Actuate
                </Button>
              </Group>
            </form> 
          }
        </>
      : selectedRobot && state == "Auto" &&
        <>
          <Divider mx="xs" />
          <Group gap={0} p="xs">
            <Flex w="50%" gap="xs" px="xs" direction="column">
              <Text size="xs" truncate="end">
                <Text span c="gray" inherit>task: </Text>
                {currentTask ? currentTask.description : "-"}
              </Text>
              <Text size="xs" truncate="end">
                <Text span c="gray" inherit>type: </Text>
                {currentTask ? currentTask.description == "Random positions (continuous)" || currentTask.description == "Pick and Place (continuous)" ? "Continuous" : "One-Shot" : "-"}
              </Text>
              <Text size="xs" truncate="end">
                <Text span c="gray" inherit>state: </Text>
                {currentTask ? currentTask.state : "-"}
              </Text>
            </Flex>
            {/* <Flex w="50%" gap="xs" px="xs" direction="column">
              <Group justify="center">
                <Button variant="default" size="xs" onClick={()=>{ currentTask ? currentTask.state = "Failed" : null }} disabled={ currentTask?.state != "Active" }>
                  <IconPlayerStop size={18} />
                </Button>
                <Button variant="default" size="xs" onClick={()=>{ currentTask ? currentTask.state = "Paused" : null }} disabled={ currentTask?.state != "Active" }>
                  <IconPlayerPause size={18} />
                </Button>
              </Group>
            </Flex> */}
          </Group>
          <Center>
            <form onSubmit={handleAutoSelect}>
              <Group>
                <Select
                  size="xs"
                  placeholder="Queue task"
                  data={['Random positions (continuous)', 'Home',
                    'Move pre-pick', 'Move pick', 'Move post-pick', 'Move pre-place', 'Move place', 'Move post-place']}
                  {...autoSelectForm.getInputProps("description")}
                />
                <Button size="xs" variant="default" type="submit">Queue</Button>
              </Group>
            </form>
          </Center>
        </>
      }
    </>
  );
};