import { Grid, Stack, Paper, Center, Title, ScrollArea, AppShell, Burger, Group, Skeleton, Button } from "@mantine/core";
import { useViewportSize, useDisclosure } from '@mantine/hooks';
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { useEffect, useState } from "react";
import { IconSettings, IconSun } from '@tabler/icons-react'

import { useMutate, useQuery } from "./doctype";
import { RobotList } from "./components/RobotList";
import { TaskList } from "./components/TaskList";
import { Selection } from "./components/Selection";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { Fleetmanager } from "./components/Fleetmanager";
import { RobotProvider } from "./context/robotContext";
import { selectionContext } from "./context/selectionContext";
import { IRobot } from "./@types/robot";
import { sql } from "@orbitinghail/sqlsync-react";

export const App = ({ docId }: { docId: JournalId }) => {
  const mutate = useMutate(docId);

  useEffect(() => {
    mutate({ tag: "InitSchema" }).catch((err) => {
      console.error("Failed to init schema", err);
    });
  }, [mutate]);

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const { height } = useViewportSize();

  const [selection, setSelection] = useState("no selection");
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`select * from robots order by description`
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="sm"
    >
      <AppShell.Header>
        <Grid p="sm">
          <Grid.Col span={{ base: 9, md: 9, lg: 9 }}>
            <Group h="100%" px="md">
              <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
              <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
              <Button variant="transparent" color="black">Robots</Button>
              <Button variant="transparent" color="black">Tasks</Button>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 3, md: 3, lg: 3 }}>
            <Group justify="flex-end">
              <ConnectionStatus docId={docId} />
            </Group>
          </Grid.Col>
        </Grid>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section>Locations</AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
        <AppShell.Section>
          <Group justify="center">
            <Button leftSection={<IconSettings size={14} />} variant="default">
              Settings
            </Button>
            <Button leftSection={<IconSun size={14} />} variant="default">
              Theme
            </Button>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Grid p="sm">
          <RobotProvider robots={robots ?? []} >
            <selectionContext.Provider value={{ selection, setSelection }}>
              <Grid.Col span={{ base: 12, xs: 12, sm: 8, md: 8, lg: 9 }}>
                <Paper component={Stack} shadow="xs" p="xs" gap="sm" h={height-108}>
                  <Center component={Title} style={{ justifyContent: "left" }} order={5}>
                    Location &gt; Fleetmanager
                  </Center>
                  <Fleetmanager />
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 12, sm: 4, md: 4, lg: 3 }}>
                <Stack>
                  <RobotList docId={docId} />
                  <TaskList docId={docId} />
                  <Selection docId={docId} />
                </Stack>
              </Grid.Col>
            </selectionContext.Provider>
          </RobotProvider>
        </Grid>
      </AppShell.Main>
    </AppShell>
  );
};