import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea, Text } from "@mantine/core";

import { RobotContext } from "../context/robotContext";
import { locSelectionContext } from "../context/locSelectionContext";

import { RobotItem } from "./RobotItem";

export const RobotList = ({
  docId,
  fbDisabled
}: {
  docId: JournalId;
  fbDisabled: boolean;
}) => {
  const { robots } = useContext( RobotContext );
  const { locSelection } = useContext( locSelectionContext );
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ));

  return (
    <ScrollArea type="auto">
      {filteredRobots.length == 0 ? <Text>No Robots</Text> :
        filteredRobots.map((robot) => (
          <RobotItem docId={docId} key={robot.id} robot={robot} fbDisabled={fbDisabled} />
        ))
      }
    </ScrollArea>
  );
};
