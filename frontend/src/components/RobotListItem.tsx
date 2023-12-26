import { RefObject, useContext } from "react"

import { Text, useMantineColorScheme, Button } from "@mantine/core"
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
    <Button ref={ref as unknown as RefObject<HTMLButtonElement>} onClick={ handleSelect }
      justify="space-between"
      c={theme.colorScheme == "light" ? "black" : undefined}
      bg={
        selected() && theme.colorScheme == "dark" ? "var(--mantine-color-dark-5)"
        : selected() && theme.colorScheme == "light" ? "var(--mantine-color-gray-1)"
        : hovered && theme.colorScheme == "dark" ? "var(--mantine-color-dark-6)"
        : hovered && theme.colorScheme == "light" ? "var(--mantine-color-gray-0)"
        : "none"
      }
      >
      <Text size="sm" truncate="end">
        { robot.description }
      </Text>
    </Button>
  )
}