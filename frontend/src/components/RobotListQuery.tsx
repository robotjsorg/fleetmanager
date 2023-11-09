import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";

import { useQuery } from "../doctype";
import { IRobot } from "../@types/robot";

import { RobotItem } from "./RobotItem";

export const RobotListQuery = ({ docId }: { docId: JournalId }) => {
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots ORDER BY locationid`
  );
  
  return (
    <>
      {(robots ?? []).map((robot) => (
        <RobotItem docId={docId} key={robot.id} robot={robot} deleteDisabled={false} />
      ))}
    </>
  );
};