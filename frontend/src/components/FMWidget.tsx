import { useContext, useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Text, Button, Group, NumberFormatter, Stack, Center, useMantineContext } from "@mantine/core"

import { IconBrandAppleArcade, IconPower, IconSettingsAutomation } from "@tabler/icons-react"

import { IRobot } from "../@types/robot"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { moveRobotContext } from "../context/moveRobotContext"

import { FMWidgetOff } from "./FMWidgetOff"
import { FMWidgetAuto } from "./FMWidgetAuto"
import { FMWidgetManual } from "./FMWidgetManual"
import { FMWidgetError } from "./FMWidgetError"

const RADS_DEGS = 57.2958

export const FMWidget = ({
  docId,
  updateRobotState,
  updateRobotPosition,
  updateRobotToolState,
  updateRobotJointAngles
}: {
  docId: JournalId
  updateRobotState: (childData: {id: string, state: string }) => void
  updateRobotPosition: (childData: {id: string, position: number[], rotation: number[] }) => void
  updateRobotToolState: (childData: {id: string, toolState: string }) => void
  updateRobotJointAngles: (childData: {id: string, jointAngles: number[] }) => void
}) => {
  const theme = useMantineContext()
  const { robots } = useContext( RobotContext )
  const { guiSelection } = useContext( guiSelectionContext )
  const [ selectedRobot, setSelectedRobot ] = useState<IRobot>( robots[robots.findIndex((robot) => robot.id == guiSelection)] )

  const { setMoveRobot } = useContext( moveRobotContext )

  const [ state, setState ] = useState( selectedRobot?.state )
  const [ toolState, setToolState ] = useState( selectedRobot?.toolState )

  // This callback should come top-down, not bottom-up
  const updateRobotToolStateWrapper = (childData: { id: string, toolState: string }) => {
    updateRobotToolState({id: childData.id, toolState: childData.toolState})
    setToolState( childData.toolState )
  }
  
  useEffect(()=>{
    const index = robots.findIndex( (robot) => robot.id == guiSelection )
    setSelectedRobot( robots[index] )
  }, [guiSelection, robots])

  useEffect(()=>{
    if ( selectedRobot ) {
      setState( selectedRobot.state )
      setToolState( selectedRobot.toolState )
    }
  }, [selectedRobot]) 

  const handleOff = () => {
    selectedRobot.state = "Off"
    updateRobotState({
      id: selectedRobot.id,
      state: "Off"
    })
    setSelectedRobot( selectedRobot )
    setState("Off")
  }
  const handleOn = () => {
    handleReset()
  }
  const handleReset = () => {
    selectedRobot.state = "Manual"
    updateRobotState({
      id: selectedRobot.id,
      state: "Manual"
    })
    setSelectedRobot( selectedRobot )
    setState("Manual")
    setMoveRobot(false)
  }
  const handleManual = () => {
    selectedRobot.state = "Manual"
    updateRobotState({
      id: selectedRobot.id,
      state: "Manual"
    })
    setSelectedRobot( selectedRobot )
    setState("Manual")
    setMoveRobot(false)
  }
  const handleAuto = () => {
    selectedRobot.state = "Auto"
    updateRobotState({
      id: selectedRobot.id,
      state: "Auto"
    })
    setSelectedRobot( selectedRobot )
    setState("Auto")
    setMoveRobot(false)
  }

  return (
    <>
      <Group gap={0} p="xs" align="start">
        <Stack w="50%" gap="xs">
          <Text size="xs" truncate="end">
            <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} inherit>name: </Text>
            { selectedRobot ? selectedRobot.description : "-"}
          </Text>
          <Text size="xs" truncate="end">
            <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} inherit>part: </Text>
            { selectedRobot ? "Not Present" : "-"}<br/>
            <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} inherit>tool: </Text>
            { selectedRobot ? toolState : "-"}
          </Text>
          { selectedRobot ? 
            <Text size="xs" truncate="end" fw="bold" c={theme.colorScheme == "dark" ? "white" : "black"}>
              <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} fw="normal" inherit>state: </Text>
              { selectedRobot ? state : "-"}
            </Text>
          :
            <Text size="xs" fw="normal">
              <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} fw="normal" inherit>state: </Text>-
            </Text>
          }
        </Stack>
        <Stack w="50%" gap="xs">
          <Text size="xs" truncate="end">
            <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} inherit>type: </Text>
            { selectedRobot ? "ABB IRB 52" : "-"}
          </Text>
          <Text size="xs">
            <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} inherit>x: </Text>
            { selectedRobot ? <NumberFormatter value={selectedRobot.position[0]} decimalScale={1} /> : "-"}<br/>
            <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} inherit>z: </Text>
            { selectedRobot ? <NumberFormatter value={selectedRobot.position[2]} decimalScale={1} /> : "-"}<br/>
            <Text span c={theme.colorScheme == "dark" ? "var(--mantine-color-dark-3)" : "var(--mantine-color-gray-6)"} inherit>&theta;: </Text>
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
        <FMWidgetOff updateRobotPosition={updateRobotPosition} />
      : selectedRobot && state == "Error" ?
        <FMWidgetError />
      : selectedRobot && state == "Manual" ?
        <FMWidgetManual updateRobotToolStateWrapper={updateRobotToolStateWrapper} updateRobotJointAngles={updateRobotJointAngles} />
      : selectedRobot && state == "Auto" &&
        <FMWidgetAuto docId={docId} />
      }
    </>
  )
}