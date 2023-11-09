import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { sql } from "@orbitinghail/sqlsync-react";
import { Grid, Stack, Paper, Text, Button, MantineProvider, Flex, Center, Title } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { useMutate, useQuery } from "./doctype";
import { ILocation } from "./@types/location";
import { IRobot } from "./@types/robot";
import { ITask } from "./@types/task";

import { guiSelectionContext } from "./context/guiSelectionContext";
import { locationSelectionContext } from "./context/locationSelectionContext";
import { RobotProvider } from "./context/robotContext";

import { NavView } from "./views/NavView";
import { LocationsView } from "./views/LocationsView";
import { RobotsView } from "./views/RobotsView";
import { TasksView } from "./views/TasksView";

import { Fleetmanager } from "./components/Fleetmanager";
import { RobotList } from "./components/RobotList";
import { GuiSelection } from "./components/GuiSelection";
import { TaskList } from "./components/TaskList";

export const App = ({ docId, route }: { docId: JournalId; route: string; }) => {
  const { height } = useViewportSize();
  const mutate = useMutate( docId );
  const [ guiSelection, setGuiSelection ] = useState("no selection");
  const [ locationSelection, setLocationSelection ] = useState("no selection");

  const [initDB, setInitDB] = useState(false);
  useEffect(() => {
    if (!initDB){
      mutate({ tag: "InitSchema" }).catch(( err ) => {
        console.error( "Failed to init schema", err );
      });
      mutate({ tag: "PopulateDB" }).catch(( err ) => {
        console.error( "Failed to populate database", err );
      });
      if ( locationSelection == "no selection" ) {
        setLocationSelection("c0f67f5f-3414-4e50-9ea7-9ae053aa1f99");
      }
    }
    return () => {
      setInitDB(true);
    };
  }, [initDB, locationSelection, mutate]);

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
  if ( Array.isArray( locations ) ) {
    const selectedLocation = locations.filter(( location ) => ( location.id == locationSelection ));
    selectedLocationDescription = selectedLocation[0].description;
  }
  
  return (
    <MantineProvider defaultColorScheme="dark">
      <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
        <locationSelectionContext.Provider value={{ locationSelection, setLocationSelection }}>
          <RobotProvider locations={locations ?? []} robots={robots ?? []} tasks={tasks ?? []}>
            <NavView docId={docId}
              title={
                <Link to={ "/" + journalIdToString(docId) }>
                  <Button color="gray" variant="transparent">
                    { selectedLocationDescription }
                  </Button>
                </Link>
              }>
            { route == "locations" ?
              <LocationsView docId={docId} />
            : route == "robots" ?
              <RobotsView docId={docId} />
            : route == "tasks" ?
              <TasksView docId={docId} />
            : // else: Fleetmanager
              <Grid p="sm">
                <Grid.Col span={{ base: 12, xs: 12, sm: 8, md: 8, lg: 9 }}>
                  <Paper component={Stack} shadow="xs" p="xs" gap="sm" h={ height - 108 }>
                    <Text size="xs" hiddenFrom="sm" onClick={() => setGuiSelection("no selection")}>
                      { locationSelection }
                    </Text>
                    <Fleetmanager />
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 4, md: 4, lg: 3 }}>
                  <Stack>
                    <Paper component={Stack} shadow="xs" p="xs" h={ ( height - 80 ) / 3 - 20 }>
                      <Flex>
                        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
                          Robots
                        </Center>
                      </Flex>
                      <RobotList docId={docId} fbDisabled={true} />
                    </Paper>
                    <Paper component={Stack} shadow="xs" p="xs" h={ ( height - 80 ) / 3 - 20 } onClick={() => setGuiSelection("no selection")}>
                      <Flex>
                        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
                          Tasks
                        </Center>
                      </Flex>
                      <TaskList docId={docId} fbDisabled={true} />
                    </Paper>
                    <Paper component={Stack} shadow="xs" p="xs" h={ ( height - 80 ) / 3 - 20 }>
                      <GuiSelection docId={docId} />
                    </Paper>
                  </Stack>
                </Grid.Col>
              </Grid>
              }
            </NavView>
          </RobotProvider>
        </locationSelectionContext.Provider>
      </guiSelectionContext.Provider>
    </MantineProvider>
  );
};