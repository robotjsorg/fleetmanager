import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea } from "@mantine/core";

import { RobotContext } from "../context/robotContext";
import { locationSelectionContext } from "../context/locationSelectionContext";

import { RobotItem } from "./RobotItem";

export const RobotList = ({
  docId,
  fbDisabled
}: {
  docId: JournalId;
  fbDisabled: boolean;
}) => {
  const { robots } = useContext( RobotContext );
  const { locationSelection } = useContext( locationSelectionContext );
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locationSelection ));

  return (
    <ScrollArea type="auto">
      {filteredRobots.map((robot) => (
        <RobotItem docId={docId} key={robot.id} robot={robot} fbDisabled={fbDisabled} />
      ))}
    </ScrollArea>
  );
};
