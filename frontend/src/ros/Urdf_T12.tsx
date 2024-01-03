/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react"
import { Euler, Vector3, useFrame } from "@react-three/fiber"
import URDFLoader, { URDFJoint, URDFRobot } from "urdf-loader"

export const Urdf_T12 = () => {
  const [ model, setModel ] = useState<URDFRobot>()
  const [ body, setBody ] = useState<THREE.BufferGeometry>()
  interface jointType { geometry: THREE.BufferGeometry, position: Vector3, rotation: Euler }
  const [ hip1, setHip1 ] = useState<jointType>()

  useEffect(()=>{
    if ( model == null ) {
      const loader = new URDFLoader()
      loader.load( "../../assets/urdf/T12/urdf/T12.URDF", urdf => {
        setModel( urdf )
      })
    }
  }, [model])

  const getGeometry = () => {
    if ( model != null && body == null ) {
      const bodyMesh = model.children[0].children[0] as THREE.Mesh
      if ( bodyMesh ) {
        setBody( bodyMesh.geometry )
      }
      const hip1Mesh = model.children[1].children[0].children[0].children[0] as THREE.Mesh
      const hip1Joint = model.children[1].children[0].children[1] as URDFJoint
      if ( hip1Mesh ) {
        setHip1( { geometry: hip1Mesh.geometry, position: hip1Joint.position, rotation: hip1Joint.rotation } )
      }
    }
  }

  useFrame(()=>(
    getGeometry()
  ))

  return (
    <>
      { body != null &&
        <mesh geometry={ body }>
          { hip1 != null &&
          <mesh geometry={ hip1.geometry }
                position={ hip1.position }
                rotation={ hip1.rotation }>
          </mesh>
          }
        </mesh>
      }
    </>
  )
}