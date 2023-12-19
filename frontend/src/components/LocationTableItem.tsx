import { useCallback, useContext } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { ActionIcon, Center, Flex, Table, useMantineColorScheme } from "@mantine/core"
import { useHover } from "@mantine/hooks"

import { IconX } from "@tabler/icons-react"

import { useMutate } from "../doctype"
import { ILocation } from "../@types/location"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"
import { guiSelectionContext } from "../context/guiSelectionContext"

export const LocationTableItem = ({
  docId,
  location
}: {
  docId: JournalId
  location: ILocation
}) => {
  const theme = useMantineColorScheme()
  const { locations, robots } = useContext( RobotContext )
  const { locSelection, setLocationSelection } = useContext( locSelectionContext )
  const { setGuiSelection } = useContext( guiSelectionContext )
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == location.id ))
  const numRobots = filteredRobots.length
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

  return (
    <Table.Tr onClick={ handleLocationSelect }
      ref={ref as React.RefObject<HTMLTableRowElement>}
      bg={ selected() ? "var(--mantine-color-gray-light)" : hovered && theme.colorScheme == "dark" ? "var(--mantine-color-gray-9)" : hovered ? "var(--mantine-color-gray-0)" : "none" }
      style={{ cursor: "pointer" }}>
      <Table.Td>{ location.description }</Table.Td>
      <Table.Td>{ numRobots }</Table.Td>
      <Table.Td>
        <Flex justify="right">
          <Center>
            {/* onClick={ (e) => { e.stopPropagation(), handleDelete } } */}
            <ActionIcon onClick={ handleDelete } color="gray" variant="subtle" size={20}>
              <IconX />
            </ActionIcon>
          </Center>
        </Flex>
      </Table.Td>
    </Table.Tr>
  )
}