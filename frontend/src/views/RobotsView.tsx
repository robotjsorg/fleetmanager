import { useContext } from "react";

import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, ScrollArea, Title } from "@mantine/core";

import { useQuery } from "../doctype";
import { IRobot } from "../@types/robot";

import { guiSelectionContext } from "../context/guiSelectionContext";

import { RobotItem } from "../components/RobotItem";
import { RobotForm } from "../components/RobotForm";
import { locationSelectionContext } from "../context/locationSelectionContext";

export const RobotsView = ({ docId }: { docId: JournalId }) => {
  const { guiSelection, setGuiSelection } = useContext( guiSelectionContext );
  const { locationSelection } = useContext( locationSelectionContext );
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots WHERE locationid = ${locationSelection} ORDER BY description`
  );

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5} onClick={() => setGuiSelection("no selection")}>
          Robots
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(robots ?? []).map((robot) => (
          <RobotItem docId={docId} key={robot.id} robot={robot} selected={guiSelection == robot.id ? true : false} />
        ))}
      </ScrollArea>
      <RobotForm docId={docId}/>
    </>
  );
};
