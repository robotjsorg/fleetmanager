import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Box, Divider } from "@mantine/core";

import { RobotList } from "../components/RobotList";
// import { RobotTable } from "../components/RobotTable";
import { RobotForm } from "../components/RobotForm";

export const RobotsView = ({ docId }: { docId: JournalId }) => {  
  return (
    <>
      <Divider />
      <Box p="lg">
        <RobotList docId={docId} fbDisabled={false}/>
        {/* <Divider my="lg" />
        <RobotTable /> */}
        <Divider my="lg" />
        <Box maw={400} mx="auto">
          <RobotForm docId={docId}/>
        </Box>
      </Box>
    </>
  );
};