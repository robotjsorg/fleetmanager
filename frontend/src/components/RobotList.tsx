import { Center, Flex, ScrollArea, Title } from "@mantine/core";
import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { useContext } from "react";
import { useMutate, useQuery } from "../doctype";
import { IRobot } from "../@types/robot";
import { RobotItem } from "./RobotItem";
import { RobotForm } from "./RobotForm";
import { selectionContext } from "../context/selectionContext";
import { ILocation } from "../@types/location";
// import { v4 as uuidv4 } from "uuid";

interface RobotListProps {
  docId: JournalId;
  location: ILocation | null;
}

export const RobotList = (props: RobotListProps) => {
  // const locationid = props.location ? props.location.id : crypto.randomUUID ? crypto.randomUUID() : uuidv4();

  const { rows: robots } = useQuery<IRobot>(
    props.docId,
    sql`SELECT * FROM robots ORDER BY locationid`
    // sql`SELECT * FROM robots WHERE locationid = ${locationid} ORDER BY description`
  );

  const mutate = useMutate(props.docId);
  const { selection, setSelection } = useContext(selectionContext)!;

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5} onClick={() => setSelection("no selection")}>
          Robots
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(robots ?? []).map((robot) => (
          <RobotItem key={robot.id} robot={robot} mutate={mutate} selected={selection == robot.id ? true : false} />
        ))}
      </ScrollArea>
      <RobotForm mutate={mutate} location={props.location} />
    </>
  );
};
