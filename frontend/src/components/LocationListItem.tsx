import { RefObject, useContext } from "react"

import { Text, useMantineColorScheme, Button } from "@mantine/core"
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
  const handleSelect = () => {
    if ( locSelection != location.id ) {
      setLocationSelection( location.id )
      setGuiSelection("no selection")
    }
  }
  const selected = () => { 
    return locSelection == location.id
  }

  return (
    <Button ref={ref as unknown as RefObject<HTMLButtonElement>} onClick={ handleSelect }
      justify="space-between"
      c={theme.colorScheme == "light" ? "black" : undefined}
      bg={ selected() ? "var(--mantine-color-gray-light)" : hovered && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered ? "var(--mantine-color-gray-0)" : "none" }>
      <Text size="sm" truncate="end">
        { location.description }
      </Text>
    </Button>
  )
}