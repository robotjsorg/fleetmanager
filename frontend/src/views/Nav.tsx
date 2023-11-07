import { ReactNode, useContext } from "react";
import { Link } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { Center, Title, ScrollArea, AppShell, Burger, Group, Button } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

import { IconSettings, IconSun } from '@tabler/icons-react'

import { guiSelectionContext } from "../context/guiSelectionContext";

import { LocationsView } from "../views/LocationsView";

import { ConnectionStatus } from "../components/ConnectionStatus";


interface NavProps {
  children: ReactNode;
  docId: JournalId;
  title: string;
}

export const Nav = (props: NavProps) => {
  const { setGuiSelection } = useContext( guiSelectionContext );
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

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
      <AppShell.Header onClick={() => (setGuiSelection("no selection"))}>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <Link to={"/" + journalIdToString(props.docId) + "/robots"}>
              <Button variant="transparent" color="black">
                Robots
              </Button>
            </Link>
            <Link to={"/" + journalIdToString(props.docId) + "/tasks"}>
              <Button variant="transparent" color="black">
                Tasks
              </Button>
            </Link>
          </Group>
          <Center component={Title} order={5} visibleFrom="sm">
            {props.title}
          </Center>
          <ConnectionStatus docId={props.docId} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" onClick={() => (setGuiSelection("no selection"))}>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <LocationsView docId={props.docId} />
        </AppShell.Section>
        <AppShell.Section>
          <Group justify="center">
            <Link to={"/" + journalIdToString(props.docId) + "/settings"}>
              <Button leftSection={<IconSettings size={14} />} variant="default">
                Settings
              </Button>
            </Link>
            <Button leftSection={<IconSun size={14} />} variant="default">
              Theme
            </Button>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        {props.children}
      </AppShell.Main>
    </AppShell>
  );
};