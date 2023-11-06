import { Center, Flex, ScrollArea, Title } from "@mantine/core";
import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { useContext } from "react";
import { useMutate, useQuery } from "../doctype";
import { IRobot } from "../@types/robot";
import { RobotItem } from "./RobotItem";
import { RobotForm } from "./RobotForm";
import { selectionContext } from "../context/selectionContext";

export const RobotList = ({ docId }: { docId: JournalId }) => {
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots ORDER BY locationid`
  );

  const mutate = useMutate(docId);
  const { selection } = useContext(selectionContext)!;

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Robots
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(robots ?? []).map((robot) => (
          <RobotItem key={robot.id} robot={robot} mutate={mutate} selected={selection == robot.id ? true : false} />
        ))}
      </ScrollArea>
      <RobotForm mutate={mutate} />
    </>
  );
};
