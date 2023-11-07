import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, ScrollArea, Title } from "@mantine/core";

import { RobotItem } from "./RobotItem";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";

export const RobotListContext = ({ docId }: { docId: JournalId }) => {
  const { robots } = useContext(RobotContext)!;
  const { setGuiSelection } = useContext(guiSelectionContext);

  return (
    <>
      <Flex onClick={() => setGuiSelection("no selection")}>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Robots
        </Center>
      </Flex>
      <ScrollArea type="auto">
        {(robots ?? []).map((robot) => (
          <RobotItem docId={docId} key={robot.id} robot={robot} deleteDisabled={true} />
        ))}
      </ScrollArea>
    </>
  );
};
