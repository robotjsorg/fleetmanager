import { RefObject, useContext } from "react"

import { Text, useMantineColorScheme, Button } from "@mantine/core"
import { useHover } from "@mantine/hooks"

import { ILocation } from "../@types/location"

import { locSelectionContext } from "../context/locSelectionContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { NAVBAR_WIDTH } from "../views/FMAppShell"

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
  const handleSelect = () => {
    if ( locSelection != location.id ) {
      setLocationSelection( location.id )
      setGuiSelection("no selection")
    }
  }

  return (
    <Button ref={ref as unknown as RefObject<HTMLButtonElement>} onClick={ handleSelect } w={NAVBAR_WIDTH-41}
      justify="space-between"
      bg={ selected() ? "var(--mantine-color-gray-light)" : hovered && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered ? "var(--mantine-color-gray-0)" : "none" }>
      <Text size="sm" truncate="end">
        { location.description }
      </Text>
    </Button>
  )
}