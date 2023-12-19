import { useContext } from "react"

import { Text, Group, useMantineColorScheme } from "@mantine/core"
import { useHover } from "@mantine/hooks"

import { ILocation } from "../@types/location"

import { locSelectionContext } from "../context/locSelectionContext"
import { guiSelectionContext } from "../context/guiSelectionContext"

export const LocationListItem = ({
  location
}: {
  location: ILocation
}) => {
  const theme = useMantineColorScheme()
  const { locSelection, setLocationSelection } = useContext( locSelectionContext )
  const { setGuiSelection } = useContext( guiSelectionContext )
  const { hovered, ref } = useHover()
  const selected = () => { 
    return locSelection == location.id
  }
  const handleLocationSelect = () => {
    if ( locSelection != location.id ) {
      setLocationSelection( location.id )
      setGuiSelection("no selection")
    }
  }

  return (
    <Group wrap="nowrap" ref={ref} 
      bg={ selected() ? "var(--mantine-color-gray-light)" : hovered && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered ? "var(--mantine-color-gray-0)" : "none" }
      onClick={ handleLocationSelect }
      justify="space-between" gap="sm" px={12} py={4}
      styles={{ root: { cursor: "pointer" }}}>
      <Text size="sm">
        { location.description }
      </Text>
    </Group>
  )
}