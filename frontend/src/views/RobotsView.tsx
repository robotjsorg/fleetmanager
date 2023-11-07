import { useContext } from "react";

import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, ScrollArea, Title } from "@mantine/core";

import { useMutate, useQuery } from "../doctype";
import { IRobot } from "../@types/robot";

import { guiSelectionContext } from "../context/guiSelectionContext";

import { RobotItem } from "../components/RobotItem";
import { RobotForm } from "../components/RobotForm";

interface RobotsViewProps {
  docId: JournalId;
  locationid: string;
}

export const RobotsView = ( props: RobotsViewProps ) => {
  const { rows: robots } = useQuery<IRobot>(
    props.docId,
    sql`SELECT * FROM robots WHERE locationid = ${props.locationid} ORDER BY description`
  );

  const mutate = useMutate( props.docId );
  const { guiSelection, setGuiSelection } = useContext( guiSelectionContext );

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5} onClick={() => setGuiSelection("no selection")}>
          Robots
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(robots ?? []).map((robot) => (
          <RobotItem key={robot.id} robot={robot} mutate={mutate} selected={guiSelection == robot.id ? true : false} />
        ))}
      </ScrollArea>
      {/* { locations ?? locations![0] } */}
      <RobotForm mutate={mutate} locationid={props.locationid}/>
    </>
  );
};
