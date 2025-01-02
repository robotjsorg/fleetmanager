import { useContext, useEffect, useState } from "react"

// import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Stack, Divider, Container, ScrollArea } from "@mantine/core"

import { ITask } from "../@types/task"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"

import { TaskTable } from "../components/TaskTable"
import { TaskForm } from "../components/TaskForm"

export const TaskView = ({
  // docId,
  h
}: {
  // docId: JournalId
  h: number
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
    <>
      <Stack h={h}>
        <ScrollArea>
          <Container size="sm">
            {/*<TaskTable docId={docId} tasks={filteredTasks} />*/}
            <TaskTable tasks={filteredTasks} />
          </Container>
        </ScrollArea>
      </Stack>
      <Divider />
      <Container size="xs" p="xl">
        {/*<TaskForm docId={docId} />*/}
        <TaskForm />
      </Container>
    </>
  )
}