import { Grid, Stack, Paper, Center, Title } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { useEffect, useState } from "react";
import { sql } from "@orbitinghail/sqlsync-react";

import { useMutate, useQuery } from "./doctype";
import { Nav } from "./components/Nav";
import { RobotList } from "./components/RobotList";
import { TaskList } from "./components/TaskList";
import { Selection } from "./components/Selection";
import { Fleetmanager } from "./components/Fleetmanager";
import { RobotProvider } from "./context/robotContext";
import { selectionContext } from "./context/selectionContext";
import { IRobot } from "./@types/robot";
import { ILocation } from "./@types/location";

export const App = ({ docId }: { docId: JournalId }) => {
  const { height } = useViewportSize();
  const [selection, setSelection] = useState("no selection");
  const mutate = useMutate(docId);
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations ORDER BY created_at`
  );
  
  let locationid = "";
  let locationtitle = "";
  if(Array.isArray(locations)){
    locationid = locations[0].id;
    locationtitle = locations[0].description;
  }
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots WHERE locationid = ${locationid} ORDER BY description`
  );

  useEffect(() => {
    mutate({ tag: "InitSchema" }).catch((err) => {
      console.error("Failed to init schema", err);
    });
  }, [mutate]);

  return (
    <Nav docId={docId} title={locationtitle}>  
      <Grid p="sm">
        <RobotProvider robots={robots ?? []} >
          <selectionContext.Provider value={{ selection, setSelection }}>
            <Grid.Col span={{ base: 12, xs: 12, sm: 8, md: 8, lg: 9 }}>
              <Paper component={Stack} shadow="xs" p="xs" gap="sm" h={height-108}>
                <Center component={Title} style={{ justifyContent: "left" }} order={5}>
                  Fleetmanager
                </Center>
                <Fleetmanager />
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 12, sm: 4, md: 4, lg: 3 }}>
              <Stack>
                <Paper component={Stack} shadow="xs" p="xs" h={(height-80)/3-20}>
                  <RobotList docId={docId} />
                </Paper>
                <Paper component={Stack} shadow="xs" p="xs" h={(height-80)/3-20}>
                  <TaskList docId={docId} />
                </Paper>
                <Paper component={Stack} shadow="xs" p="xs" h={(height-80)/3-20}>
                  <Selection docId={docId} />
                </Paper>
              </Stack>
            </Grid.Col>
          </selectionContext.Provider>
        </RobotProvider>
      </Grid>
    </Nav>
  );
};