import { useCallback, useContext } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { ActionIcon, Center, Flex, Table } from "@mantine/core"

import { IconX } from "@tabler/icons-react"

import { useMutate } from "../doctype"
import { ITask } from "../@types/task"

import { RobotContext } from "../context/robotContext"

export const TaskTableItem = ({
  docId,
  task
}: {
  docId: JournalId
  task: ITask
}) => {
  const { robots } = useContext( RobotContext )
  const robot_desc = robots.find((r) => r.id == task.robotid)?.description

  const mutate = useMutate( docId )
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteTask", id: task.id }).catch((err) => {
      console.error("Failed to delete", err)
    })
  }, [task.id, mutate])

  return (
    <Table.Tr>
      <Table.Td>{ task.description }</Table.Td>
      <Table.Td>{ robot_desc }</Table.Td> 
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