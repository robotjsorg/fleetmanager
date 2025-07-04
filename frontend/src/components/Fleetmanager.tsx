import { useContext } from "react"
import { useMantineContext } from "@mantine/core"

import { AxesHelperProps, Canvas, DirectionalLightProps, Euler, GridHelperProps, useThree, Vector3 } from "@react-three/fiber"
import { Text, OrbitControls, TransformControls } from "@react-three/drei"
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing"
import { proxy } from "valtio"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { locSelectionContext } from "../context/locSelectionContext"
import { moveRobotContext } from "../context/moveRobotContext"

import { Abb_irb52_7_120 } from "../meshes/abb_irb52_7_120"

export const GRID_BOUND = 5

const state = proxy({ current: "" })

export interface URDFProps {
  position: Vector3,
  rotation: Euler
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

  const Controls = () => {
    const scene = useThree((state) => state.scene)
    const object = scene.getObjectByName(guiSelection)

    const Bound = (input: number, bound: number) => {
      if ( input > bound ) {
        return bound
      }
      if ( input < -bound ) {
        return -bound
      }
      return input
    }

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

  const gridHelperProps: GridHelperProps = {args: [GRID_BOUND*2, GRID_BOUND*2, theme.colorScheme == "dark" ? "white" : "black", "gray"], position: [0, -0.02, 0], rotation: [0, 0, 0] }
  const axesHelperProps: AxesHelperProps = {args: [1], position: [-0.01, -0.01, -0.01]}
  const directionalLightProps1: DirectionalLightProps = {intensity: 2, position: [5, 5, 5]}
  const directionalLightProps2: DirectionalLightProps = {intensity: 2, position: [5, 5, -5]}
  const directionalLightProps3: DirectionalLightProps = {intensity: 2, position: [-5, 5, 5]}
  const directionalLightProps4: DirectionalLightProps = {intensity: 2, position: [-5, 5, -5]}

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [1, 2, 3], near: 0.01, far: 20 }}
      onPointerMissed={() => setGuiSelection("no selection")}>
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline visibleEdgeColor={theme.colorScheme == "dark" ? 0xFFFFFF : 0x364FC7} blur edgeStrength={100} width={1000} />
        </EffectComposer>
        {locationRobots.map(( robot ) => (
          <Abb_irb52_7_120 key={robot.id} robot={robot} selected={guiSelection == robot.id ? true : false} robotCurrent={robotCurrent} updateTask={updateTask} updateRobotJointAngles={updateRobotJointAngles}/>
        ))}
      </Selection>

      <gridHelper {...gridHelperProps} />
      <axesHelper {...axesHelperProps} />
      <Text color={"#E03131"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.9, 0, -0.1]} fontSize={0.12}>X</Text>
      <Text color={"#1971C2"} rotation={[Math.PI/2, Math.PI, Math.PI]} position={[0.1, 0, 0.9]} fontSize={0.12}>Z</Text>

      <directionalLight {...directionalLightProps1} />
      <directionalLight {...directionalLightProps2} />
      <directionalLight {...directionalLightProps3} />
      <directionalLight {...directionalLightProps4} />

      <Controls />
      <OrbitControls makeDefault screenSpacePanning={ false } enableZoom={ false } maxPolarAngle={Math.PI/2} enablePan={ true } target={ [0.25, 0, 1] } />
    </Canvas>
  )
}