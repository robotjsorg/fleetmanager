import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Center, Flex, Title } from "@mantine/core";

import { guiSelectionContext } from "../context/guiSelectionContext";

import { RobotListQuery } from "../components/RobotListQuery";
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
      <RobotListQuery docId={docId}/>
      <RobotForm docId={docId}/>
    </>
  );
};