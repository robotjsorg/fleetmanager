import { useContext } from "react"

import { Text, Group, useMantineColorScheme } from "@mantine/core"
import { useHover } from "@mantine/hooks"

import { IRobot } from "../@types/robot"

import { guiSelectionContext } from "../context/guiSelectionContext"

export const RobotListItem = ({
  robot
}: {
  robot: IRobot
}) => {
  const theme = useMantineColorScheme()
  const { guiSelection, setGuiSelection } = useContext(guiSelectionContext)
  const { hovered, ref } = useHover()
  const handleSelect = () => {
    setGuiSelection(robot.id)
  }
  const selected = () => { 
    return guiSelection == robot.id
  }

  return (
    <Group ref={ref} onClick={ handleSelect }
      wrap="nowrap"
      justify="space-between"
      gap="sm" px={12} py={4}
      bg={ selected() ? "var(--mantine-color-gray-light)" : hovered && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered ? "var(--mantine-color-gray-0)" : "none" }
      styles={{ root: { cursor: "pointer" }}}>
      <Text size="sm">
        { robot.description }
      </Text>
    </Group>
  )
}