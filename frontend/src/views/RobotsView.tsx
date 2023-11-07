import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title } from "@mantine/core";

import { guiSelectionContext } from "../context/guiSelectionContext";

import { RobotList } from "../components/RobotList";
import { RobotForm } from "../components/RobotForm";

export const RobotsView = ({ docId }: { docId: JournalId }) => {
  const { setGuiSelection } = useContext( guiSelectionContext );

  return (
    <>
      <Flex onClick={() => setGuiSelection("no selection")}>
        <Center component={Title} style={{ flex: 1, justifyContent: "left" }} order={5}>
          Robots
        </Center>
      </Flex>
      <RobotList docId={docId}/>
      <RobotForm docId={docId}/>
    </>
  );
};
