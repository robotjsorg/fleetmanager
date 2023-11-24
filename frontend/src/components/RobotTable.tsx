import { useContext } from "react"

import { Table } from "@mantine/core"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"

export const RobotTable = () => {
  const { robots } = useContext( RobotContext )
  const { locSelection } = useContext( locSelectionContext )
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ))

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Description</Table.Th>
          <Table.Th>Location</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
      {filteredRobots.map((robot) => (
        <Table.Tr key={robot.id}>
          <Table.Td>{robot.description}</Table.Td>
          <Table.Td>{robot.locationid}</Table.Td>
        </Table.Tr>
      ))}
      </Table.Tbody>
    </Table>
  )
}