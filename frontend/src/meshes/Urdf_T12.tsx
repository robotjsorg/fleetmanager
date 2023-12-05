/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react"
import URDFLoader, { URDFRobot, URDFVisual } from "urdf-loader"

export const Urdf_T12 = () => {
  const [ myModel, setMyModel ] = useState<URDFRobot>()
  const [ myGeometry, setMyGeometry ] = useState<THREE.BufferGeometry>()
  const [ logged, setLogged ] = useState(false)
  useEffect(()=>{
    const loader = new URDFLoader()
    if ( myModel == null ) {
      loader.load( "../../assets/urdf/T12/urdf/T12.URDF", result => {
        setMyModel( result )
        console.log( result.children[0] as URDFVisual )
        const myVisual = result.children[0] as URDFVisual
        const myMeshArray = myVisual.children as THREE.Mesh[] // undefined
        console.log(myMeshArray)
        const myMesh = myMeshArray[0]
        console.log(myMesh)
        // setMyGeometry( myMesh[0].geometry )
      })
    }
    if ( !logged && myModel != null ) {
      console.log( myModel )
      console.log( myGeometry )
      setLogged( true )
    }
  }, [logged, myGeometry, myModel])
  
  return (
    <>
      {myModel != null && 
        <mesh geometry={myGeometry}></mesh>
      }
    </>
  )
}