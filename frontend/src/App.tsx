import { useState } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { sql } from "@orbitinghail/sqlsync-react";
import { Grid, Stack, Paper, Center, Title } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import { useQuery } from "./doctype";
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
  const [ guiSelection, setGuiSelection ] = useState("no selection");
  const [ locationSelection, setLocationSelection ] = useState("no selection");
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots WHERE locationid = ${locationSelection} ORDER BY description`
  );

  return (
    <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
      <locationSelectionContext.Provider value={{ locationSelection, setLocationSelection }}>
        <RobotProvider robots={ robots ?? [] }>
          <Nav docId={docId} title={"Fleetmanager"}>
            <Grid p="sm">  
              <Grid.Col span={{ base: 12, xs: 12, sm: 8, md: 8, lg: 9 }}>
                <Paper component={Stack} shadow="xs" p="xs" gap="sm" h={ height - 108 }>
                  <Center component={Title} style={{ justifyContent: "left" }} order={5} hiddenFrom="sm">
                    Fleetmanager
                  </Center>
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