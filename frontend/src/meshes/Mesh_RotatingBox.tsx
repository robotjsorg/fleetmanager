import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated, config } from '@react-spring/three';

export const Mesh_RotatingBox = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const [active, setActive] = useState(false);

  const { scale } = useSpring({
    scale: active ? 1.5 : 1,
    config: config.wobbly
  });

  useFrame((_state, delta) => {
    ref.current.rotation.x += delta
  });

  return (
    <animated.mesh
      scale={scale}
      onClick={() => {return setActive(!active);}}
      ref={ref}
    >
      <boxGeometry />
      <meshPhongMaterial color="royalblue" />
    </animated.mesh>
  );
};