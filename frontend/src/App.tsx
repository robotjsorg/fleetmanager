import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { sql } from "@orbitinghail/sqlsync-react";
import { useMantineColorScheme, MantineProvider, 
  Box, Button, Divider, AppShell, Group, Burger, Stack } from "@mantine/core";
import { useViewportSize, useDisclosure } from '@mantine/hooks';

import { IconMoon, IconSettings, IconSun } from "@tabler/icons-react";

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
  const { height } = useViewportSize();
  const [ fixHeight, setFixHeight ] = useState( height );
  const mutate = useMutate( docId );
  const [ locSelection, setLocationSelection ] = useState("no selection");
  const [ guiSelection, setGuiSelection ] = useState("no selection");
  const subpageOpened = ( route == "locations" || route == "robots" || route == "tasks" );
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

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
    if ( height > 640 ) {
      setFixHeight( height );
    } else {
      setFixHeight( 640 );
    }
    
    if (!initDB){
      mutate({ tag: "InitSchema" }).catch(( err ) => {
        console.error( "Failed to init schema", err );
      });
      mutate({ tag: "PopulateDB" }).catch(( err ) => {
        console.error( "Failed to populate database", err );
      });
      if ( locSelection == "no selection" ) {
        setLocationSelection("c0f67f5f-3414-4e50-9ea7-9ae053aa1f99");
      }
    }
    return () => {
      setInitDB(true);
    };
  }, [height, initDB, locSelection, mutate]);

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

  let selectedLocationDescription = "no selection"
  if ( Array.isArray( locations ) && locations.length > 0 ) {
    const selectedLocation = locations.filter(( location ) => ( location.id == locSelection ));
    if ( Array.isArray( selectedLocation ) && selectedLocation.length > 0 ) {
      selectedLocationDescription = selectedLocation[0].description;
    }
  }

  const closeNav = () => {
    if ( desktopOpened ) {
      toggleDesktop();
    }
    if ( mobileOpened ) {
      toggleMobile();
    }
  }
  // TODO: Retain guiSelection when the same location is selected
  const deselectAndCloseNav = () => {
    setGuiSelection("no selection");
    closeNav();
  }
  
  return (
    <MantineProvider defaultColorScheme="dark">
      <RobotProvider locations={locations ?? []} robots={robots ?? []} tasks={tasks ?? []}>
        <locSelectionContext.Provider value={{ locSelection, setLocationSelection }}>
          <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
            <AppShell
              withBorder={false}
              header={{
                height: 60
              }}
              navbar={{
                width: 300,
                breakpoint: 0,
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
              }}
              aside={{
                width: 300,
                breakpoint: 0,
                collapsed: { mobile: subpageOpened, desktop: subpageOpened }
              }}>
              <AppShell.Header onClick={ closeNav }>
                <Group h="100%" px="md" justify="space-between">
                  <Box>
                    {/* TODO: One Burger Icon */}
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                  </Box>
                  <Box>
                    <Link to={ "/" + journalIdToString(docId) }>
                      <Button color="gray" variant={ subpageOpened ? "subtle" : "light" }>
                        { selectedLocationDescription }
                      </Button>
                    </Link>
                    <Link to={"/" + journalIdToString(docId) + "/robots"}>
                      <Button color="gray" variant={ route != "robots" ? "subtle" : "light" }>
                        Robots
                      </Button>
                    </Link>
                    <Link to={"/" + journalIdToString(docId) + "/tasks"}>
                      <Button color="gray" variant={ route != "tasks" ? "subtle" : "light" }>
                        Tasks
                      </Button>
                    </Link>
                  </Box>
                  <Box>
                    <ConnectionStatus docId={docId} />
                  </Box>
                </Group>
              </AppShell.Header>
              <AppShell.Navbar withBorder={true} px="lg" pb="lg">
                <AppShell.Section grow>
                  <Divider label="Locations" labelPosition="center" />
                  <Box onClick={ deselectAndCloseNav }>  
                    <LocationList docId={docId} fbDisabled={true} />
                  </Box>
                </AppShell.Section>
                <AppShell.Section>
                  <Group justify="center">
                    <Link to={"/" + journalIdToString(docId) + "/locations"} onClick={ closeNav }>
                      <Button leftSection={<IconSettings size={14} />} variant="default">
                        Edit
                      </Button>
                    </Link>
                    <ToggleMantineTheme />
                  </Group>
                </AppShell.Section>
              </AppShell.Navbar>
              <AppShell.Main onClick={ closeNav }>
                { route == "locations" ?
                <LocationsView docId={docId} />
                : route == "robots" ?
                <RobotsView docId={docId} />
                : route == "tasks" ?
                <TasksView docId={docId} />
                : // route == "default"
                <Box h={ fixHeight - 61 }>
                  <Divider />
                  <Fleetmanager />
                </Box> }
              </AppShell.Main>
              <AppShell.Aside withBorder={true} px="lg">
                <Stack>
                  <Stack h={ ( fixHeight - 60 ) / 3 - 11 }>
                    <Divider label="Robots" labelPosition="center" />
                    <RobotList docId={docId} fbDisabled={true} />
                  </Stack>
                  <Stack h={ ( fixHeight - 60 ) / 3 - 11 } onClick={() => setGuiSelection("no selection")}>
                    <Divider label="Tasks" labelPosition="center" />
                    <TaskList docId={docId} fbDisabled={true} />
                  </Stack>
                  <Stack h={ ( fixHeight - 60 ) / 3 - 11 }>
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