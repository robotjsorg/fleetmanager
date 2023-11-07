import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea } from "@mantine/core";

import { useQuery } from "../doctype";
import { IRobot } from "../@types/robot";

import { RobotItem } from "./RobotItem";

export const RobotList = ({ docId }: { docId: JournalId }) => {
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots ORDER BY locationid`
  );

  return (
    <ScrollArea type="auto">
      {(robots ?? []).map((robot) => (
        <RobotItem docId={docId} key={robot.id} robot={robot} deleteDisabled={false} />
      ))}
    </ScrollArea>
  );
};
