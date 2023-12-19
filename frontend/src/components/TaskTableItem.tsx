import { useCallback } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { ActionIcon, Center, Flex, Table } from "@mantine/core"

import { useMutate } from "../doctype"
import { ITask } from "../@types/task"
import { IconX } from "@tabler/icons-react"

export const TaskTableItem = ({
  docId,
  task
}: {
  docId: JournalId
  task: ITask
}) => {
  const mutate = useMutate( docId )
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteTask", id: task.id }).catch((err) => {
      console.error("Failed to delete", err)
    })
  }, [task.id, mutate])

  return (
    <Table.Tr bg={ task.state == "Active" ? "var(--mantine-color-gray-light)" : undefined }>
      <Table.Td>{ task.description }</Table.Td>
      <Table.Td>{ task.robot_desc }</Table.Td>
      <Table.Td>{ task.state }</Table.Td>
      <Table.Td>
        <Flex justify="right">
          <Center>
            <ActionIcon onClick={ handleDelete } color="gray" variant="subtle" size={20}>
              <IconX />
            </ActionIcon>
          </Center>
        </Flex>
      </Table.Td>
    </Table.Tr>
  )
}