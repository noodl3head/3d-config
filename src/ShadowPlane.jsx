import { useTexture } from '@react-three/drei';
import alphaMap from './assets/alpha-map-radial-blur.png';

function ShadowPlane() {
  // Load the alpha map texture
  const alphaMapTexture = useTexture(alphaMap);
  return (
    <>
      {/* Visible ground plane with edge blending */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial 
          color="#f2f2f2"
          alphaMap={alphaMapTexture}
          transparent={true}
          opacity={0.5}
        />
      </mesh>
      {/* Shadow-only plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[500, 500]} />
        <shadowMaterial opacity={0.5} transparent />
      </mesh>
    </>
  );
}

export default ShadowPlane; 