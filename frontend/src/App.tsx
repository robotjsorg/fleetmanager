import { useEffect, useState } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { sql } from "@orbitinghail/sqlsync-react";
import { useMantineColorScheme, MantineProvider, Box, Button, Divider, AppShell, Group, Burger, Stack } from "@mantine/core";
import { useViewportSize, useDisclosure } from "@mantine/hooks";

import { IconChecklist, IconHome, IconMoon, IconRobot, IconSettings, IconSun } from "@tabler/icons-react";
import { Euler, Vector3 } from "@react-three/fiber";

import { useMutate, useQuery } from "./doctype";
import { ILocation } from "./@types/location";
import { IRobotQuery, IRobot } from "./@types/robot";
import { ITask } from "./@types/task";

import { RobotProvider } from "./context/robotContext";
import { guiSelectionContext } from "./context/guiSelectionContext";
import { locSelectionContext } from "./context/locSelectionContext";

import { LocationsView } from "./views/LocationsView";
import { RobotsView } from "./views/RobotsView";
import { TasksView } from "./views/TasksView";

import { ConnectionStatus } from "./components/ConnectionStatus";
import { Fleetmanager } from "./components/Fleetmanager";
import { LocationList } from "./components/LocationList";
import { RobotList } from "./components/RobotList";
import { RobotSelection } from "./components/RobotSelection";

import { randomJointAngles } from "./meshes/Mesh_abb_irb52_7_120";

const randomPosition = () => {
  const x = 4 * (Math.random() - 0.5);
  const z = 2 * (Math.random() - 0.5);
  return [x, -0.02, z] as Vector3;
};
const randomRotation = () => {
  const z = 2*Math.PI * (Math.random() - 0.0);
  return [-Math.PI/2, 0, z] as Euler;
};

export const App = ({ docId }: { docId: JournalId; }) => {
  const mutate = useMutate( docId );
  const [ route, setPseudoRoute ] = useState("location");

  const [ locSelection, setLocationSelection ] = useState("no selection");
  const [ guiSelection, setGuiSelection ] = useState("no selection");

  // Single screen desktop app, no scrolling
  const { width, height } = useViewportSize();
  const [ fixHeight, setFixHeight ] = useState( height );

  // Hardcoded single screen app offsets
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

  const navbarWidth = 300;
  const headerHeight = 60;
  const navBarOffset = 155; // topbar 60 + btns 36 + padding 40 + divider 19
  const fmOffset = 61; // topbar 60 + divider 1
  const fmWidgetOffset = 117; // topbar 60 + divider (19 * 3)
  const viewOffset = 222; // topbar 60 + divider 1 + padding 40 + divider 41 + form 80

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

  useEffect(() => {
    // Set minimum fixed height
    if ( height > minFixHeight ) {
      setFixHeight( height );
    } else {
      setFixHeight( minFixHeight );
    }
  }, [height, minFixHeight]);

  const [initDB, setInitDB] = useState(false);
  useEffect(() => {    
    // Initialize database
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
      setInitDB(true);
    };
  }, [initDB, locSelection, mutate]);

  // Query DB
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations`
  );
  const { rows: robotsQuery } = useQuery<IRobotQuery>(
    docId,
    sql`SELECT * FROM robots`
  );
  const { rows: tasks } = useQuery<ITask>(
    docId,
    sql`SELECT * FROM tasks`
  );

  const robots: IRobot[] = [];
  if ( Array.isArray( robotsQuery ) && robotsQuery.length > 0 ) {
    robotsQuery.map(( robot ) => ( 
      robots.push(robot as IRobot))
    )
    robots.filter((robot) => (robot.lastKnownPosition = randomPosition()));
    robots.filter((robot) => (robot.lastKnownRotation = randomRotation()));
    robots.filter((robot) => (robot.lastKnownJointAngles = randomJointAngles()));
  }

  // Selected location description
  let selectedLocationDescription = ""
  if ( Array.isArray( locations ) && locations.length > 0 ) {
    const selectedLocation = locations.filter(( location ) => ( location.id == locSelection ));
    if ( Array.isArray( selectedLocation ) && selectedLocation.length > 0 ) {
      selectedLocationDescription = selectedLocation[0].description;
    }
  }

  return (
    <MantineProvider defaultColorScheme="dark">
      <RobotProvider locations={locations ?? []} robots={robots ?? []} tasks={tasks ?? []}>
        <locSelectionContext.Provider value={{ locSelection, setLocationSelection }}>
          <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
            <AppShell
              withBorder={false}
              header={{
                height: headerHeight
              }}
              navbar={{
                width: navbarWidth,
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
              }}
              aside={{
                width: navbarWidth,
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
                      <Button visibleFrom="xs" color="gray" variant={ subpageOpened ? "subtle" : "light" } onClick={() => (setPseudoRoute("location"))}>
                        { selectedLocationDescription }
                      </Button>
                      <Button hiddenFrom="xs" color="gray" variant={ subpageOpened ? "subtle" : "light" } onClick={() => (setPseudoRoute("location"))}>
                        <IconHome size={18} />
                      </Button>
                    </Box>
                    <Button visibleFrom="xs" color="gray" variant={ route != "robots" ? "subtle" : "light" } onClick={() => (setPseudoRoute("robots"))}>
                      Robots
                    </Button>
                    <Button hiddenFrom="xs" color="gray" variant={ route != "robots" ? "subtle" : "light" } onClick={() => (setPseudoRoute("robots"))}>
                      <IconRobot size={18} />
                    </Button>
                    <Button visibleFrom="xs" color="gray" variant={ route != "tasks" ? "subtle" : "light" } onClick={() => (setPseudoRoute("tasks"))}>
                      Tasks
                    </Button>
                    <Button hiddenFrom="xs" color="gray" variant={ route != "tasks" ? "subtle" : "light" } onClick={() => (setPseudoRoute("tasks"))}>
                      <IconChecklist size={18} />
                    </Button>
                  </Group>
                  <ConnectionStatus docId={docId} />
                </Group>
              </AppShell.Header>
              <AppShell.Navbar zIndex={300} withBorder={true} px="lg" pb="lg">
                <Stack h={ fixHeight - navBarOffset }>
                  <Divider label="Locations" labelPosition="center" />
                  <Box onClick={ closeNav }>
                    <LocationList docId={docId} fbDisabled={true} />
                  </Box>
                </Stack>
                <Group justify="center" p="lg">
                  <Button leftSection={<IconSettings size={18} />} variant="default" onClick={() => (closeNav(), setPseudoRoute("locations"))}>
                    Edit
                  </Button>
                  <ToggleMantineTheme />
                </Group>
              </AppShell.Navbar>
              <AppShell.Main onClick={ closeNav }>
                { route == "locations" ?
                <LocationsView docId={docId} h={ fixHeight - viewOffset } />
                : route == "robots" ?
                <RobotsView docId={docId} h={ fixHeight - viewOffset } />
                : route == "tasks" ?
                <TasksView docId={docId} h={ fixHeight - viewOffset } />
                : route == "location" ? // Fleetmanager
                <Box h={ fixHeight - fmOffset }>
                  <Divider />
                  <Fleetmanager />
                </Box>
                : <></>}
              </AppShell.Main>
              <AppShell.Aside withBorder={true} px="lg">
                <Stack>
                  <Stack h={ ( fixHeight - fmWidgetOffset ) / 2 }>
                    <Divider label="Robots" labelPosition="center" />
                    <RobotList docId={docId} fbDisabled={true} />
                  </Stack>
                  <Stack h={ ( fixHeight - fmWidgetOffset ) / 2 }>
                    <RobotSelection docId={docId} fbDisabled={true} />
                  </Stack>
                </Stack>
              </AppShell.Aside>
            </AppShell>
          </guiSelectionContext.Provider>
        </locSelectionContext.Provider>
      </RobotProvider>
    </MantineProvider>
  );
};