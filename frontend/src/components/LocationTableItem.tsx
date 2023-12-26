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
        } else if ( locations.length <= 1 ) {
          setLocationSelection( "no selection" )
        }
      })
      .catch((err) => {
        console.error("Failed to delete", err)
      })
  }, [mutate, location.id, locSelection, locations, setLocationSelection])

  // !subpageOpened && theme.colorScheme == "dark" ? "var(--mantine-color-dark-5)"
  // : !subpageOpened  && theme.colorScheme == "light" ? "var(--mantine-color-gray-1)"
  // : hovered1a && theme.colorScheme == "dark" ? "var(--mantine-color-dark-6)"
  // : hovered1a && theme.colorScheme == "light" ? "var(--mantine-color-gray-0)"
  // : "none"

  return (
    <Table.Tr ref={ref as React.RefObject<HTMLTableRowElement>}
      bg={
        selected() && theme.colorScheme == "dark" ? "var(--mantine-color-dark-5)"
        : selected() && theme.colorScheme == "light" ? "var(--mantine-color-gray-1)"
        : hovered && theme.colorScheme == "dark" ? "var(--mantine-color-dark-6)"
        : hovered ? "var(--mantine-color-gray-0)"
        : "none"
      }>
      <Table.Td onClick={ handleLocationSelect } style={{ cursor: "pointer" }}>{ location.description }</Table.Td>
      <Table.Td onClick={ handleLocationSelect } style={{ cursor: "pointer" }}>{ numRobots }</Table.Td>
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