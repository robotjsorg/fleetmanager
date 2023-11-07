import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title } from "@mantine/core";

import { guiSelectionContext } from "../context/guiSelectionContext";

import { RobotForm } from "../components/RobotForm";
import { RobotListContext } from "../components/RobotListContext";

export const RobotsView = ({ docId }: { docId: JournalId }) => {
  const { setGuiSelection } = useContext( guiSelectionContext );

  return (
    <>
      <Flex>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5} onClick={() => setGuiSelection("no selection")}>
          Robots
        </Center>
      </Flex>
      <RobotListContext docId={docId}/>
      <RobotForm docId={docId}/>
    </>
  );
};
