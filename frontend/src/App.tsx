import { useEffect, useState } from "react"

// TODO: Delete all sqlSync references and replace with local client data structs
import { JournalId, sql } from "@orbitinghail/sqlsync-worker"
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

import { zeroJointAngles } from "./meshes/abb_irb52_7_120"

// export const POPULATEDB = true

export const App = ({
  // docId
}: {
  // docId: JournalId
}) => {
  // Initialize database
  // const mutate = useMutate( docId )
  // const [ initDB, setInitDB ] = useState( true )
  // useEffect(() => {
  //   if ( initDB ){
  //     console.log("[INFO] Init DB")
  //     mutate({ tag: "InitSchema" })
  //       .catch(( err ) => {console.error( "Failed to init schema", err )})
  //     if ( POPULATEDB ) {
  //       mutate({ tag: "PopulateLocations" })
  //         .catch(( err ) => {console.error( "Failed to populate locations", err )})
  //     }
  //     setInitDB( false )
  //   }
  // }, [initDB, mutate])

  // Locations
  // const { rows: locations } = useQuery<ILocation>(
  //   docId,
  //   sql`SELECT * FROM locations`
  // )
  const currentDate = new Date()
  const locations = [
    {id: 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', name: 'Warehouse', created_at: currentDate.toLocaleString()},
    {id: 'ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d', name: 'Apartment', created_at: currentDate.toLocaleString()}
  ]

  // Selected location id
  // const [ locSelection, setLocationSelection ] = useState( "no selection" )
  const [ locSelection, setLocationSelection ] = useState( "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" )
  useEffect(()=>{
    if ( Array.isArray(locations) && locations.length > 0 ) {
      if ( locSelection == "no selection" || !locations.find((location)=>(location.id == locSelection)) ) {
        setLocationSelection( locations[0].id )
      } else {
        const selectedLocation = locations.find(( location ) => ( location.id == locSelection ))
        selectedLocation && setLocationSelection( selectedLocation.id )
      }
    } else {
      setLocationSelection( "no selection" )
    }
  }, [locSelection, locations])
  
  // Robots
  // const { rows: queryRobots } = useQuery<IRobotQuery>(
  //   docId,
  //   sql`SELECT * FROM robots`
  //   )
  // if ( POPULATEDB && Array.isArray( locations ) && locations.length > 0 && ( !Array.isArray(queryRobots) || queryRobots.length == 0 )) {
  //   mutate({ tag: "PopulateRobots" })
  //     .catch(( err ) => {console.error( "Failed to populate robots", err )})
  // }
  const queryRobots = [
    {id: '24db4c5b-1e3a-4853-8316-1d6ad07beed1', locationid: 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', description: 'Rusty', state: 'Auto', created_at: currentDate.toLocaleString(), updated_at: currentDate.toLocaleString(), x: 1.0, z: 1.0, theta: 2.355},
    {id: '402e7545-512b-4b7d-b570-e94311b38ab6', locationid: 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', description: 'D.A.R.Y.L.', state: 'Auto', created_at: currentDate.toLocaleString(), updated_at: currentDate.toLocaleString(), x: 1, z: -1, theta: -2.355},
    {id: 'f7a3408d-6329-47fd-ada9-72e6f249c3e2', locationid: 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', description: 'Nozzle', state: 'Auto', created_at: currentDate.toLocaleString(), updated_at: currentDate.toLocaleString(), x: -1, z: -1, theta: -0.785},
    {id: 'c583ab7f-fd7d-4100-9c3e-aa343ea1c232', locationid: 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', description: 'Sprocket', state: 'Auto', created_at: currentDate.toLocaleString(), updated_at: currentDate.toLocaleString(), x: -1, z: 1, theta: 0.785},
    {id: 'd544e656-0e8c-4c3d-91fc-02e38b326c47', locationid: 'ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d', description: 'House Bot 1', state: 'Auto', created_at: currentDate.toLocaleString(), updated_at: currentDate.toLocaleString(), x: -1, z: 0, theta: 0},
    {id: '8e5cc95b-bb27-4150-adfa-2bab6daf313f', locationid: 'ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d', description: 'House Bot 2', state: 'Auto', created_at: currentDate.toLocaleString(), updated_at: currentDate.toLocaleString(), x: 1, z: 0, theta: 3.14}
  ]

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
  // const { rows: queryTasks } = useQuery<ITask>(
  //   docId,
  //   sql`SELECT * FROM tasks ORDER BY robotid, created_at`
  // )
  // if ( POPULATEDB && Array.isArray( robots ) && robots.length > 0 && ( !Array.isArray(queryTasks) || queryTasks.length == 0 )) {
  //   mutate({ tag: "PopulateTasks" })
  //     .catch(( err ) => {console.error( "Failed to populate tasks", err )})
  // }
  const queryTasks = [
    {id: '48228b08-1b8a-4d54-9b90-16f1f73fb1cc', robotid: '24db4c5b-1e3a-4853-8316-1d6ad07beed1', description: 'Pick and place (continuous)', state: 'Queued', created_at: currentDate.toLocaleString()},
    {id: 'ea131ae6-13a8-4a23-9436-5f46f3dcffd1', robotid: '402e7545-512b-4b7d-b570-e94311b38ab6', description: 'Pick and place (continuous)', state: 'Queued', created_at: currentDate.toLocaleString()},
    {id: '720187e4-94f4-4a11-b998-5938554a2fb4', robotid: 'f7a3408d-6329-47fd-ada9-72e6f249c3e2', description: 'Pick and place (continuous)', state: 'Queued', created_at: currentDate.toLocaleString()},
    {id: 'b15b8fc2-cd05-4511-8810-f447c2cc69a1', robotid: 'c583ab7f-fd7d-4100-9c3e-aa343ea1c232', description: 'Pick and place (continuous)', state: 'Queued', created_at: currentDate.toLocaleString()},
    {id: '69c35b71-8715-4eff-bd02-82cfd283cbc8', robotid: 'd544e656-0e8c-4c3d-91fc-02e38b326c47', description: 'Random position (continuous)', state: 'Queued', created_at: currentDate.toLocaleString()},
    {id: '7d77e2f1-8c58-4af4-9f04-0a39bcabb998', robotid: '8e5cc95b-bb27-4150-adfa-2bab6daf313f', description: 'Random position (continuous)', state: 'Queued', created_at: currentDate.toLocaleString()}
  ]
  const [ tasks, setTasks ] = useState<ITask[]>([])
  useEffect(()=>{
    setTasks( queryTasks! )
  }, [queryTasks])
  
  // Current task being displayed on GUI
  const [ currentTask, setCurrentTask ] = useState("")

  // Callback updates
  // robot db
  const updateRobotState = (childData: { id: string, state: string }) => {
    // mutate({ tag: "UpdateRobotState", id: childData.id, state: childData.state })
    //   .catch((err) => {
    //     console.error("Failed to update robot", err)
    //   })
    const index = robots.findIndex((robot) => robot.state == childData.state)
    robots[index].state = childData.state
  }
  const updateRobotPosition = (childData: { id: string, position: number[], rotation: number[] }) => {
    // mutate({ tag: "UpdateRobotPosition", id: childData.id, x: childData.position[0], z: childData.position[2], theta: childData.rotation[2] })
    //   .catch((err) => {
    //     console.error("Failed to update robot", err)
    //   })
    const index = robots.findIndex((robot) => robot.position == childData.position)
    robots[index].position = childData.position
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

    // mutate({ tag: "UpdateTask", id: childData.id, state: childData.state })
    //   .catch((err) => {
    //     console.error("Failed to update task", err)
    //   })
  }

  return (
    <MantineProvider defaultColorScheme="dark">
      <RobotProvider locations={locations ?? []} robots={robots ?? []} tasks={tasks ?? []}>
        <locSelectionContext.Provider value={{ locSelection, setLocationSelection }}>
          <guiSelectionContext.Provider value={{ guiSelection, setGuiSelection }}>
            <currentTaskContext.Provider value={{ currentTask, setCurrentTask }}>
              <moveRobotContext.Provider value={{ moveRobot, setMoveRobot }}>
                <FMAppShell //docId={docId}
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