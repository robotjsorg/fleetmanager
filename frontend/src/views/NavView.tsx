import { ReactNode, useContext } from "react";
import { Link } from "react-router-dom";

import { JournalId, journalIdToString } from "@orbitinghail/sqlsync-worker";
import { Center, Title, ScrollArea, AppShell, Burger, Group, Button, useMantineColorScheme, Flex, Box } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

import { IconSettings, IconSun, IconMoon } from '@tabler/icons-react';

import { guiSelectionContext } from "../context/guiSelectionContext";

import { ConnectionStatus } from "../components/ConnectionStatus";
import { LocationListQuery } from "../components/LocationListQuery";

export const NavView = ({
  children,
  docId,
  title
}: {
  children: ReactNode;
  docId: JournalId;
  title: ReactNode;
}) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { setGuiSelection } = useContext( guiSelectionContext );
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

  const closeNav = () => {
    if ( desktopOpened ) {
      toggleDesktop();
    }
    if ( mobileOpened ) {
      toggleMobile();
    }
  }

  const deselectAndCloseNav = () => {
    setGuiSelection("no selection");
    closeNav();
  }

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
      <AppShell.Header onClick={ deselectAndCloseNav }>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <Link to={"/" + journalIdToString(docId) + "/robots"}>
              <Button color="gray" variant="transparent">
                Robots
              </Button>
            </Link>
            <Link to={"/" + journalIdToString(docId) + "/tasks"}>
              <Button color="gray" variant="transparent">
                Tasks
              </Button>
            </Link>
          </Group>
          <Center component={Title} order={5} visibleFrom="sm">
            {title}
          </Center>
          <ConnectionStatus docId={docId} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" onClick={() => (setGuiSelection("no selection"))}>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <Flex>
            <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
              Locations
            </Center>
          </Flex>
          <Box onClick={ closeNav }>
            <LocationListQuery docId={docId} />
          </Box>
        </AppShell.Section>
        <AppShell.Section>
          <Group justify="center">
            <Link to={"/" + journalIdToString(docId) + "/settings"} onClick={ closeNav }>
              <Button leftSection={<IconSettings size={14} />} variant="default">
                Settings
              </Button>
            </Link>
            <Button variant="default"
              onClick={() => setColorScheme( colorScheme == 'light' ? 'dark' : 'light' )}
              leftSection={ colorScheme == 'light' ? <IconMoon size={14} /> : <IconSun size={14} /> }>
              Theme
            </Button>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main onClick={ closeNav }>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};