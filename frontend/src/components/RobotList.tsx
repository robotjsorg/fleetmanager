import { useContext, useEffect, useState } from "react"

import { ScrollArea, Stack, Text } from "@mantine/core"

import { IRobot } from "../@types/robot"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"

import { RobotListItem } from "./RobotListItem"

export const RobotList = () => {
  const { robots } = useContext( RobotContext )
  const { locSelection } = useContext( locSelectionContext )
  const [filteredRobots, setFilteredRobots] = useState<IRobot[]>([])
  useEffect(()=>{
    setFilteredRobots(robots.filter(( robot ) => ( robot.locationid == locSelection )))
  }, [locSelection, robots])

  return (
    <ScrollArea type="auto">
      <Stack gap={0}>
        {filteredRobots.length == 0 ? <Text>No Robots</Text> :
          filteredRobots.map((robot) => (
            <RobotListItem key={robot.id} robot={robot} />
          ))
        }
      </Stack>
    </ScrollArea>
  )
}