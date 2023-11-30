import { useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { sql } from "@orbitinghail/sqlsync-react"
import { useMantineColorScheme, MantineProvider, Box, Button, Divider, AppShell, Group, Burger, Stack } from "@mantine/core"
import { useViewportSize, useDisclosure } from "@mantine/hooks"

import { IconChecklist, IconHome, IconMoon, IconRobot, IconSettings, IconSun } from "@tabler/icons-react"

import { useMutate, useQuery } from "./doctype"
import { ILocation } from "./@types/location"
import { IRobotQuery, IRobot } from "./@types/robot"
import { ITask } from "./@types/task"

import { RobotProvider } from "./context/robotContext"
import { guiSelectionContext } from "./context/guiSelectionContext"
import { locSelectionContext } from "./context/locSelectionContext"
import { moveRobotContext } from "./context/moveRobotContext"
import { currentTaskContext } from "./context/currentTaskContext"

import { LocationsView } from "./views/LocationsView"
import { RobotsView } from "./views/RobotsView"
import { TasksView } from "./views/TasksView"

import { ConnectionStatus } from "./components/ConnectionStatus"
import { LocationList } from "./components/LocationList"
import { Fleetmanager } from "./components/Fleetmanager"
import { RobotList } from "./components/RobotList"
import { FMWidget } from "./components/FMWidget"

import { zeroJointAngles } from "./meshes/Mesh_abb_irb52_7_120"

const POPULATEDB = true

const NAVBAR_WIDTH   = 300 // nav width 300
const HEADER_HEIGHT  = 60  // topbar 60
const NAVBAR_OFFSET  = 155 // topbar 60 + btns 36 + padding 40 + divider 19
const CONTENT_OFFSET = 61  // topbar 60 + divider 1
const WIDGET_OFFSET  = 117 // topbar 60 + divider (19 * 3)
const VIEW_OFFSET    = 222 // topbar 60 + divider 1 + padding 40 + divider 41 + form 80

export const randomPosition = () => {
  const x = 4 * (Math.random() - 0.5)
  const z = 2 * (Math.random() - 0.5) + 1
  return [x, -0.02, z]
}
export const zeroRotation = () => {
  return [-Math.PI/2, 0, -Math.PI/4]
}

export const App = ({
  docId
}: {
  docId: JournalId
}) => {
  const mutate = useMutate( docId )

  // Initialize database
  const [ initDB, setInitDB ] = useState( true )
  useEffect(() => {
    if ( initDB ){
      console.log("[INFO] Init DB")
      mutate({ tag: "InitSchema" })
        .catch(( err ) => {console.error( "Failed to init schema", err )})
      if ( POPULATEDB ) {
        mutate({ tag: "PopulateDB" })
          .catch(( err ) => {console.error( "Failed to populate database", err )})
      }
    }
    return () => {
      setInitDB( false )
    };
  }, [initDB, mutate])

  // Query DB
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations`
  );
  const { rows: queryRobots } = useQuery<IRobotQuery>(
    docId,
    sql`SELECT * FROM robots`
  );
  const { rows: tasksQuery } = useQuery<ITask>(
    docId,
    sql`SELECT * FROM tasks ORDER BY created_at`
  );

  function getRobots (
    queryRobots: IRobotQuery[],
    localRobots: IRobot[]
  ): IRobot[] {
    const newRobots: IRobot[] = []
    if ( Array.isArray( queryRobots ) && queryRobots.length > 0 ) {
      queryRobots.map((queryRobot) => {
        const localRobot = localRobots.find((r) => r.id == queryRobot.id)
        if ( localRobot ) {
          newRobots.push({
            ...queryRobot,
            position: [queryRobot.x, -0.02, queryRobot.z],
            rotation: [-Math.PI / 2, 0, queryRobot.theta],
            toolState: localRobot.toolState,
            jointAngles: localRobot.jointAngles
          })
        } else {
          newRobots.push({
            ...queryRobot,
            position: [queryRobot.x, -0.02, queryRobot.z],
            rotation: [-Math.PI / 2, 0, queryRobot.theta],
            toolState: "Unactuated",
            jointAngles: zeroJointAngles()
          })
        }
      })
    }
    return newRobots
  }

  const [ robots, setRobots ] = useState<IRobot[]>([])
  useEffect(()=>{
    if ( Array.isArray( queryRobots ) && queryRobots.length > 0 ) {
      setRobots(getRobots(queryRobots, robots))
    }
  }, [robots, queryRobots])

  // Update db robot data
  const updateRobotState = (childData: { id: string, state: string }) => {
    mutate({ tag: "UpdateRobotState", id: childData.id, state: childData.state })
      .catch((err) => {
        console.error("Failed to update robot", err)
      })
  }
  const updateRobotPosition = (childData: { id: string, position: number[], rotation: number[] }) => {
    mutate({ tag: "UpdateRobotPosition", id: childData.id, x: childData.position[0], z: childData.position[2], theta: childData.rotation[2] })
      .catch((err) => {
        console.error("Failed to update robot", err)
      })
  }

  // Update local robot data
  const updateRobotToolState = (childData: { id: string, toolState: string }) => {
    const index = robots.findIndex((robot) => robot.id == childData.id)
    robots[index].toolState = childData.toolState
    setRobots(robots)
  }
  const updateRobotJointAngles = (childData: { id: string, jointAngles: number[] }) => {
    const index = robots.findIndex((robot) => robot.id == childData.id)
    robots[index].jointAngles = childData.jointAngles
    setRobots(robots)
  }

  // Store tasks query in state
  const [ tasks, setTasks ] = useState<ITask[]>([]);
  useEffect(()=>{
    if ( Array.isArray( tasksQuery ) && tasksQuery.length > 0 ) {
      setTasks(tasksQuery)
    }
  }, [tasksQuery])

  // Update task state on Mesh callback
  const updateTask = (childData: {id: string, state: string}) => {
    const index = tasks.findIndex((task) => task.id == childData.id)
    tasks[index].state = childData.state
    setTasks(tasks)
    // forceUpdate()

    mutate({ tag: "UpdateTask", id: childData.id, state: childData.state })
      .catch((err) => {
        console.error("Failed to update task", err)
      })
  }

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
  
  const [ guiSelection, setGuiSelection ] = useState( "no selection" );
  const [ moveRobot, setMoveRobot ] = useState( false );
  useEffect(()=>{
    setMoveRobot( false );
  }, [guiSelection])

  const [ currentTask, setCurrentTask ] = useState("");

  // Menu control
  const [ route, setPseudoRoute ] = useState( "location" );
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
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    return (
      <Button variant="default"
        onClick={() => setColorScheme( colorScheme == "light" ? "dark" : "light" )}
        leftSection={ colorScheme == "light" ? <IconMoon size={18} /> : <IconSun size={18} /> }>
        Theme
      </Button>
    )
  }

  // Selected location description
  let initLocSelection = "no selection"
  let initSelectionLocationDescription = ""
  if ( POPULATEDB ) {
    initLocSelection = "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99"
    initSelectionLocationDescription = "Warehouse"
  }
  const [ locSelection, setLocationSelection ] = useState( initLocSelection )
  const [ selectedLocationDescription, setSelectedLocationDescription ] = useState( initSelectionLocationDescription )
  useEffect(()=>{
    if ( Array.isArray( locations ) && locations.length > 0 ) {
      const selectedLocation = locations.filter(( location ) => ( location.id == locSelection ))
      if ( Array.isArray( selectedLocation ) && selectedLocation.length > 0 ) {
        setSelectedLocationDescription( selectedLocation[0].description )
      }
    }
  }, [locSelection, locations])

  return (
    <MantineProvider defaultColorScheme="dark">
      <RobotProvider locations={locations ?? []} robots={robots ?? []} tasks={tasks ?? []}>
        <locSelectionContext.Provider value={{ locSelection, setLocationSelection }}>
          <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
            <currentTaskContext.Provider value={{ currentTask, setCurrentTask }}>
              <moveRobotContext.Provider value={{ moveRobot, setMoveRobot }}>
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
                          <Button visibleFrom="xs" color="gray"
                            onClick={() => (setPseudoRoute("location"))}
                            variant={ subpageOpened ? "subtle" : "light" }>
                            { selectedLocationDescription }
                          </Button>
                          <Button hiddenFrom="xs" color="gray"
                            onClick={() => (setPseudoRoute("location"))}
                            variant={ subpageOpened ? "subtle" : "light" }>
                            <IconHome size={18} />
                          </Button>
                        </Box>
                        <Button visibleFrom="xs" color="gray"
                          onClick={() => {setPseudoRoute("robots"), setMoveRobot( false )}}
                          variant={ route != "robots" ? "subtle" : "light" }>
                          Robots
                        </Button>
                        <Button hiddenFrom="xs" color="gray"
                          onClick={() => {setPseudoRoute("robots"), setMoveRobot( false )}}
                          variant={ route != "robots" ? "subtle" : "light" }>
                          <IconRobot size={18} />
                        </Button>
                        <Button visibleFrom="xs" color="gray" 
                          onClick={() => {setPseudoRoute("tasks"), setMoveRobot( false )}}
                          variant={ route != "tasks" ? "subtle" : "light" }>
                          Tasks
                        </Button>
                        <Button hiddenFrom="xs" color="gray"
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
                      <Box onClick={ closeNav }>
                        <LocationList docId={docId} fbDisabled={true} />
                      </Box>
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
                    : route == "location" && // Fleetmanager
                      <Box h={ fixHeight - CONTENT_OFFSET }>
                        <Divider />
                        <Fleetmanager
                          updateRobotPosition={updateRobotPosition}
                          updateTask={updateTask}
                          updateRobotJointAngles={updateRobotJointAngles} />
                      </Box>
                    }
                  </AppShell.Main>
                  <AppShell.Aside withBorder={true}>
                    <Stack>
                      { guiSelection == "no selection" ?
                        <Stack hiddenFrom="md" px="lg">
                          <Divider label="Robots" labelPosition="center" />
                          <RobotList docId={docId} fbDisabled={true} />
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
                        <RobotList docId={docId} fbDisabled={true} />
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
              </moveRobotContext.Provider>
            </currentTaskContext.Provider>
          </guiSelectionContext.Provider>
        </locSelectionContext.Provider>
      </RobotProvider>
    </MantineProvider>
  )
}