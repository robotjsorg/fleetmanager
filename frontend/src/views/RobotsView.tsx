import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Stack, Box, Divider } from "@mantine/core"

import { RobotList } from "../components/RobotList"
// import { RobotTable } from "../components/RobotTable"
import { RobotForm } from "../components/RobotForm"

export const RobotsView = ({
  docId,
  h
}: {
  docId: JournalId
  h: number
}) => {  
  return (
    <>
      <Divider />
      <Stack h={h} p="lg" maw={800} mx="auto">
        <RobotList docId={docId} fbDisabled={false}/>
        {/* <RobotTable /> */}
      </Stack>
      <Divider my="lg" />
      <Box maw={400} mx="auto">
        <RobotForm docId={docId}/>
      </Box>
    </>
  )
}