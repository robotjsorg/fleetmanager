import { useRef, useContext, useState, useEffect } from "react"

import { Euler, MeshProps, Vector3, useFrame } from "@react-three/fiber"
import { useCursor, useGLTF } from "@react-three/drei"
import { Select } from "@react-three/postprocessing"
import { GLTF } from "three-stdlib"
import { useSpring, animated, easings } from "@react-spring/three"

import { IRobot } from "../@types/robot"
import { ITask } from "../@types/task"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { currentTaskContext } from "../context/currentTaskContext"

const isLocalhost = location.hostname === "localhost" || location.hostname.startsWith("192.168")
const localFilepath = "../../assets/gltf/"
const filename = "abb_irb52_7_120.glb"
const filepath = isLocalhost ? localFilepath + filename : filename

export const JOINT_LIMITS = [
  [-180*0.0174533, 180*0.0174533],
  [-63*0.0174533, 110*0.0174533],
  [-235*0.0174533, 55*0.0174533],
  [-200*0.0174533, 200*0.0174533],
  [-115*0.0174533, 115*0.0174533],
  [-400*0.0174533, 400*0.0174533]
]

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
      config: {
        easing: easings.easeInOutQuad
      }
    }),
    []
  )

  const { tasks } = useContext( RobotContext )
  const [ task, setTask ] = useState<ITask>()
  const { setCurrentTask } = useContext( currentTaskContext )

  useEffect(() => {
    if ( Array.isArray( tasks ) && tasks.length > 0 ) {
      const activeTask = tasks.find(( task ) => ( task.robotid == robot.id && task.state == "Active" ))
      if ( activeTask ) {
        setTask( activeTask )
        selected && setCurrentTask( activeTask.id )
      } else {
        setTask( undefined )
        const queuedTask = tasks.find(( task ) => ( task.robotid == robot.id && task.state == "Queued" ))
        queuedTask && updateTask( {id: queuedTask.id, state: "Active"} )
      }
    }
  }, [robot.id, selected, setCurrentTask, tasks, updateTask])

  const [ numSubtasks, setNumSubtasks ] = useState(1)
  const [ animationStep, setAnimationStep ] = useState(1)

  useEffect(()=>{
    if ( task && task.state == "Active" ) {
      if ( task.description == "Home" ) {
        setNumSubtasks( 1 )
        api.start({
          jointAngles: home()
        })
      } else if ( task.description == "Random position" || task.description == "Random position (continuous)") {
        setNumSubtasks( 1 )
        if ( animationStep == 1 ) {
          api.start({
            jointAngles: randomJointAngles()
          })
          setAnimationStep( 0 )
        }
      } else if ( task.description == "Pick and place" || task.description == "Pick and place (continuous)" ) {
        setNumSubtasks( 7 )
        if ( animationStep == 1 ) {
          api.start({
            jointAngles: prepick()
          })
        } else if ( animationStep == 2 ) {
          api.start({
            jointAngles: pick()
          })
        } else if ( animationStep == 3 ) {
          api.start({
            jointAngles: postpick()
          })
        } else if ( animationStep == 4 ) {
          api.start({
            jointAngles: preplace()
          })
        } else if ( animationStep == 5 ) {
          api.start({
            jointAngles: place()
          })
        } else if ( animationStep == 6 ) {
          api.start({
            jointAngles: postplace()
          })
        } else if ( animationStep == 7 ) {
          api.start({
            jointAngles: home()
          })
        }
      }

      if ( springs.jointAngles.idle ) {
        if ( animationStep == numSubtasks || animationStep == 0 ) {
          if ( task.description != "Pick and place (continuous)" && task.description != "Random position (continuous)" ) {
            updateTask( {id: task.id, state: "Completed"} )
          }
          setAnimationStep( 1 )
        } else if ( animationStep < numSubtasks && numSubtasks > 1 && task.description != "Random position" && task.description != "Random position (continuous)" ) {
          setAnimationStep( animationStep + 1 )
        }
      }
    }
  }, [api, task, springs, updateTask, animationStep, numSubtasks])

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

  const link1MeshProps: MeshProps = {
    geometry: nodes.link_1.geometry,
    material: materials.gkmodel0_link_1_geom0,
    position: [0, 0, 0.486],
    rotation: [0, 0, jointAngles[0]],
    castShadow: SHADOWS,
    receiveShadow: SHADOWS
  }
  const link2MeshProps: MeshProps = {
    geometry: nodes.link_2.geometry,
    material: materials.gkmodel0_link_2_geom0,
    position: [0.15, 0, 0],
    rotation: [0, jointAngles[1], 0],
    castShadow: SHADOWS,
    receiveShadow: SHADOWS
  }
  const link3MeshProps: MeshProps = {
    geometry: nodes.link_3.geometry,
    material: materials.gkmodel0_link_3_geom0,
    position: [0, 0, 0.475],
    rotation: [0, jointAngles[2], 0],
    castShadow: SHADOWS,
    receiveShadow: SHADOWS
  }
  const link4MeshProps: MeshProps = {
    geometry: nodes.link_4.geometry,
    material: materials.gkmodel0_link_4_geom0,
    position: [0.6, 0, 0],
    rotation: [jointAngles[3], 0, 0],
    castShadow: SHADOWS,
    receiveShadow: SHADOWS
  }
  const link5MeshProps: MeshProps = {
    geometry: nodes.link_5.geometry,
    material: materials.gkmodel0_link_5_geom0,
    position: [0, 0, 0],
    rotation: [0, jointAngles[4], 0],
    castShadow: SHADOWS,
    receiveShadow: SHADOWS
  }
  const link6MeshProps: MeshProps = {
    geometry: nodes.link_6.geometry,
    material: materials.gkmodel0_link_6_geom0,
    position: [0.065, 0, 0],
    rotation: [jointAngles[5], 0, 0],
    castShadow: SHADOWS,
    receiveShadow: SHADOWS
  }

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
        <mesh {...link1MeshProps}>
          <mesh {...link2MeshProps}>
            <mesh {...link3MeshProps}>
              <mesh {...link4MeshProps}>
                <mesh {...link5MeshProps}>
                  <mesh {...link6MeshProps}/>
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