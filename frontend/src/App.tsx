import { useEffect, useReducer, useState } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { sql } from "@orbitinghail/sqlsync-react";
import { useMantineColorScheme, MantineProvider, Box, Button, Divider, AppShell, Group, Burger, Stack } from "@mantine/core";
import { useViewportSize, useDisclosure } from "@mantine/hooks";

import { IconChecklist, IconHome, IconMoon, IconRobot, IconSettings, IconSun } from "@tabler/icons-react";

import { useMutate, useQuery } from "./doctype";
import { ILocation } from "./@types/location";
import { IRobotQuery, IRobot } from "./@types/robot";
import { ITask, ITaskQuery } from "./@types/task";

import { RobotProvider } from "./context/robotContext";
import { guiSelectionContext } from "./context/guiSelectionContext";
import { locSelectionContext } from "./context/locSelectionContext";
import { moveRobotContext } from "./context/moveRobotContext";

import { LocationsView } from "./views/LocationsView";
import { RobotsView } from "./views/RobotsView";
import { TasksView } from "./views/TasksView";

import { ConnectionStatus } from "./components/ConnectionStatus";
import { Fleetmanager } from "./components/Fleetmanager";
import { LocationList } from "./components/LocationList";
import { RobotList } from "./components/RobotList";
import { RobotSelection } from "./components/RobotSelection";

import { zeroJointAngles } from "./meshes/Mesh_abb_irb52_7_120"; //, randomJointAngles

const NAVBAR_WIDTH   = 300; // nav width 300
const HEADER_HEIGHT  = 60;  // topbar 60
const NAVBAR_OFFSET  = 155; // topbar 60 + btns 36 + padding 40 + divider 19
const CONTENT_OFFSET = 61;  // topbar 60 + divider 1
const WIDGET_OFFSET  = 117; // topbar 60 + divider (19 * 3)
const VIEW_OFFSET    = 222; // topbar 60 + divider 1 + padding 40 + divider 41 + form 80

// const zeroPosition = () => {
//   return [0, -0.02, 0];
// };
const zeroRotation = () => {
  return [-Math.PI/2, 0, -Math.PI/4];
};
const randomPosition = () => {
  const x = 4 * (Math.random() - 0.5);
  const z = 2 * (Math.random() - 0.5) + 1;
  return [x, -0.02, z];
};
// const randomRotationRobot = () => {
//   const theta = 2*Math.PI * (Math.random() - 0.0);
//   return [-Math.PI/2, 0, theta];
// };

export const App = ({ docId }: { docId: JournalId; }) => {
  const mutate = useMutate( docId );

  // Query DB
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations`
  );
  const { rows: robotsQuery } = useQuery<IRobotQuery>(
    docId,
    sql`SELECT * FROM robots`
  );
  const { rows: tasksQuery } = useQuery<ITaskQuery>(
    docId,
    sql`SELECT * FROM tasks`
  );

  const [ route, setPseudoRoute ] = useState("location");
  const [ locSelection, setLocationSelection ] = useState("no selection");
  const [ guiSelection, setGuiSelection ] = useState("no selection");
  const [ moveRobot, setMoveRobot ] = useState( false );
  useEffect(()=>{
    setMoveRobot( false );
  }, [guiSelection])

  // Single screen desktop app, no scrolling
  const { width, height } = useViewportSize();
  const [ fixHeight, setFixHeight ] = useState( height );
  useEffect(() => {
    let minFixHeight = height;
    if ( width > 1440 ) {
      minFixHeight = 620;
    } else if ( width > 1280 ) {
      minFixHeight = 480;
    } else if ( width > 960 ) {
      minFixHeight = 320;
    } else if ( width > 640 ) {
      minFixHeight = 240;
    } else if ( width < 480 ) {
      minFixHeight = 160;
    }
    if ( height > minFixHeight ) {
      setFixHeight( height );
    } else {
      setFixHeight( minFixHeight );
    }
  }, [height, width]);

  // Menu control
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const subpageOpened = ( route == "locations" || route == "robots" || route == "tasks" );
  const closeNav = () => {
    if ( desktopOpened ) {
      toggleDesktop();
    }
    if ( mobileOpened ) {
      toggleMobile();
    }
  }

  // Has to be a child of MantineProvider
  const ToggleMantineTheme = () => {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    return (
      <Button variant="default"
        onClick={() => setColorScheme( colorScheme == "light" ? "dark" : "light" )}
        leftSection={ colorScheme == "light" ? <IconMoon size={18} /> : <IconSun size={18} /> }>
        Theme
      </Button>
    );
  };

  // Initialize database
  const [initDB, setInitDB] = useState( false );
  useEffect(() => {    
    if (!initDB){
      console.log("[INFO] Init DB")
      mutate({ tag: "InitSchema" })
        .catch(( err ) => {console.error( "Failed to init schema", err )});
      mutate({ tag: "PopulateDB" })
        .catch(( err ) => {console.error( "Failed to populate database", err )});
      // Select the "Warehouse" location
      if ( locSelection == "no selection" ) {
        setLocationSelection("c0f67f5f-3414-4e50-9ea7-9ae053aa1f99");
      }
    }
    return () => {
      setInitDB( true );
    };
  }, [initDB, locSelection, mutate]);

  // Add data to robots
  const [ robots, setRobots ] = useState<IRobot[]>([]);
  const [, forceUpdate] = useReducer(x => x + 1 as number, 0);
  useEffect(()=>{
    const newRobots: IRobot[] = [];

    if ( Array.isArray( robotsQuery ) && robotsQuery.length > 0 ) {
      robotsQuery.map(( robot ) => ( 
        newRobots.push( robot as IRobot ))
      );
      newRobots.filter((robot) => (
        robot.id == "24db4c5b-1e3a-4853-8316-1d6ad07beed1" ? robot.state = "Auto" :
        robot.id == "402e7545-512b-4b7d-b570-e94311b38ab6" ? robot.state = "Error" :
        robot.state = "Off"
      ));
      newRobots.filter((robot) => (robot.position = randomPosition()));
      newRobots.filter((robot) => (robot.rotation = zeroRotation()));
      newRobots.filter((robot) => (robot.jointAngles = zeroJointAngles()));
      newRobots.filter((robot) => (robot.toolState = "Unactuated"));
      setRobots(newRobots);
    }
  }, [robotsQuery]);

  // Update robot position on Fleetmanager and RobotSelection callback
  const updateRobot = (childData: {id: string, state: string, toolState: string, position: number[], rotation: number[], jointAngles: number[]}) => {
    const index = robots.findIndex((robot) => robot.id == childData.id);
    robots[index].state = childData.state;
    robots[index].toolState = childData.toolState;
    robots[index].position = childData.position;
    robots[index].rotation = childData.rotation;
    robots[index].jointAngles = childData.jointAngles;
    setRobots(robots);
    forceUpdate();
  }

  // Add data to tasks
  const [ tasks, setTasks ] = useState<ITask[]>([]);
  useEffect(()=>{
    const newTasks: ITask[] = [];
    if ( Array.isArray( tasksQuery ) && tasksQuery.length > 0 ) {
      tasksQuery.map(( task ) => ( 
        newTasks.push( task as ITask ))
      )
      newTasks.filter((task) => (task.state = "Unknown"));
      setTasks(newTasks);
    }
  }, [tasksQuery]);

  // Selected location description
  const [ selectedLocationDescription, setSelectedLocationDescription ] = useState("");
  useEffect(()=>{
    if ( Array.isArray( locations ) && locations.length > 0 ) {
      const selectedLocation = locations.filter(( location ) => ( location.id == locSelection ));
      if ( Array.isArray( selectedLocation ) && selectedLocation.length > 0 ) {
        setSelectedLocationDescription( selectedLocation[0].description );
      }
    }
  }, [locSelection, locations]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <RobotProvider locations={locations ?? []} robots={robots ?? []} tasks={tasks ?? []}>
        <locSelectionContext.Provider value={{ locSelection, setLocationSelection }}>
          <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
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
                    <Fleetmanager updateRobot={updateRobot} />
                  </Box>
                }
              </AppShell.Main>
              <AppShell.Aside withBorder={true}>
                <Stack>
                  <Stack px="lg" h={ ( fixHeight - WIDGET_OFFSET ) / 2 } visibleFrom="md"> 
                    <Divider label="Robots" labelPosition="center" />
                    <RobotList docId={docId} fbDisabled={true} />
                  </Stack>
                  <Box h={ ( fixHeight - WIDGET_OFFSET ) / 2 }>
                    <Divider />
                    <RobotSelection updateRobot={updateRobot} />
                  </Box>
                </Stack>
              </AppShell.Aside>
            </AppShell>
          </moveRobotContext.Provider>
          </guiSelectionContext.Provider>
        </locSelectionContext.Provider>
      </RobotProvider>
    </MantineProvider>
  );
};