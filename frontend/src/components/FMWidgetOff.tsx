import { useCallback, useContext, useEffect, useState } from "react"

import { Text, Button, Divider, NumberInput, Stack, Center } from "@mantine/core"
import { useForm } from "@mantine/form"

import { IconLock, IconLockOpen } from "@tabler/icons-react"

import { IRobot } from "../@types/robot"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { moveRobotContext } from "../context/moveRobotContext"

import { GRID_BOUND } from "./Fleetmanager"

const RADS_DEGS = 57.2958

export const FMWidgetOff = ({
  updateRobot
}: {
  updateRobot: (childData: {id: string, toolState: string, state: string, position: number[], rotation: number[], jointAngles: number[]}) => void
}) => {
  const { robots } = useContext( RobotContext )
  const { guiSelection } = useContext( guiSelectionContext )
  const [ selectedRobot, setSelectedRobot ] = useState<IRobot>(robots[robots.findIndex((robot) => robot.id == guiSelection)])

  const { moveRobot, setMoveRobot } = useContext( moveRobotContext )
  
  const [ positionFields, setPositionFields ] = useState( true )
  
  useEffect(()=>{
    const index = robots.findIndex((robot) => robot.id == guiSelection)
    setSelectedRobot( robots[index] )
    setPositionFields( true )
  }, [guiSelection, robots])

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
  })
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
        })
      }
    , [selectedRobot, updateRobot])
  )
  useEffect(()=>{
    if ( selectedRobot && positionFields ) {
      const { X: X, Z: Z, theta: theta } = moveRobotForm.values
      if ( X != selectedRobot.position[0] || Z != selectedRobot.position[2] || theta != selectedRobot.rotation[2] ) {
        moveRobotForm.setFieldValue('X', selectedRobot.position[0])
        moveRobotForm.setFieldValue('Z', selectedRobot.position[2])
        moveRobotForm.setFieldValue('theta', selectedRobot.rotation[2]*RADS_DEGS)
        setPositionFields( false )
      }
    }
  }, [positionFields, moveRobotForm, selectedRobot])

  return (
    <>
      <Divider mx="xs" />
      <Center p="xs">
        <Button color="gray" onClick={()=>{moveRobot ? setMoveRobot(false) : setMoveRobot(true)}}
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
  )
}