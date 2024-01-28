import { useState, useEffect, ReactElement } from "react"
import { useFrame, MeshProps } from "@react-three/fiber"
import URDFLoader, { URDFRobot, URDFLink, URDFJoint, URDFVisual } from "urdf-loader"

export const T12 = () => {
  const [ T12URDF, setT12URDF ] = useState<URDFRobot>()
  const [ T12React, setT12React ] = useState<ReactElement>()

  useEffect(()=>{
    if ( T12URDF == null ) {
      const loader = new URDFLoader()
      loader.load( "../../assets/urdf/T12/urdf/T12.URDF", urdf => {
        setT12URDF( urdf )
      })
    }
    else {
      console.log(T12URDF)
      console.log(T12URDF.links)
      console.log(T12URDF.joints)
    }
  }, [T12URDF])

  const getLinkJoints = ( link: URDFLink ) => {
    if ( link.children.length > 0 ) {
      return link.children as URDFJoint[]
    } else {
      return null
    }
  }

  const jointMeshTree = (
    joint: URDFJoint,
    time: number
  ): {
    element: ReactElement | null
  } => {
    const link = joint.children[0] as URDFLink
    if ( link ) {
      const visual = link.children[0] as URDFVisual
      if ( visual ) {
        const mesh = visual.children[0] as THREE.Mesh
        if ( mesh ) {
          // joint.setJointValue(time)
          // const rotation: Euler = [joint.rotation.x, joint.rotation.y, joint.rotation.z + time]
          const meshProps: MeshProps = { key: link.name, geometry: mesh.geometry, position: joint.position, rotation: joint.rotation, castShadow: true, receiveShadow: true }
          const joints = getLinkJoints( link )
          const nested: ReactElement[] = []
          joints?.forEach(joint => {
            const { element } = jointMeshTree( joint, time )
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

  const getMeshTree = ( robot: URDFRobot | undefined, time: number ) => {
    if ( robot && T12React == null ) {
      const mesh = robot.children[0].children[0] as THREE.Mesh
      if ( mesh ) {
        robot.rotateX(Math.PI/2)
        const meshProps: MeshProps = { key: robot.name, geometry: mesh.geometry, position: robot.position, rotation: robot.rotation, castShadow: true, receiveShadow: true }
        const joints = robot.children.slice(1) as URDFJoint[]
        const meshes: ReactElement[] = []
        joints.forEach( joint => {
          const { element } = jointMeshTree( joint, time )
          if ( element ) {
            meshes.push( element )
          }
        })
        setT12React(
          <mesh {...meshProps}>
            {meshes}
          </mesh>
        )
      }
    }
  }

  useFrame((state)=>(
    console.log(state.clock.elapsedTime),
    getMeshTree(T12URDF, state.clock.elapsedTime)
  ))

  return (
    <>
      {T12React}
    </>
  )
}