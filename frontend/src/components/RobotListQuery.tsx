import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { ScrollArea } from "@mantine/core"; //, Table

import { useQuery } from "../doctype";
import { IRobot } from "../@types/robot";

import { RobotItem } from "./RobotItem";

export const RobotListQuery = ({ docId }: { docId: JournalId }) => {
  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots ORDER BY locationid`
  );
  
  // let rows: JSX.Element[] = [];
  // if( Array.isArray( robots ) ) {
  //   rows = robots.map((robot) => (
  //     <Table.Tr key={robot.id}>
  //       <Table.Td>{robot.description}</Table.Td>
  //       <Table.Td>{robot.locationid}</Table.Td>
  //     </Table.Tr>
  //   ));
  // }
  
  return (
    <>
      {(robots ?? []).map((robot) => (
        <RobotItem docId={docId} key={robot.id} robot={robot} deleteDisabled={false} />
      ))}
      {/* <Table>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Location ID</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table> */}
    </>
  );
};