import { useCallback, useContext } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Text, ActionIcon, Group } from "@mantine/core"
import { useHover } from "@mantine/hooks"

import { IconX } from "@tabler/icons-react"

import { useMutate } from "../doctype"
import { ILocation } from "../@types/location"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"
import { guiSelectionContext } from "../context/guiSelectionContext"

export const LocationListItem = ({
  docId,
  location,
  fbDisabled
}: {
  docId: JournalId
  location: ILocation
  fbDisabled: boolean
}) => {
  const { locations } = useContext( RobotContext )
  const { locSelection, setLocationSelection } = useContext( locSelectionContext )
  const { setGuiSelection } = useContext( guiSelectionContext )

  const mutate = useMutate( docId )
  const handleDelete = useCallback(() => {
    mutate({ tag: "DeleteLocation", id: location.id })
      .then(() => {
        if ( location.id == locSelection && Array.isArray( locations ) && locations.length > 1 ) {
          if ( locations[0].id == locSelection) {
            setLocationSelection( locations[1].id )
          } else {
            setLocationSelection( locations[0].id )
          }
        } else {
          setLocationSelection( "no selection" )
        }
      })
      .catch((err) => {
        console.error("Failed to delete", err)
      })
  }, [mutate, location.id, locSelection, locations, setLocationSelection])

  const handleLocationSelect = () => {
    if ( locSelection != location.id ) {
      setLocationSelection( location.id )
      setGuiSelection("no selection")
    }
  }

  const { hovered, ref } = useHover()
  const selected = () => { 
    return locSelection == location.id
  }

  return (
    <Group wrap="nowrap" ref={ref} bg={ hovered || selected() ? "var(--mantine-color-gray-light)" : "none" }
      onClick={ handleLocationSelect }
      justify="space-between" gap="sm" px={12} py={4}
      styles={{ root: { cursor: "pointer" }}}>
      <Text size="sm">
        { location.description }
      </Text>
      { !fbDisabled &&
        <ActionIcon onClick={ handleDelete } color="gray" variant="subtle" size={20}>
          <IconX />
        </ActionIcon>
      }
    </Group>
  )
}