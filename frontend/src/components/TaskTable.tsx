import { useContext, useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Table } from "@mantine/core"

import { ITask } from "../@types/task"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"

import { TaskTableItem } from "./TaskTableItem"

export const TaskTable = ({
  docId
}: {
  docId: JournalId
}) => {
  const { robots, tasks } = useContext( RobotContext )
  const { locSelection } = useContext( locSelectionContext )
  const [ filteredTasks, setFilteredTasks ] = useState<ITask[]>([])
  useEffect(()=>{
    const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ))
    const filteredRobotIds = filteredRobots.map(( robot ) => ( robot.id ))
    setFilteredTasks( tasks.filter(( task ) => ( filteredRobotIds.includes( task.robotid ) )) )
  }, [locSelection, robots, tasks])

  return (
    <Table stickyHeader>
      <Table.Thead style={{zIndex: "1"}}>
        <Table.Tr>
          <Table.Th>Task</Table.Th>
          <Table.Th>Robot</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {filteredTasks.map((task) => (
          <TaskTableItem key={task.id} docId={docId} task={task} />
        ))}
      </Table.Tbody>
    </Table>
  )
}