import { useCallback, useContext } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { ActionIcon, Center, Flex, Table, useMantineColorScheme } from "@mantine/core"

import { useMutate } from "../doctype"
import { IRobot } from "../@types/robot"
import { IconX } from "@tabler/icons-react"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { RobotContext } from "../context/robotContext"
import { useHover } from "@mantine/hooks"

export const RobotTableItem = ({
  docId,
  robot
}: {
  docId: JournalId
  robot: IRobot
}) => {
  const theme = useMantineColorScheme()
  const { guiSelection, setGuiSelection } = useContext(guiSelectionContext)
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
  const { hovered, ref } = useHover()
  const selected = () => { 
    return guiSelection == robot.id
  }
  const handleSelect = () => {
    if ( guiSelection != robot.id ) {
      setGuiSelection( robot.id )
    }
  }
  const mutate = useMutate( docId )
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteRobot", id: robot.id }).catch((err) => {
      console.error("Failed to delete", err)
    })
  }, [robot.id, mutate])

  return (
    <Table.Tr ref={ref as React.RefObject<HTMLTableRowElement>}
      bg={
        selected() && theme.colorScheme == "dark" ? "var(--mantine-color-dark-5)"
        : selected() && theme.colorScheme == "light" ? "var(--mantine-color-gray-1)"
        : hovered && theme.colorScheme == "dark" ? "var(--mantine-color-dark-6)"
        : hovered ? "var(--mantine-color-gray-0)"
        : "none"
      }>
      <Table.Td onClick={ handleSelect } style={{ cursor: "pointer" }}>{ robot.description }</Table.Td>
      <Table.Td onClick={ handleSelect } style={{ cursor: "pointer" }}>{ robot.state }</Table.Td>
      <Table.Td onClick={ handleSelect } style={{ cursor: "pointer" }}>{ activeTask }</Table.Td>
      <Table.Td onClick={ handleSelect } style={{ cursor: "pointer" }}>{ numCompletedTasks }</Table.Td>
      <Table.Td onClick={ handleSelect } style={{ cursor: "pointer" }}>{ numQueuedTasks }</Table.Td>
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