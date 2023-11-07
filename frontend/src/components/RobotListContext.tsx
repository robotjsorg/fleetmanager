import { useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea } from "@mantine/core";

import { RobotItem } from "./RobotItem";

import { RobotContext } from "../context/robotContext";

export const RobotListContext = ({ docId }: { docId: JournalId }) => {
  const { robots } = useContext(RobotContext)!;

  return (
    <ScrollArea type="auto">
      {(robots ?? []).map((robot) => (
        <RobotItem docId={docId} key={robot.id} robot={robot} deleteAction={false} />
      ))}
    </ScrollArea>
  );
};
