import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { sql } from "@orbitinghail/sqlsync-react";
import { useMantineColorScheme, MantineProvider, 
  Text, Box, Button, Divider, AppShell, Group, Burger, Stack, Code } from "@mantine/core";
import { useViewportSize, useDisclosure } from '@mantine/hooks';

import { IconChecklist, IconHome, IconMoon, IconRobot, IconSettings, IconSun } from "@tabler/icons-react";

import { useMutate, useQuery } from "./doctype";
import { ILocation } from "./@types/location";
import { IRobot } from "./@types/robot";
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
import { TaskList } from "./components/TaskList";
import { GuiSelection } from "./components/GuiSelection";

export const App = ({ docId, route }: { docId: JournalId; route: string; }) => {
  const mutate = useMutate( docId );
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
        onClick={() => setColorScheme( colorScheme == 'light' ? 'dark' : 'light' )}
        leftSection={ colorScheme == 'light' ? <IconMoon size={14} /> : <IconSun size={14} /> }>
        Theme
      </Button>
    );
  };

  const [initDB, setInitDB] = useState(false);

  useEffect(() => {
    // Set the app's minimum fixed height
    if ( height > minFixHeight ) {
      setFixHeight( height );
    } else {
      setFixHeight( minFixHeight );
    }
    
    // Initialize the database if it hasn't been yet
    if (!initDB){
      console.log("[INFO] initDB")
      mutate({ tag: "InitSchema" }).catch(( err ) => {
        console.error( "Failed to init schema", err );
      });
      mutate({ tag: "PopulateDB" }).catch(( err ) => {
        console.error( "Failed to populate database", err );
      });

      // Select the "Warehouse" location
      if ( locSelection == "no selection" ) {
        setLocationSelection("c0f67f5f-3414-4e50-9ea7-9ae053aa1f99");
      }
    }

    return () => {
      setInitDB(true);
    };
  }, [height, initDB, locSelection, minFixHeight, mutate]);

  // Query DB: Is there a more efficient location for this?
  // in useEffect()? 
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations`
  );
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots`
  );
  const { rows: tasks } = useQuery<ITask>(
    docId,
    sql`SELECT * FROM tasks`
  );

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
            <AppShell // disabled
              withBorder={false}
              header={{
                height: headerHeight
              }}
              navbar={{
                width: navbarWidth,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
              }}
              aside={{
                width: navbarWidth,
                breakpoint: 'sm',
                collapsed: { mobile: true, desktop: subpageOpened || desktopOpened }
              }}>
              <AppShell.Header>
                <Group h="100%" px="md" justify="space-between" wrap="nowrap">
                  <Box>
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                  </Box>
                  <Group wrap="nowrap" gap="xs">
                    <Link to={ "/" + journalIdToString(docId) }>
                      <Button visibleFrom="xs" color="gray" variant={ subpageOpened ? "subtle" : "light" }>
                        { selectedLocationDescription }
                      </Button>
                      <Button hiddenFrom="xs" color="gray" variant={ subpageOpened ? "subtle" : "light" }>
                        <IconHome size={14} />
                      </Button>
                    </Link>
                    <Link to={"/" + journalIdToString(docId) + "/robots"}>
                      <Button visibleFrom="xs" color="gray" variant={ route != "robots" ? "subtle" : "light" }>
                        Robots
                      </Button>
                      <Button hiddenFrom="xs" color="gray" variant={ route != "robots" ? "subtle" : "light" }>
                        <IconRobot size={14} />
                      </Button>
                    </Link>
                    <Link to={"/" + journalIdToString(docId) + "/tasks"}>
                      <Button visibleFrom="xs" color="gray" variant={ route != "tasks" ? "subtle" : "light" }>
                        Tasks
                      </Button>
                      <Button hiddenFrom="xs" color="gray" variant={ route != "tasks" ? "subtle" : "light" }>
                        <IconChecklist size={14} />
                      </Button>
                    </Link>
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
                  <Link to={"/" + journalIdToString(docId) + "/locations"} onClick={ closeNav }>
                    <Button leftSection={<IconSettings size={14} />} variant="default">
                      Edit
                    </Button>
                  </Link>
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
                : route == journalIdToString(docId) ? // Fleetmanager
                <Box h={ fixHeight - fmOffset }>
                  <Divider />
                  <Fleetmanager />
                </Box>
                : // else: 404
                <>
                  <Divider />
                  <Stack h={fixHeight - fmOffset} p="lg">
                    <Text c="red">
                      ERROR invalid URL:&nbsp;
                      <Code>
                        /{route}
                      </Code>
                    </Text>
                  </Stack>
                </>
                }
              </AppShell.Main>
              <AppShell.Aside withBorder={true} px="lg">
                <Stack>
                  <Stack h={ ( fixHeight - fmWidgetOffset ) / 3 }>
                    <Divider label="Robots" labelPosition="center" />
                    <RobotList docId={docId} fbDisabled={true} />
                  </Stack>
                  <Stack h={ ( fixHeight - fmWidgetOffset ) / 3 }>
                    <Divider label="Tasks" labelPosition="center" />
                    <TaskList docId={docId} fbDisabled={true} />
                  </Stack>
                  <Stack h={ ( fixHeight - fmWidgetOffset ) / 3 }>
                    <Divider label="Selection" labelPosition="center" />
                    <GuiSelection docId={docId} />
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