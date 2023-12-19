import { useContext, useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { ScrollArea, Text } from "@mantine/core"

import { ITask } from "../@types/task"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"

import { TaskListItem } from "./TaskListItem"

export const TaskList = ({
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
    <ScrollArea type="auto">
      {filteredTasks.length == 0 ? <Text>Location has No Tasks</Text> :
        filteredTasks.map((task) => (
          <TaskListItem key={task.id} docId={docId} task={task} />
        ))
      }
    </ScrollArea>
  )
}
