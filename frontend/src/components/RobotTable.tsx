import { useContext } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Table } from "@mantine/core"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"

import { RobotTableItem } from "./RobotTableItem"

export const RobotTable = ({
  docId
}: {
  docId: JournalId
}) => {
  const { robots } = useContext( RobotContext )
  const { locSelection } = useContext( locSelectionContext )
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ))

  return (
    <Table stickyHeader>
      <Table.Thead style={{zIndex: "1"}}>
        <Table.Tr>
          <Table.Th>Robot</Table.Th>
          <Table.Th>Mode</Table.Th>
          <Table.Th>Active Task</Table.Th>
          <Table.Th>Completed Tasks</Table.Th>
          <Table.Th>Queued Tasks</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {filteredRobots.map((robot) => (
          <RobotTableItem key={robot.id} docId={docId} robot={robot} />
        ))}
      </Table.Tbody>
    </Table>
  )
}