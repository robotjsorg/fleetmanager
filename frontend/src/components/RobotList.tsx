import { useContext, useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Stack, ScrollArea, Text } from "@mantine/core"

import { IRobot } from "../@types/robot"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"

import { RobotItem } from "./RobotItem"

export const RobotList = ({
  docId,
  fbDisabled
}: {
  docId: JournalId
  fbDisabled: boolean
}) => {
  const { robots } = useContext( RobotContext )
  const { locSelection } = useContext( locSelectionContext )
  const [filteredRobots, setFilteredRobots] = useState<IRobot[]>([])
  useEffect(()=>{
    setFilteredRobots(robots.filter(( robot ) => ( robot.locationid == locSelection )))
  }, [locSelection, robots])

  return (
    <ScrollArea type="auto">
      <Stack gap="xs">
      {filteredRobots.length == 0 ? <Text>No Robots</Text> :
        filteredRobots.map((robot) => (
          <RobotItem docId={docId} key={robot.id} robot={robot} fbDisabled={fbDisabled} />
        ))
      }
      </Stack>
    </ScrollArea>
  )
}
