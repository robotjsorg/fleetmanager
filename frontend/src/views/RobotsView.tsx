import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title, Box } from "@mantine/core";

import { RobotContext } from "../context/robotContext";
import { locationSelectionContext } from "../context/locationSelectionContext";

import { RobotTable } from "../components/RobotTable";
import { RobotForm } from "../components/RobotForm";

export const RobotsView = ({ docId }: { docId: JournalId }) => {
  const { locations } = useContext( RobotContext );
  const { locationSelection } = useContext( locationSelectionContext );

  const selectedLocation = locations.filter(( location ) => ( location.id == locationSelection ));
  const selectedLocationDescription = selectedLocation[0].description;

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          { selectedLocationDescription } &gt; Robots
        </Center>
      </Flex>
      <RobotTable docId={docId} fbDisabled={false}/>
      <Box maw={400} mx="auto">
        <RobotForm docId={docId}/>
      </Box>
    </>
  );
};