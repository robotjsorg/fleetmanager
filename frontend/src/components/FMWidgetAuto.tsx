import { useCallback, useContext, useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Text, Button, Divider, Group, Flex, Select, Center } from "@mantine/core"
import { useForm } from "@mantine/form"

import { v4 as uuidv4 } from "uuid"

import { useMutate } from "../doctype"
import { ITask } from "../@types/task"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { currentTaskContext } from "../context/currentTaskContext"

export const FMWidgetAuto = ({
  docId
}: {
  docId: JournalId
}) => {
  const { robots, tasks } = useContext( RobotContext )
  const { guiSelection } = useContext( guiSelectionContext )
  const [ task, setTask ] = useState<ITask>()
  const { currentTask, setCurrentTask } = useContext( currentTaskContext )

  useEffect(() => {
    if ( Array.isArray( tasks ) && tasks.length > 0 && currentTask != "no selection" ) {
      const currentTaskRobot = tasks.find(( task ) => ( task.id == currentTask && ( task.state == "Active" || task.state == "Completed" )))
      const currentTaskRobotId = currentTaskRobot?.robotid
      if ( guiSelection == currentTaskRobotId ) {
        setTask( tasks[ tasks.findIndex((task) => (task.id == currentTask)) ] )
      } else {
        setTask( undefined )
        setCurrentTask( "no selection" )
      }
    } else {
      setTask( undefined )
      setCurrentTask( "no selection" )
    }
  }, [currentTask, guiSelection, setCurrentTask, tasks])

  const autoSelectForm = useForm({
    initialValues: {
      description: ""
    },
    validate: {
      description: (value) => (value.trim().length === 0 ? "Select Task" : null)
    }
  })

  const mutate = useMutate( docId )

  const handleAutoSelect = autoSelectForm.onSubmit(
    useCallback(
      ({ description }) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4()
        const robotid = robots[robots.findIndex((robot) => robot.id == guiSelection)].id
        mutate({ tag: "CreateTask", id, robotid: robotid, description })
        .then(() => {
          autoSelectForm.reset()
        })
        .catch((err) => {
          autoSelectForm.setFieldError("description", String(err))
          autoSelectForm.setErrors({ description: String(err) })
          console.error("Failed to create task", err)
        })
      }, [autoSelectForm, guiSelection, mutate, robots]
    )
  )

  return (
    <>
      <Divider mx="xs" />
      <Group gap={0} py="xs">
        <Flex w="50%" gap="xs" px="xs" direction="column">
          <Text size="xs" truncate="end">
            <Text span c="var(--mantine-color-dark-3)" inherit>task: </Text>
            {task ? task.description : "-"}
          </Text>
          <Text size="xs" truncate="end">
            <Text span c="var(--mantine-color-dark-3)" inherit>type: </Text>
            {task ? task.description == "Random positions (continuous)" || task.description == "Pick and Place (continuous)" ? "Continuous" : "One-Shot" : "-"}
          </Text>
          <Text size="xs" truncate="end">
            <Text span c="var(--mantine-color-dark-3)" inherit>state: </Text>
            {task ? task.state : "-"}
          </Text>
        </Flex>
      </Group>
      <Center>
        <form onSubmit={handleAutoSelect}>
          <Group>
            <Select
              size="xs"
              placeholder="Queue task"
              data={['Random positions (continuous)', 'Home',
                'Move pre-pick', 'Move pick', 'Move post-pick', 'Move pre-place', 'Move place', 'Move post-place']}
              {...autoSelectForm.getInputProps("description")}
            />
            <Button size="xs" variant="default" type="submit">Queue</Button>
          </Group>
        </form>
      </Center>
    </>
  )
}