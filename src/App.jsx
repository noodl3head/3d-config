import { Canvas, useLoader, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Html,
  useProgress,
  ContactShadows,
} from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'

import SuspensionControl from './SuspensionControl.jsx'
import CarModel from './CarModel.jsx'
import studioHDRI from './assets/citrus_orchard_puresky_1k.exr?url'
import ConfiguratorUI from './ConfiguratorUI'

// Loader
function Loader() {
  const { progress } = useProgress()
  return <Html center>Loading... {progress.toFixed(0)}%</Html>
}

// EXR Environment
function EnvironmentEXR({ path }) {
  const { gl, scene } = useThree()
  const exr = useLoader(EXRLoader, path)
  const pmrem = new THREE.PMREMGenerator(gl)
  const envMap = pmrem.fromEquirectangular(exr).texture

  scene.environment = envMap
  scene.background = new THREE.Color('#f2f2f2')

  exr.dispose()
  pmrem.dispose()

  return null
}

// Ground Shadow
function ShadowPlane() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <shadowMaterial opacity={0.35} transparent />
    </mesh>
  )
}

function FitCameraToModel({ objectRef, margin = 1.2 }) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!objectRef.current) return;
    const box = new THREE.Box3().setFromObject(objectRef.current);
    const sizeBox = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(sizeBox.x, sizeBox.y, sizeBox.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * margin;
    camera.position.set(center.x, center.y, cameraZ + center.z);
    camera.lookAt(center);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }, [objectRef, camera, size, margin]);
  return null;
}

// ✅ MAIN APP (Only One!)
export default function App() {
  const [suspensionY, setSuspensionY] = useState(0)
  const [useNewWheels, setUseNewWheels] = useState(false)
  const modelRef = useRef();

  return (
    <>
      {/* UI Controls */}
      <ConfiguratorUI
        useNewWheels={useNewWheels}
        setUseNewWheels={setUseNewWheels}
        suspensionY={suspensionY}
        setSuspensionY={setSuspensionY}
      />

      {/* 3D Canvas */}
      <Canvas
        style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}
        shadows
        camera={{ position: [-27, 5, 5], fov: 35 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={<Loader />}>
          <CarModel ref={modelRef} suspensionY={suspensionY} useNewWheels={useNewWheels} />
          <FitCameraToModel objectRef={modelRef} />
          <EnvironmentEXR path={studioHDRI} />
          <ambientLight intensity={0.6} />
          <directionalLight
            castShadow
            position={[5, 10, 5]}
            intensity={0.2}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <ShadowPlane />
        </Suspense>

        <OrbitControls
          target={[0, 4, 0]}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </>
  )
}
