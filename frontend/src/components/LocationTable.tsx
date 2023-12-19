import { useContext } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Table } from "@mantine/core"

import { RobotContext } from "../context/robotContext"

import { LocationTableItem } from "./LocationTableItem"

export const LocationTable = ({
  docId
}: {
  docId: JournalId
}) => {
  const { locations } = useContext( RobotContext )
  
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Location</Table.Th>
          <Table.Th>Robots</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
      {locations.map(( location ) => (
        <LocationTableItem key={ location.id } docId={docId} location={ location } />
      ))}
      </Table.Tbody>
    </Table>
  )
}