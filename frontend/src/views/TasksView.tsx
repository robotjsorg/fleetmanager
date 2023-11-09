import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title, Box } from "@mantine/core";

import { RobotContext } from "../context/robotContext";
import { locationSelectionContext } from "../context/locationSelectionContext";

import { TaskList } from "../components/TaskList";
import { TaskForm } from "../components/TaskForm";

export const TasksView = ({ docId }: { docId: JournalId }) => {
  const { locations } = useContext( RobotContext );
  const { locationSelection } = useContext( locationSelectionContext );

  const selectedLocation = locations.filter(( location ) => ( location.id == locationSelection ));
  const selectedLocationDescription = selectedLocation[0].description;
  
  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
        { selectedLocationDescription } &gt; Tasks
        </Center>
      </Flex>
      <TaskList docId={docId} fbDisabled={false} />
      <Box maw={400} mx="auto">
        <TaskForm docId={docId} />
      </Box>
    </>
  );
};
