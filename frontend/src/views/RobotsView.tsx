import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title } from "@mantine/core";

import { RobotListQuery } from "../components/RobotListQuery";
import { RobotForm } from "../components/RobotForm";

export const RobotsView = ({ docId }: { docId: JournalId }) => {
  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Robots
        </Center>
      </Flex>
      <RobotListQuery docId={docId}/>
      <RobotForm docId={docId}/>
    </>
  );
};