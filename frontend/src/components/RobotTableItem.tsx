import { useCallback, useContext } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { ActionIcon, Center, Flex, Table } from "@mantine/core"

import { useMutate } from "../doctype"
import { IRobot } from "../@types/robot"
import { IconX } from "@tabler/icons-react"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { RobotContext } from "../context/robotContext"

export const RobotTableItem = ({
  docId,
  robot
}: {
  docId: JournalId
  robot: IRobot
}) => {
  const { guiSelection } = useContext(guiSelectionContext)
  const mutate = useMutate( docId )
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteRobot", id: robot.id }).catch((err) => {
      console.error("Failed to delete", err)
    })
  }, [robot.id, mutate])

  const { tasks } = useContext( RobotContext )
  const activeTasks = tasks.filter(( task ) => ( task.robotid == robot.id && task.state == "Active" ))
  let activeTask = "-"
  if ( Array.isArray( activeTasks ) && activeTasks.length > 0 ) {
    activeTask = activeTasks[0].description
  }
  const completedTasks = tasks.filter(( task ) => ( task.robotid == robot.id && task.state == "Completed" ))
  const numCompletedTasks = completedTasks.length
  const queuedTasks = tasks.filter(( task ) => ( task.robotid == robot.id && task.state == "Queued" ))
  const numQueuedTasks = queuedTasks.length

  return (
    <Table.Tr bg={ guiSelection==robot.id ? "var(--mantine-color-gray-light)" : "none" }>
      <Table.Td>{ robot.description }</Table.Td>
      <Table.Td>{ robot.state }</Table.Td>
      <Table.Td>{ activeTask }</Table.Td>
      <Table.Td>{ numCompletedTasks }</Table.Td>
      <Table.Td>{ numQueuedTasks }</Table.Td>
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