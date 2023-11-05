import { Center, Flex, Paper, ScrollArea, Stack, Title } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';
import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { useMutate, useQuery } from "../doctype";
import { IRobot } from "../@types/robot";
import { RobotItem } from "./RobotItem";
import { RobotForm } from "./RobotForm";

export const RobotList = ({ docId }: { docId: JournalId }) => {
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`select * from robots order by description`
  );

  const mutate = useMutate(docId);
  const { height } = useViewportSize();

  return (
    <Paper component={Stack} shadow="xs" p="xs" h={(height-80)/3-20}>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Robots
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(robots ?? []).map((robot) => (
          <RobotItem key={robot.id} robot={robot} mutate={mutate} />
        ))}
      </ScrollArea>
      <RobotForm mutate={mutate} />
    </Paper>
  );
};
