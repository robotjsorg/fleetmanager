import { useState, useEffect, ReactElement } from "react"
import { useFrame, MeshProps } from "@react-three/fiber"
import URDFLoader, { URDFRobot, URDFLink, URDFJoint, URDFVisual } from "urdf-loader"

export const URDF = () => {
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

  const jointMeshTree = (
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
          return { element: <mesh {...meshProps}>{nested}<meshBasicMaterial/></mesh> }
        }
      }
    }
    return { element: null }
  }

  const getRobot = ( robot: URDFRobot | undefined ) => {
    if ( robot && URDF == null ) {
      getMeshTree( robot )
    }
  }

  const getMeshTree = ( robot: URDFRobot ) => {
    const mesh = robot.children[0].children[0] as THREE.Mesh
    if ( mesh ) {
      robot.rotateX(Math.PI/2)
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
        </mesh>
      )
    }
  }

  useFrame(()=>(
    getRobot(URDFRobot)
  ))

  return (
    <>
      {URDF}
    </>
  )
}