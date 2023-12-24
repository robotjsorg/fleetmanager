import { useEffect, useState } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { sql } from "@orbitinghail/sqlsync-react"
import { MantineProvider } from "@mantine/core"

import { useMutate, useQuery } from "./doctype"
import { ILocation } from "./@types/location"
import { IRobotQuery, IRobot } from "./@types/robot"
import { ITask } from "./@types/task"

import { RobotProvider } from "./context/robotContext"
import { guiSelectionContext } from "./context/guiSelectionContext"
import { locSelectionContext } from "./context/locSelectionContext"
import { moveRobotContext } from "./context/moveRobotContext"
import { currentTaskContext } from "./context/currentTaskContext"

import { FMAppShell } from "./views/FMAppShell"

import { zeroJointAngles } from "./meshes/Mesh_abb_irb52_7_120"

export const POPULATEDB = true

export const App = ({
  docId
}: {
  docId: JournalId
}) => {
  // Initialize database
  const mutate = useMutate( docId )
  const [ initDB, setInitDB ] = useState( true )
  useEffect(() => {
    if ( initDB ){
      console.log("[INFO] Init DB")
      mutate({ tag: "InitSchema" })
        .catch(( err ) => {console.error( "Failed to init schema", err )})
      if ( POPULATEDB ) {
        mutate({ tag: "PopulateDB" })
          .catch(( err ) => {console.error( "Failed to populate database", err )})
      }
      setInitDB( false )
    }
  }, [initDB, mutate])

  // Locations
  const { rows: locations } = useQuery<ILocation>(
    docId,
    sql`SELECT * FROM locations`
  )

  // Selected location id
  let initLocSelection = "no selection"
  if ( POPULATEDB ) {
    initLocSelection = "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99"
  }
  const [ locSelection, setLocationSelection ] = useState( initLocSelection )

  // Robots
  const { rows: queryRobots } = useQuery<IRobotQuery>(
    docId,
    sql`SELECT * FROM robots`
  )
  function getRobots (
    localRobots: IRobot[],
    queryRobots: IRobotQuery[]
  ): IRobot[] {
    const updatedRobots: IRobot[] = []
    queryRobots?.map((queryRobot) => {
      const localRobot = localRobots.find((r) => r.id == queryRobot.id)
      if ( localRobot ) {
        updatedRobots.push({
          ...queryRobot,
          position: [queryRobot.x, -0.02, queryRobot.z],
          rotation: [-Math.PI / 2, 0, queryRobot.theta],
          toolState: localRobot.toolState,
          jointAngles: localRobot.jointAngles
        })
      } else {
        updatedRobots.push({
          ...queryRobot,
          position: [queryRobot.x, -0.02, queryRobot.z],
          rotation: [-Math.PI / 2, 0, queryRobot.theta],
          toolState: "Unactuated",
          jointAngles: zeroJointAngles()
        })
      }
    })
    return updatedRobots
  }
  const [ robots, setRobots ] = useState<IRobot[]>(getRobots([], queryRobots!))
  useEffect(()=>{
    setRobots( r => getRobots( r, queryRobots! ) )
  }, [queryRobots])

  // Selected robot id
  const [ guiSelection, setGuiSelection ] = useState( "no selection" )
  
  // If robot is being moved on GUI
  const [ moveRobot, setMoveRobot ] = useState( false )
  useEffect(()=>{
    setMoveRobot( false )
  }, [guiSelection])
  
  // Tasks
  const { rows: tasksQuery } = useQuery<ITask>(
    docId,
    sql`SELECT * FROM tasks ORDER BY created_at`
  )
  const [ tasks, setTasks ] = useState<ITask[]>([])
  useEffect(()=>{
    setTasks( tasksQuery! )
  }, [tasksQuery])
  
  // Current task being displayed on GUI
  const [ currentTask, setCurrentTask ] = useState("")

  // Callback updates
  // robot db
  const updateRobotState = (childData: { id: string, state: string }) => {
    mutate({ tag: "UpdateRobotState", id: childData.id, state: childData.state })
      .catch((err) => {
        console.error("Failed to update robot", err)
      })
  }
  const updateRobotPosition = (childData: { id: string, position: number[], rotation: number[] }) => {
    mutate({ tag: "UpdateRobotPosition", id: childData.id, x: childData.position[0], z: childData.position[2], theta: childData.rotation[2] })
      .catch((err) => {
        console.error("Failed to update robot", err)
      })
  }
  // robot local
  const updateRobotToolState = (childData: { id: string, toolState: string }) => {
    const index = robots.findIndex((robot) => robot.id == childData.id)
    robots[index].toolState = childData.toolState
  }
  const updateRobotJointAngles = (childData: { id: string, jointAngles: number[] }) => {
    const index = robots.findIndex((robot) => robot.id == childData.id)
    robots[index].jointAngles = childData.jointAngles
  }
  // task db
  const updateTask = (childData: {id: string, state: string}) => {
    const index = tasks.findIndex((task) => task.id == childData.id)
    tasks[index].state = childData.state
    setTasks(tasks)

    mutate({ tag: "UpdateTask", id: childData.id, state: childData.state })
      .catch((err) => {
        console.error("Failed to update task", err)
      })
  }

  return (
    <MantineProvider defaultColorScheme="dark">
      <RobotProvider locations={locations ?? []} robots={robots ?? []} tasks={tasks ?? []}>
        <locSelectionContext.Provider value={{ locSelection, setLocationSelection }}>
          <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
            <currentTaskContext.Provider value={{ currentTask, setCurrentTask }}>
              <moveRobotContext.Provider value={{ moveRobot, setMoveRobot }}>
                <FMAppShell docId={docId}
                  updateRobotState={updateRobotState}
                  updateRobotPosition={updateRobotPosition}
                  updateRobotToolState={updateRobotToolState}
                  updateRobotJointAngles={updateRobotJointAngles}
                  updateTask={updateTask} />
              </moveRobotContext.Provider>
            </currentTaskContext.Provider>
          </guiSelectionContext.Provider>
        </locSelectionContext.Provider>
      </RobotProvider>
    </MantineProvider>
  )
}