import { useCallback, useContext, useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Text, Button, Divider, Group, Flex, Select, Center } from "@mantine/core"
import { useForm } from "@mantine/form"

import { v4 as uuidv4 } from "uuid"

import { IRobot } from "../@types/robot"
import { ITask } from "../@types/task"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"

import { useMutate } from "../doctype"

export const FMWidgetAuto = ({
  docId
}: {
  docId: JournalId
}) => {
  const { robots, tasks } = useContext( RobotContext )
  const { guiSelection } = useContext( guiSelectionContext )
  const [ selectedRobot ] = useState<IRobot>(robots[robots.findIndex((robot) => robot.id == guiSelection)])
  const [ currentTask, setCurrentTask ] = useState<ITask>()
  useEffect(() => {
    const activeTasks = tasks.filter(( task ) => ( task.robotid == guiSelection && task.state == "Active" ))
    if ( Array.isArray( activeTasks ) && activeTasks.length > 0 ) {
      setCurrentTask( activeTasks[0] )
    }
  }, [guiSelection, tasks])

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
        mutate({ tag: "CreateTask", id, robotid: selectedRobot.id, description })
        .then(() => {
          autoSelectForm.reset()
        })
        .catch((err) => {
          autoSelectForm.setFieldError("description", String(err))
          autoSelectForm.setErrors({ description: String(err) })
          console.error("Failed to create task", err)
        })
      }, [autoSelectForm, mutate, selectedRobot]
    )
  )

  return (
    <>
      <Divider mx="xs" />
      <Group gap={0} py="xs">
        <Flex w="50%" gap="xs" px="xs" direction="column">
          <Text size="xs" truncate="end">
            <Text span c="gray" inherit>task: </Text>
            {currentTask ? currentTask.description : "-"}
          </Text>
          <Text size="xs" truncate="end">
            <Text span c="gray" inherit>type: </Text>
            {currentTask ? currentTask.description == "Random positions (continuous)" || currentTask.description == "Pick and Place (continuous)" ? "Continuous" : "One-Shot" : "-"}
          </Text>
          <Text size="xs" truncate="end">
            <Text span c="gray" inherit>state: </Text>
            {currentTask ? currentTask.state : "-"}
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