import { useEffect, useState } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { sql } from "@orbitinghail/sqlsync-react";
import { Grid, Stack, Paper, Text } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { useQuery, useMutate } from "./doctype";
import { IRobot } from "./@types/robot";

import { RobotProvider } from "./context/robotContext";
import { guiSelectionContext } from "./context/guiSelectionContext";
import { locationSelectionContext } from "./context/locationSelectionContext";

import { Nav } from "./views/Nav";
import { RobotsView } from "./views/RobotsView";
import { TasksView } from "./views/TasksView";
import { SelectionView } from "./views/SelectionView";

import { Fleetmanager } from "./components/Fleetmanager";

export const App = ({ docId }: { docId: JournalId }) => {
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
      setLocationSelection("c0f67f5f-3414-4e50-9ea7-9ae053aa1f99");
    }
    return () => {
      setInitDB(true);
    };
  }, [initDB, mutate]);

  return (
    <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
      <locationSelectionContext.Provider value={{ locationSelection, setLocationSelection }}>
        <RobotProvider robots={ robots ?? [] }>
          <Nav docId={docId} title={locationSelection}>
            <Grid p="sm">  
              <Grid.Col span={{ base: 12, xs: 12, sm: 8, md: 8, lg: 9 }}>
                <Paper component={Stack} shadow="xs" p="xs" gap="sm" h={ height - 108 }>
                  <Text size="xs" hiddenFrom="sm">
                    {locationSelection}
                  </Text>
                  <Fleetmanager />
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 12, sm: 4, md: 4, lg: 3 }}>
                <Stack>
                  <Paper component={Stack} shadow="xs" p="xs" h={ ( height - 80 ) / 3 - 20 }>
                    <RobotsView docId={docId} />
                  </Paper>
                  <Paper component={Stack} shadow="xs" p="xs" h={ ( height - 80 ) / 3 - 20 } onClick={() => setGuiSelection("no selection")}>
                    <TasksView docId={docId} />
                  </Paper>
                  <Paper component={Stack} shadow="xs" p="xs" h={ ( height - 80 ) / 3 - 20 } onClick={() => setGuiSelection("no selection")}>
                    <SelectionView docId={docId} />
                  </Paper>
                </Stack>
              </Grid.Col>
            </Grid>
          </Nav>
        </RobotProvider>
      </locationSelectionContext.Provider>
    </guiSelectionContext.Provider>
  );
};