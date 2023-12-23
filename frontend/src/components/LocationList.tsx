import { useContext } from "react"

import { ScrollArea, Stack, Text } from "@mantine/core"

import { RobotContext } from "../context/robotContext"

import { LocationListItem } from "./LocationListItem"

export const LocationList = () => {
  const { locations } = useContext( RobotContext )
  
  return (
    <ScrollArea type="auto">
      <Stack gap={0}>
      {locations.length == 0 ? <Text>No Locations</Text> :
        locations.map((location) => (
          <LocationListItem key={location.id} location={location} />
        ))
      }
      </Stack>
    </ScrollArea>
  )
}