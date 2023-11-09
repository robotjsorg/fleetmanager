import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { sql } from "@orbitinghail/sqlsync-react";
import { Grid, Stack, Paper, Text, Button, MantineProvider } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { useMutate, useQuery } from "./doctype";
import { IRobot } from "./@types/robot";

import { guiSelectionContext } from "./context/guiSelectionContext";
import { locationSelectionContext } from "./context/locationSelectionContext";
import { RobotProvider } from "./context/robotContext";

import { NavView } from "./views/NavView";
import { LocationsView } from "./views/LocationsView";
import { RobotsView } from "./views/RobotsView";
import { TasksView } from "./views/TasksView";

import { Fleetmanager } from "./components/Fleetmanager";
import { RobotListContext } from "./components/RobotListContext";
import { GuiSelection } from "./components/GuiSelection";
import { TaskListContext } from "./components/TaskListContext";

export const App = ({ docId, route }: { docId: JournalId; route: string; }) => {
  const { height } = useViewportSize();
  const mutate = useMutate( docId );
  const [ guiSelection, setGuiSelection ] = useState("no selection");
  const [ locationSelection, setLocationSelection ] = useState("no selection");

  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots WHERE locationid = ${locationSelection} ORDER BY description`
  );

  const [initDB, setInitDB] = useState(false);
  useEffect(() => {
    if(!initDB){
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
  
  return (
    <MantineProvider defaultColorScheme="dark">
      <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
        <locationSelectionContext.Provider value={{ locationSelection, setLocationSelection }}>
          <RobotProvider robots={ robots ?? [] }>
            <NavView docId={docId}
              title={
                <Link to={ "/" + journalIdToString(docId) }>
                  <Button color="gray" variant="transparent">
                    { locationSelection }
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
                        <RobotListContext docId={docId} />
                      </Paper>
                      <Paper component={Stack} shadow="xs" p="xs" h={ ( height - 80 ) / 3 - 20 } onClick={() => setGuiSelection("no selection")}>
                        <TaskListContext docId={docId} />
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