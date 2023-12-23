import { RefObject, useContext, useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Box, Button, Divider, AppShell, Group, Burger, Stack, useMantineContext, useMantineColorScheme } from "@mantine/core"
import { useViewportSize, useDisclosure, useHover } from "@mantine/hooks"

import { IconChecklist, IconHome, IconMoon, IconRobot, IconSettings, IconSun } from "@tabler/icons-react"

import { LocationView } from "./LocationView"
import { RobotView } from "./RobotView"
import { TaskView } from "./TaskView"

import { ConnectionStatus } from "../components/ConnectionStatus"
import { LocationList } from "../components/LocationList"
import { Fleetmanager } from "../components/Fleetmanager"
import { RobotList } from "../components/RobotList"
import { FMWidget } from "../components/FMWidget"

import { locSelectionContext } from "../context/locSelectionContext"
import { RobotContext } from "../context/robotContext"
import { moveRobotContext } from "../context/moveRobotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"

import { POPULATEDB } from "../App"

export const NAVBAR_WIDTH = 300 // nav width 300
const HEADER_HEIGHT  = 60  // topbar 60
const NAVBAR_OFFSET  = 155 // topbar 60 + btns 36 + padding 40 + divider 19
const CONTENT_OFFSET = 61  // topbar 60 + divider 1
const WIDGET_OFFSET  = 117 // topbar 60 + divider (19 * 3)
const VIEW_OFFSET    = 222 // topbar 60 + divider 1 + padding 40 + divider 41 + form 80

export const FMAppShell = ({
  docId,
  updateRobotState,
  updateRobotPosition,
  updateRobotToolState,
  updateRobotJointAngles,
  updateTask
}: {
  docId: JournalId
  updateRobotState: (childData: {id: string, state: string }) => void
  updateRobotPosition: (childData: {id: string, position: number[], rotation: number[] }) => void
  updateRobotToolState: (childData: {id: string, toolState: string }) => void
  updateRobotJointAngles: (childData: {id: string, jointAngles: number[] }) => void
  updateTask: (childData: {id: string, state: string}) => void
}) => {
  const theme = useMantineContext()

  // Single screen desktop app, no scrolling
  const { width, height } = useViewportSize()
  const [ fixHeight, setFixHeight ] = useState( height )
  useEffect(() => {
    let minFixHeight = height
    if ( width > 1440 ) {
      minFixHeight = 620
    } else if ( width > 1280 ) {
      minFixHeight = 480
    } else if ( width > 960 ) {
      minFixHeight = 320
    } else if ( width > 640 ) {
      minFixHeight = 240
    } else if ( width < 480 ) {
      minFixHeight = 160
    }
    if ( height > minFixHeight ) {
      setFixHeight( height )
    } else {
      setFixHeight( minFixHeight )
    }
  }, [height, width])
  
  // Menu control
  const [ route, setPseudoRoute ] = useState( "location" )
  const [ mobileOpened, { toggle: toggleMobile } ] = useDisclosure( false )
  const [ desktopOpened, { toggle: toggleDesktop } ] = useDisclosure( false )
  const subpageOpened = ( route == "locations" || route == "robots" || route == "tasks" )
  const closeNav = () => {
    if ( desktopOpened ) {
      toggleDesktop()
    }
    if ( mobileOpened ) {
      toggleMobile()
    }
  }

  // MantineProvider child
  const ToggleMantineTheme = () => {
    const { colorScheme, setColorScheme } = useMantineColorScheme()
    return (
      <Button variant="default"
        onClick={() => setColorScheme( colorScheme == "light" ? "dark" : "light" )}
        leftSection={ colorScheme == "light" ? <IconMoon size={18} /> : <IconSun size={18} /> }>
        Theme
      </Button>
    )
  }

  // Selected location description
  let initSelectionLocationDescription = ""
  if ( POPULATEDB ) {
    initSelectionLocationDescription = "Warehouse"
  }
  const { locations } = useContext(RobotContext)
  const { locSelection } = useContext(locSelectionContext)
  const [ selectedLocationDescription, setSelectedLocationDescription ] = useState( initSelectionLocationDescription )
  useEffect(()=>{
    if ( Array.isArray( locations ) && locations.length > 0 ) {
      const selectedLocation = locations.filter(( location ) => ( location.id == locSelection ))
      if ( Array.isArray( selectedLocation ) && selectedLocation.length > 0 ) {
        setSelectedLocationDescription( selectedLocation[0].description )
      }
    }
  }, [locSelection, locations])

  const { guiSelection } = useContext(guiSelectionContext)
  const { setMoveRobot } = useContext(moveRobotContext)

  const { hovered: hovered1, ref: ref1 } = useHover()
  const { hovered: hovered2, ref: ref2 } = useHover()
  const { hovered: hovered3, ref: ref3 } = useHover()

  return (
    <AppShell
      withBorder={false}
      header={{
        height: HEADER_HEIGHT
      }}
      navbar={{
        width: NAVBAR_WIDTH,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      aside={{
        width: NAVBAR_WIDTH,
        breakpoint: "sm",
        collapsed: { mobile: true, desktop: subpageOpened || desktopOpened }
      }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Box>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          </Box>
          <Group wrap="nowrap" gap={0}>
            <Box hidden={locSelection == "no selection"}>
              <Button visibleFrom="xs"
                onClick={() => (setPseudoRoute("location"))}
                c={theme.colorScheme == "light" ? "black" : undefined}
                ref={ref1 as unknown as RefObject<HTMLButtonElement>}
                bg={ !subpageOpened ? "var(--mantine-color-gray-light)" : hovered1 && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered1 ? "var(--mantine-color-gray-0)" : "none" }
                >
                { selectedLocationDescription }
              </Button>
              <Button hiddenFrom="xs"
                onClick={() => (setPseudoRoute("location"))}
                c={theme.colorScheme == "light" ? "black" : undefined}
                // ref={ref1 as unknown as RefObject<HTMLButtonElement>}
                bg={ !subpageOpened ? "var(--mantine-color-gray-light)" : hovered1 && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered1 ? "var(--mantine-color-gray-0)" : "none" }
                >
                <IconHome size={18} />
              </Button>
            </Box>
            <Button visibleFrom="xs"
              onClick={() => {setPseudoRoute("robots"), setMoveRobot( false )}}
              c={theme.colorScheme == "light" ? "black" : undefined}
              ref={ref2 as unknown as RefObject<HTMLButtonElement>}
              bg={ route == "robots" ? "var(--mantine-color-gray-light)" : hovered2 && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered2 ? "var(--mantine-color-gray-0)" : "none" }
              >
              Robots
            </Button>
            <Button hiddenFrom="xs"
              onClick={() => {setPseudoRoute("robots"), setMoveRobot( false )}}
              c={theme.colorScheme == "light" ? "black" : undefined}
              // ref={ref2 as unknown as RefObject<HTMLButtonElement>}
              bg={ route == "robots" ? "var(--mantine-color-gray-light)" : hovered2 && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered2 ? "var(--mantine-color-gray-0)" : "none" }
              >
              <IconRobot size={18} />
            </Button>
            <Button visibleFrom="xs"
              onClick={() => {setPseudoRoute("tasks"), setMoveRobot( false )}}
              c={theme.colorScheme == "light" ? "black" : undefined}
              ref={ref3 as unknown as RefObject<HTMLButtonElement>}
              bg={ route == "tasks" ? "var(--mantine-color-gray-light)" : hovered3 && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered3 ? "var(--mantine-color-gray-0)" : "none" }
              >
              Tasks
            </Button>
            <Button hiddenFrom="xs"
              onClick={() => {setPseudoRoute("tasks"), setMoveRobot( false )}}
              c={ theme.colorScheme == "light" ? "black" : undefined }
              // ref={ref3 as unknown as RefObject<HTMLButtonElement>}
              bg={ route == "tasks" ? "var(--mantine-color-gray-light)" : hovered3 && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered3 ? "var(--mantine-color-gray-0)" : "none" }
              >
              <IconChecklist size={18} />
            </Button>
          </Group>
          <ConnectionStatus docId={docId} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar zIndex={300} withBorder={true} px="lg" pb="lg">
        <Stack h={ fixHeight - NAVBAR_OFFSET }>
          <Divider label="Locations" labelPosition="center" />
          <LocationList />
        </Stack>
        <Group justify="center" p="lg">
          <Button variant="default"
            onClick={() => {closeNav(), setPseudoRoute("locations"), setMoveRobot( false )}}
            leftSection={<IconSettings size={18} />}>
            Edit
          </Button>
          <ToggleMantineTheme />
        </Group>
      </AppShell.Navbar>
      <AppShell.Main onClick={ closeNav }>
        <Divider />
        { route == "locations" ?
          <LocationView docId={docId} h={ fixHeight - VIEW_OFFSET } />
        : route == "robots" ?
          <RobotView docId={docId} h={ fixHeight - VIEW_OFFSET } />
        : route == "tasks" ?
          <TaskView docId={docId} h={ fixHeight - VIEW_OFFSET } />
        : route == "location" &&
          <Box h={ fixHeight - CONTENT_OFFSET }>
            <Fleetmanager
              updateRobotPosition={updateRobotPosition}
              updateRobotJointAngles={updateRobotJointAngles}
              updateTask={updateTask} />
          </Box>
        }
      </AppShell.Main>
      <AppShell.Aside withBorder={true}>
        <Stack>
          { guiSelection == "no selection" ?
            <Stack hiddenFrom="md" px="lg">
              <Divider label="Robots" labelPosition="center" />
              <RobotList />
            </Stack>
          : 
            <Box hiddenFrom="md">
              <Divider />
              <FMWidget docId={docId}
                updateRobotState={updateRobotState}
                updateRobotPosition={updateRobotPosition}
                updateRobotToolState={updateRobotToolState}
                updateRobotJointAngles={updateRobotJointAngles} />
            </Box>
          }
          <Stack visibleFrom="md" px="lg" h={ ( fixHeight - WIDGET_OFFSET ) / 2 }> 
            <Divider label="Robots" labelPosition="center" />
            <RobotList />
          </Stack>
          <Box visibleFrom="md"  h={ ( fixHeight - WIDGET_OFFSET ) / 2 }>
            <Divider />
              <FMWidget docId={docId}
                updateRobotState={updateRobotState}
                updateRobotPosition={updateRobotPosition}
                updateRobotToolState={updateRobotToolState}
                updateRobotJointAngles={updateRobotJointAngles} />
          </Box>
        </Stack>
      </AppShell.Aside>
    </AppShell>
  )
}