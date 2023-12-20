import { useContext, useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Box, Button, Divider, AppShell, Group, Burger, Stack, useMantineContext, useMantineColorScheme } from "@mantine/core"
import { useViewportSize, useDisclosure } from "@mantine/hooks"

import { IconChecklist, IconHome, IconMoon, IconRobot, IconSettings, IconSun } from "@tabler/icons-react"

import { LocationsView } from "./LocationsView"
import { RobotsView } from "./RobotsView"
import { TasksView } from "./TasksView"

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
          <Group wrap="nowrap" gap="xs">
            <Box hidden={locSelection == "no selection"}>
              <Button visibleFrom="xs" color={theme.colorScheme == "dark" ? "white" : "black"}
                onClick={() => (setPseudoRoute("location"))}
                variant={ subpageOpened ? "subtle" : "light" }>
                { selectedLocationDescription }
              </Button>
              <Button hiddenFrom="xs" color={theme.colorScheme == "dark" ? "white" : "black"}
                onClick={() => (setPseudoRoute("location"))}
                variant={ subpageOpened ? "subtle" : "light" }>
                <IconHome size={18} />
              </Button>
            </Box>
            <Button visibleFrom="xs" color={theme.colorScheme == "dark" ? "white" : "black"}
              onClick={() => {setPseudoRoute("robots"), setMoveRobot( false )}}
              variant={ route != "robots" ? "subtle" : "light" }>
              Robots
            </Button>
            <Button hiddenFrom="xs" color={theme.colorScheme == "dark" ? "white" : "black"}
              onClick={() => {setPseudoRoute("robots"), setMoveRobot( false )}}
              variant={ route != "robots" ? "subtle" : "light" }>
              <IconRobot size={18} />
            </Button>
            <Button visibleFrom="xs" color={theme.colorScheme == "dark" ? "white" : "black"}
              onClick={() => {setPseudoRoute("tasks"), setMoveRobot( false )}}
              variant={ route != "tasks" ? "subtle" : "light" }>
              Tasks
            </Button>
            <Button hiddenFrom="xs" color={theme.colorScheme == "dark" ? "white" : "black"}
              onClick={() => {setPseudoRoute("tasks"), setMoveRobot( false )}}
              variant={ route != "tasks" ? "subtle" : "light" }>
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
        { route == "locations" ?
          <LocationsView docId={docId} h={ fixHeight - VIEW_OFFSET } />
        : route == "robots" ?
          <RobotsView docId={docId} h={ fixHeight - VIEW_OFFSET } />
        : route == "tasks" ?
          <TasksView docId={docId} h={ fixHeight - VIEW_OFFSET } />
        : route == "location" &&
          <Box h={ fixHeight - CONTENT_OFFSET }>
            <Divider />
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