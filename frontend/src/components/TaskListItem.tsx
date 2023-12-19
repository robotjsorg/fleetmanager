import { Text, Group } from "@mantine/core"

import { ITask } from "../@types/task"

export const TaskListItem = ({
  task
}: {
  task: ITask
}) => {
  return (
    <Group wrap="nowrap" justify="space-between" gap="sm" px={12} py={4}>
      <Group wrap="nowrap">
        <Text size="sm">
          { task.robot_desc }: { task.description }
        </Text>
        <Text size="sm">
          { task.state }
        </Text>
      </Group>
    </Group>
  )
}