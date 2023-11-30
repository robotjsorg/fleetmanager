/* eslint-disable react/no-unknown-property */
import { useRef, useContext, useState, useEffect } from "react"

import { Euler, Vector3, useFrame } from "@react-three/fiber"
import { useCursor, useGLTF } from "@react-three/drei"
import { Select } from "@react-three/postprocessing"
import { GLTF } from "three-stdlib"
import { useSpring, animated, config } from "@react-spring/three"

import { IRobot } from "../@types/robot"
import { ITask } from "../@types/task"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { currentTaskContext } from "../context/currentTaskContext"

const isLocalhost = location.hostname === "localhost" || location.hostname.startsWith("192.168")
const localFilepath = "../../assets/gltf/"
const filename = "abb_irb52_7_120.glb"
const filepath = isLocalhost ? localFilepath + filename : filename

export const JOINT_LIMITS = [[-180*0.0174533, 180*0.0174533], [-63*0.0174533, 110*0.0174533], [-235*0.0174533, 55*0.0174533], [-200*0.0174533, 200*0.0174533], [-115*0.0174533, 115*0.0174533], [-400*0.0174533, 400*0.0174533]]

type GLTFResult = GLTF & {
  nodes: {
    abb_irb52_7_120: THREE.Mesh
    base_link: THREE.Mesh
    link_1: THREE.Mesh
    link_2: THREE.Mesh
    link_3: THREE.Mesh
    link_4: THREE.Mesh
    link_5: THREE.Mesh
    link_6: THREE.Mesh
  }
  materials: {
    ["default"]: THREE.MeshStandardMaterial
    gkmodel0_base_link_geom0: THREE.MeshStandardMaterial
    gkmodel0_link_1_geom0: THREE.MeshStandardMaterial
    gkmodel0_link_2_geom0: THREE.MeshStandardMaterial
    gkmodel0_link_3_geom0: THREE.MeshStandardMaterial
    gkmodel0_link_4_geom0: THREE.MeshStandardMaterial
    gkmodel0_link_5_geom0: THREE.MeshStandardMaterial
    gkmodel0_link_6_geom0: THREE.MeshStandardMaterial
  }
}

export const zeroJointAngles = () => {
  return [Math.PI/4, -Math.PI/4, Math.PI/4, 0, 0, 0]
}
const randomJointAngles = () => {
  const angles = [0, 0, 0, 0, 0, 0]
  for( let i = 0; i < JOINT_LIMITS.length; i++ ){
    const big = JOINT_LIMITS[i][1]
    const small = JOINT_LIMITS[i][0]
    angles[ i ] = Math.random() * ( big - small ) + small
  }
  return (
    angles
  )
}

const home = () => {
  return [0, 0, 0, 0, 0, 0]
}
const prepick = () => {
  return [Math.PI/6, Math.PI/4, -Math.PI/12, 0, Math.PI/3, 0]
}
const pick = () => {
  return [Math.PI/6, Math.PI/3, -Math.PI/6, 0, Math.PI/3, 0]
}
const postpick = () => {
  return [Math.PI/6, Math.PI/4, -Math.PI/12, 0, Math.PI/3, 0]
}
const preplace = () => {
  return [-Math.PI/6, Math.PI/4, -Math.PI/12, 0, Math.PI/3, 0]
}
const place = () => {
  return [-Math.PI/6, Math.PI/3, -Math.PI/6, 0, Math.PI/3, 0]
}
const postplace = () => {
  return [-Math.PI/6, Math.PI/4, -Math.PI/12, 0, Math.PI/3, 0]
}

export const Mesh_abb_irb52_7_120 = ({
  robot,
  selected,
  robotCurrent,
  updateTask,
  updateRobotJointAngles
} : {
  robot: IRobot
  selected: boolean
  robotCurrent: (childData: string) => void
  updateTask: (childData: {id: string, state: string}) => void
  updateRobotJointAngles: (childData: {id: string, jointAngles: number[]}) => void
}) => {
  const ref = useRef<THREE.Mesh>(null!)
  const { nodes, materials } = useGLTF( filepath ) as GLTFResult
  const { setGuiSelection } = useContext( guiSelectionContext )
  const [ jointAngles, setJointAngles ] = useState( robot.jointAngles )

  const SHADOWS = false

  const [springs, api] = useSpring(
    () => ({
      jointAngles: jointAngles,
      // jointAngles: zeroJointAngles(), // changing this did not work
      config: config.molasses
    }),
    []
  )

  const { tasks } = useContext( RobotContext )
  const [ task, setTask ] = useState<ITask>()
  const { setCurrentTask } = useContext( currentTaskContext )

  useEffect(() => {
    if ( Array.isArray( tasks ) && tasks.length > 0 ) {
      const activeTasks = tasks.filter(( task ) => ( task.robotid == robot.id && task.state == "Active" ))
      if ( Array.isArray( activeTasks ) && activeTasks.length > 0 ) {
        setTask( activeTasks[0] )
        if ( selected ) {
          setCurrentTask( activeTasks[0].id )
        }
      } else {
        const queuedTasks = tasks.filter(( task ) => ( task.robotid == robot.id && task.state == "Queued" ))
        if ( Array.isArray( queuedTasks ) && queuedTasks.length > 0 ) {
          updateTask( {id: queuedTasks[0].id, state: "Active"} )
        }
      }
    }
  }, [robot.id, selected, setCurrentTask, tasks, updateTask])

  useEffect(()=>{
    if ( task && task.state == "Active" ) {
      if ( task.description == "Random positions (continuous)" ) {
        if ( springs.jointAngles.idle ) {
          api.start({
            jointAngles: randomJointAngles()
          })
        }
      } else if ( task.description == "Home" ) {
        api.start({
          jointAngles: home()
        })
      } else if ( task.description == "Move pre-pick" ) {
        api.start({
          jointAngles: prepick()
        })
      } else if ( task.description == "Move pick" ) {
        api.start({
          jointAngles: pick()
        })
      } else if ( task.description == "Move post-pick" ) {
        api.start({
          jointAngles: postpick()
        })
      } else if ( task.description == "Move pre-place" ) {
        api.start({
          jointAngles: preplace()
        })
      } else if ( task.description == "Move place" ) {
        api.start({
          jointAngles: place()
        })
      } else if ( task.description == "Move post-place" ) {
        api.start({
          jointAngles: postplace()
        })
      }
      if ( springs.jointAngles.idle && task.description != "Random positions (continuous)" ) {
        updateTask( {id: task.id, state: "Completed"} )
      }
    }
  }, [api, task, springs.jointAngles.idle, updateTask])

  const [ hovered, hover ] = useState( false )
  useCursor( hovered )

  const handleStates = () => {
    switch( robot.state ) {
      case "Manual": {
        if ( springs.jointAngles.get() != robot.jointAngles ) {
          springs.jointAngles.set( robot.jointAngles )
        }
        if ( jointAngles != robot.jointAngles ) {
          setJointAngles( robot.jointAngles )
          updateRobotJointAngles({ id: robot.id, jointAngles: robot.jointAngles })
        }
        break 
      }
      case "Auto": {
        if ( task ) {
          if ( robot.jointAngles != springs.jointAngles.get() ) {
            robot.jointAngles = springs.jointAngles.get()
          }
          if ( jointAngles != springs.jointAngles.get() ) {
            setJointAngles( springs.jointAngles.get() )
            updateRobotJointAngles({ id: robot.id, jointAngles: springs.jointAngles.get() })
          }
        } else {
          if ( springs.jointAngles.get() != robot.jointAngles ) {
            springs.jointAngles.set( robot.jointAngles )
          }
          if ( jointAngles != robot.jointAngles ) {
            setJointAngles( robot.jointAngles )
            updateRobotJointAngles({ id: robot.id, jointAngles: robot.jointAngles })
          }
        }
        break 
      }
      default: { // Off, Error
        if ( springs.jointAngles.get() != robot.jointAngles ) {
          springs.jointAngles.set( robot.jointAngles )
        }
        if ( jointAngles != robot.jointAngles ) {
          setJointAngles( robot.jointAngles )
        }
        break 
      }
    }
  }

  useFrame(() => ( // _state, delta
    handleStates()
  ))

  return (
    <Select enabled={ selected || hovered }>
      <animated.mesh
        ref={ref}
        name={robot.id}
        onClick={(e) => (e.stopPropagation(), setGuiSelection(robot.id), robotCurrent(robot.id))}
        onPointerMissed={(e) => e.type === 'click' && robotCurrent("")}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        geometry={nodes.base_link.geometry}
        material={materials.gkmodel0_base_link_geom0}
        position={robot.position as Vector3}
        rotation={robot.rotation as Euler}
        castShadow={SHADOWS}
        receiveShadow={SHADOWS}>
        <mesh
          geometry={nodes.link_1.geometry}
          material={materials.gkmodel0_link_1_geom0}
          position={[0, 0, 0.486]}
          rotation={[0, 0, jointAngles[0]]}
          castShadow={SHADOWS}
          receiveShadow={SHADOWS}>
          <mesh
            geometry={nodes.link_2.geometry}
            material={materials.gkmodel0_link_2_geom0}
            position={[0.15, 0, 0]}
            rotation={[0, jointAngles[1], 0]}
            castShadow={SHADOWS}
            receiveShadow={SHADOWS}>
            <mesh
              geometry={nodes.link_3.geometry}
              material={materials.gkmodel0_link_3_geom0}
              position={[0, 0, 0.475]}
              rotation={[0, jointAngles[2], 0]}
              castShadow={SHADOWS}
              receiveShadow={SHADOWS}>
              <mesh
                geometry={nodes.link_4.geometry}
                material={materials.gkmodel0_link_4_geom0}
                position={[0.6, 0, 0]}
                rotation={[jointAngles[3], 0, 0]}
                castShadow={SHADOWS}
                receiveShadow={SHADOWS}>
                <mesh
                  rotation={[0, jointAngles[4], 0]}
                  geometry={nodes.link_5.geometry}
                  material={materials.gkmodel0_link_5_geom0}
                  castShadow={SHADOWS}
                  receiveShadow={SHADOWS}>
                  <mesh
                    geometry={nodes.link_6.geometry}
                    material={materials.gkmodel0_link_6_geom0}
                    position={[0.065, 0, 0]}
                    rotation={[jointAngles[5], 0, 0]}
                    castShadow={SHADOWS}
                    receiveShadow={SHADOWS}/>
                </mesh>
              </mesh>
            </mesh>
          </mesh>
        </mesh>
      </animated.mesh>
    </Select>
  )
}

useGLTF.preload( filepath )