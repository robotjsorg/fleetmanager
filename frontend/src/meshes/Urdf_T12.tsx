import { useState, useEffect, ReactElement } from "react"
import { useFrame, MeshProps } from "@react-three/fiber"
import URDFLoader, { URDFRobot, URDFLink, URDFJoint, URDFVisual } from "urdf-loader"

export const Urdf_T12 = () => {
  const [ model, setModel ] = useState<URDFRobot>()
  const [ meshTree, setMeshTree ] = useState<ReactElement>()

  useEffect(()=>{
    if ( model == null ) {
      const loader = new URDFLoader()
      loader.load( "../../assets/urdf/T12/urdf/T12.URDF", urdf => {
        setModel( urdf )
      })
    }
    else {
      console.log(model)
      console.log(model.links)
      console.log(model.joints)
    }
  }, [model])

  const getLinkJoints = ( link: URDFLink ) => {
    if ( link.children.length > 0 ) {
      return link.children as URDFJoint[]
    } else {
      return null
    }
  }

  const jointMeshTree = ( joint: URDFJoint ): { element: ReactElement } => {
    const link = joint.children[0] as URDFLink
    if ( link ) {
      const visual = link.children[0] as URDFVisual
      if ( visual ) {
        const mesh = visual.children[0] as THREE.Mesh
        if ( mesh ) {
          const meshProps: MeshProps = { key: link.name, geometry: mesh.geometry, position: joint.position, rotation: joint.rotation }
          const joints = getLinkJoints( link )
          const nested: ReactElement[] = []
          joints?.forEach(joint => {
            const { element } = jointMeshTree( joint )
            nested.push( element )
          })
          const element = <mesh key={link.name} {...meshProps}>{nested}</mesh>
          return { element }
        }
      }
    }
    const element = <mesh key={joint.name}/>
    return { element }
  }

  const getMeshTree = ( link: URDFRobot | undefined ) => {
    if ( link && meshTree == null ) {
      const mesh = link.children[0].children[0] as THREE.Mesh
      if ( mesh ) {
        const meshProps: MeshProps = { key: link.name, geometry: mesh.geometry }
        const joints = link.children.slice(1) as URDFJoint[]
        const meshes: ReactElement[] = []
        joints.forEach( joint => {
          const { element } = jointMeshTree( joint )
          meshes.push( element )
        })
        setMeshTree(
          <mesh key={link.name} {...meshProps}>
            {meshes}
          </mesh>
        )
      }
    }
  }

  useFrame(()=>(
    getMeshTree(model)
  ))

  return (
    <>
      {meshTree}
    </>
  )
}