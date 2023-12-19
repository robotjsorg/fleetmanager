import { useContext } from "react"

import { Text, Group } from "@mantine/core"
import { useHover } from "@mantine/hooks"

import { IRobot } from "../@types/robot"

import { guiSelectionContext } from "../context/guiSelectionContext"

export const RobotListItem = ({
  robot
}: {
  robot: IRobot
}) => {
  const { guiSelection, setGuiSelection } = useContext(guiSelectionContext)
  const { hovered, ref } = useHover()
  const handleSelect = () => {
    setGuiSelection(robot.id)
  }

  return (
    <Group ref={ref} onClick={ handleSelect }
      wrap="nowrap"
      justify="space-between"
      gap="sm" px={12} py={4}
      bg={ hovered || guiSelection == robot.id ? "var(--mantine-color-gray-light)" : "none" }
      styles={{ root: { cursor: "pointer" }}}>
      <Text size="sm">
        { robot.description }
      </Text>
    </Group>
  )
}