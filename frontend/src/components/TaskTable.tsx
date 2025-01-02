import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Table } from "@mantine/core"

// import { ITask } from "../@types/task"

import { TaskTableItem } from "./TaskTableItem"

export const TaskTable = ({
  // docId,
  tasks
}: {
  // docId: JournalId
  tasks: ITask[]
}) => {
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
        {tasks.map((task) => (
          // <TaskTableItem key={task.id} docId={docId} task={task} />
          <TaskTableItem key={task.id} task={task} />
        ))}
      </Table.Tbody>
    </Table>
  )
}