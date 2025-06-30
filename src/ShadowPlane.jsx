function ShadowPlane() {
  return (
    <>
      {/* Visible ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#f2f2f2" opacity={0}/>
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