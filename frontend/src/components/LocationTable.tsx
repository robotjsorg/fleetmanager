import { useContext } from "react";

import { Table } from "@mantine/core";

import { RobotContext } from "../context/robotContext";

export const LocationTable = () => {
  const { locations } = useContext( RobotContext );
  
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
      {locations.map((location) => (
        <Table.Tr key={location.id}>
          <Table.Td>{location.description}</Table.Td>
        </Table.Tr>
      ))}
      </Table.Tbody>
    </Table>
  );
};