import { useCallback, useContext, useEffect, useState } from "react";

import { Text, Button, Divider, NumberInput, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconAngle, IconArrowBadgeLeft, IconArrowBadgeRight, IconTool } from "@tabler/icons-react";

import { IRobot } from "../@types/robot";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";

import { JOINT_LIMITS } from "../meshes/Mesh_abb_irb52_7_120";

const RADS_DEGS = 57.2958;

export const FMWidgetManual = ({
  updateRobot
}: {
  updateRobot: (childData: {id: string, toolState: string, state: string, position: number[], rotation: number[], jointAngles: number[]}) => void
}) => {
  const { robots } = useContext( RobotContext );
  const { guiSelection } = useContext( guiSelectionContext );
  const [ selectedRobot, setSelectedRobot ] = useState<IRobot>(robots[robots.findIndex((robot) => robot.id == guiSelection)]);

  const [ toggleManual, setToggleManual ] = useState( true );

  const [ , setToolState ] = useState("");
  const [ jointAngleFields, setJointAngleFields ] = useState( true );
  
  useEffect(()=>{
    const index = robots.findIndex((robot) => robot.id == guiSelection);
    setSelectedRobot( robots[index] );
    setJointAngleFields( true );
  }, [guiSelection, robots]);

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
  );
};