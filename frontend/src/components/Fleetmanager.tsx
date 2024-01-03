/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useContext, useRef } from "react"
import { useMantineContext } from "@mantine/core"

import { Canvas, useFrame, useThree, Vector3 } from "@react-three/fiber"
import { Text, OrbitControls, OrbitControlsProps, TransformControls } from "@react-three/drei"
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing"
import { BlendFunction } from 'postprocessing'
import { proxy } from "valtio"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { locSelectionContext } from "../context/locSelectionContext"
import { moveRobotContext } from "../context/moveRobotContext"

import { Mesh_abb_irb52_7_120 } from "../meshes/Mesh_abb_irb52_7_120"

// import { Urdf_T12 } from "../meshes/Urdf_T12"

export const GRID_BOUND = 4

const state = proxy({ current: "" })

const Bound = (input: number, bound: number) => {
  if ( input > bound ) {
    return bound
  }
  if ( input < -bound ) {
    return -bound
  }
  return input
}

const clamp = ( number: number, min: number, max: number ) => {
  return (
    Math.max( min, Math.min( number, max ))
  )
}

export const Fleetmanager = ({
  updateRobotPosition,
  updateRobotJointAngles,
  updateTask
}: {
  updateRobotPosition: (childData: {id: string, position: number[], rotation: number[] }) => void
  updateRobotJointAngles: (childData: {id: string, jointAngles: number[]}) => void
  updateTask: (childData: {id: string, state: string}) => void
}) => {
  const theme = useMantineContext()
  const { robots } = useContext( RobotContext )
  const { locSelection } = useContext( locSelectionContext )
  const { guiSelection, setGuiSelection } = useContext( guiSelectionContext )
  const { moveRobot } = useContext( moveRobotContext )

  const locationRobots = robots.filter(( robot )=>( robot.locationid == locSelection ))

  const robotCurrent = (childData: string) => {
    state.current = childData
  }

  const RobotControls = () => {
    const scene = useThree((state) => state.scene)
    const object = scene.getObjectByName(guiSelection)

    return (
      <>
        {guiSelection && moveRobot && <TransformControls showY={false} object={object} mode="translate"
          translationSnap={0.1}
          onMouseUp={()=>{
            object &&
            updateRobotPosition({
              id: object.name,
              position: [Bound(object.position.x, GRID_BOUND), object.position.y, Bound(object.position.z, GRID_BOUND)],
              rotation: [object.rotation.x, object.rotation.y, Bound(object.rotation.z, Math.PI)],
            })
          }}
          />}
        {guiSelection && moveRobot && <TransformControls showX={false} showZ={false} object={object} mode="rotate"
          rotationSnap={15*0.0174533}
          onMouseUp={()=>{
            object &&
            updateRobotPosition({
              id: object.name,
              position: [Bound(object.position.x, GRID_BOUND), object.position.y, Bound(object.position.z, GRID_BOUND)],
              rotation: [object.rotation.x, object.rotation.y, Bound(object.rotation.z, Math.PI)],
            })
          }}
          />}
      </>
    )
  }

  function SceneControls() {
    // const scene = useThree((state) => state.scene)
    // const object = scene.getObjectByName(guiSelection)

    // const ref = useRef(null)
    // const { camera } = useThree()
    // const props: OrbitControlsProps = {
    //   makeDefault: true,
    //   screenSpacePanning: false,
    //   enableZoom: true,
    //   minDistance: 2,
    //   maxDistance: 5,
    //   maxPolarAngle: Math.PI/2,
    //   enablePan: true,
    //   target: [0.25, 0, 1]
    // }

    // useFrame(()=>{
    //   const controls = ref.current
    //   if (controls != null && controls != undefined && 'target' in controls) {
    //     const target = controls.target as number[]
    //     const clampedTarget: Vector3 = [clamp(target.x as number, -GRID_BOUND, GRID_BOUND), target.y as number, clamp(target.z as number, -GRID_BOUND, GRID_BOUND)]
    //     if ( object ) {
    //       const pos: number[] = [ object.position.x, object.position.y, object.position.z ]
    //       camera.lookAt( pos[0], pos[1], pos[2] )
    //     } else {
    //       camera.lookAt( clampedTarget[0], clampedTarget[1], clampedTarget[2] )
    //     }
    //   }
    //   const clampedCamera: Vector3 = [clamp(camera.position.x, -2*GRID_BOUND, 2*GRID_BOUND), camera.position.y, clamp(camera.position.z, -2*GRID_BOUND, 2*GRID_BOUND)]
    //   camera.position.x = clampedCamera[0]
    //   camera.position.y = clampedCamera[1]
    //   camera.position.z = clampedCamera[2]
    // })

    return (
      // <OrbitControls ref={ref} args={[camera]} {...props} />
      <OrbitControls makeDefault screenSpacePanning={ false } enableZoom={ false } maxPolarAngle={Math.PI/2} enablePan={ true } target={ [0.25, 0, 1] } />
    )
  }

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [1, 2, 3], near: 0.01, far: 20 }}
      onPointerMissed={() => setGuiSelection("no selection")}>
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline visibleEdgeColor={theme.colorScheme == "dark" ? 0xFFFFFF : 0x000000} blendFunction={BlendFunction.ALPHA} blur edgeStrength={100} width={1600} xRay={false} />
        </EffectComposer>
        {locationRobots.map(( robot ) => (
          <Mesh_abb_irb52_7_120 key={robot.id} robot={robot} selected={guiSelection == robot.id ? true : false} robotCurrent={robotCurrent} updateTask={updateTask} updateRobotJointAngles={updateRobotJointAngles}/>
        ))}
      </Selection>

      <gridHelper args={[GRID_BOUND*2, GRID_BOUND*2, theme.colorScheme == "dark" ? "white" : "black", "gray"]} position={[0, -0.02, 0]} rotation={[0, 0, 0]} />
      <axesHelper args={[1]} position={[-0.01, -0.01, -0.01]} />
      <Text color={"#E03131"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.9, 0, -0.1]} fontSize={0.12}>X</Text>
      <Text color={"#1971C2"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.1, 0, 0.9]} fontSize={0.12}>Z</Text>

      <directionalLight intensity={2} position={ [5, 5, 5] } />
      <directionalLight intensity={2} position={ [5, 5, -5] } />
      <directionalLight intensity={2} position={ [-5, 5, 5] } />
      <directionalLight intensity={2} position={ [-5, 5, -5] } />

      <RobotControls />
      {/* <SceneControls /> */}
      <OrbitControls makeDefault screenSpacePanning={ false } enableZoom={ false } maxPolarAngle={Math.PI/2} enablePan={ true } target={ [0.25, 0, 1] } />
      {/* autoRotate={ true } */}

      {/* <Urdf_T12 /> */}

      {/* <Mesh_cardboard_box_01 /> */}
      {/* <Mesh_cardboard_box_01 /> */}
      {/* <Mesh_cardboard_box_01 /> */}

      {/* <Environment background ground={{ height: 10, radius: 43, scale: 6 }}
        preset={ locSelection == "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99" ? "warehouse" 
        : locSelection == "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d" ? "apartment" 
        : "city" } /> */}
      {/* <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 10, 10]}>
        <planeGeometry />
        <meshBasicMaterial color="#d2d2d2" />
      </mesh> */}
      {/* <ambientLight intensity={1} /> */}
      {/* <ContactShadows scale={ 150 } position={ [0.33, -0.33, 0.33] } opacity={ 1.5 } /> */}
    </Canvas>
  )
}