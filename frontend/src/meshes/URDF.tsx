import { useState, useEffect, ReactElement, useCallback } from "react"
import { MeshProps, Vector3 } from "@react-three/fiber"
import URDFLoader, { URDFRobot, URDFLink, URDFJoint, URDFVisual } from "urdf-loader"

export const URDF = (
  position: Vector3
) => {
  const [ URDFRobot, setURDFRobot ] = useState<URDFRobot>()
  const [ URDF, setURDF ] = useState<ReactElement>()

  useEffect(()=>{
    if ( URDFRobot == null ) {
      const loader = new URDFLoader()
      loader.load( "../../assets/urdf/T12/urdf/T12.URDF", urdf => {
        setURDFRobot( urdf )
      })
    }
  }, [URDFRobot])

  const getLinkJoints = ( link: URDFLink ) => {
    if ( link.children.length > 0 ) {
      return link.children as URDFJoint[]
    } else {
      return null
    }
  }

  const jointMeshTree = useCallback((
    joint: URDFJoint
  ): {
    element: ReactElement | null
  } => {
    const link = joint.children[0] as URDFLink
    if ( link ) {
      const visual = link.children[0] as URDFVisual
      if ( visual ) {
        const mesh = visual.children[0] as THREE.Mesh
        if ( mesh ) {
          const meshProps: MeshProps = { key: link.name, geometry: mesh.geometry, position: joint.position, rotation: joint.rotation, castShadow: true, receiveShadow: true }
          const joints = getLinkJoints( link )
          const nested: ReactElement[] = []
          joints?.forEach(joint => {
            const { element } = jointMeshTree( joint )
            if ( element ) {
              nested.push( element )
            }
          })
          return { element: <mesh {...meshProps}>{nested}<meshStandardMaterial/></mesh> }
        }
      }
    }
    return { element: null }
  }, [])

  const getMeshTree = useCallback(( robot: URDFRobot | undefined, position: Vector3 ) => {
    if ( robot ) {
      const mesh = robot.children[0].children[0] as THREE.Mesh
      if ( mesh ) {
        const pos = position as number[]
        // const rot = rotation as number[]
        robot.translateX(pos[0])
        robot.translateY(pos[1])
        robot.translateZ(pos[2])
        robot.rotateX(Math.PI/2)
        // robot.rotateX(rot[0])
        // robot.rotateY(rot[1])
        // robot.rotateZ(rot[2])
        const meshProps: MeshProps = { key: robot.name, geometry: mesh.geometry, position: robot.position, rotation: robot.rotation, castShadow: true, receiveShadow: true }
        const joints = robot.children.slice(1) as URDFJoint[]
        const meshes: ReactElement[] = []
        joints.forEach( joint => {
          const { element } = jointMeshTree( joint  )
          if ( element ) {
            meshes.push( element )
          }
        })
        setURDF(
          <mesh {...meshProps}>
            {meshes}
            <meshStandardMaterial/>
          </mesh>
        )
      }
    }
  }, [jointMeshTree])

  useEffect(()=>{
    getMeshTree(URDFRobot, position)
  }, [URDFRobot, getMeshTree, position])

  return (
    <>
      {URDF}
    </>
  )
}