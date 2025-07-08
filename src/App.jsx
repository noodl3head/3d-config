import { Canvas, useLoader, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Html,
  useProgress,
  ContactShadows,
  Environment
} from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import './ConfiguratorMenu.css';

import CarModel from './CarModel.jsx'
import citrusHDR from './assets/citrus_orchard_puresky_1k.hdr?url'
import ShadowPlane from './ShadowPlane'
import React from 'react';
import ConfiguratorMenu from './ConfiguratorMenu';

// Helper to force white background every frame
function ForceWhiteBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color('#ffffff');
  });
  return null;
}

// Loader
function Loader() {
  const { progress } = useProgress()
  return <Html center>Loading... {progress.toFixed(0)}%</Html>
}

// EXR Environment
function EnvironmentHDR({ path }) {
  const { gl, scene } = useThree()
  const hdr = useLoader(RGBELoader, path)
  const pmrem = new THREE.PMREMGenerator(gl)
  const envMap = pmrem.fromEquirectangular(hdr).texture

  scene.environment = envMap
  scene.background = new THREE.Color('#ffffff')

  hdr.dispose()
  pmrem.dispose()

  return null
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

// Helper to set renderer exposure reliably
function SetExposure({ value }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = value;
  }, [gl, value]);
  return null;
}

// ✅ MAIN APP (Only One!)
export default function App() {
  const [suspensionY, setSuspensionY] = useState(0)
  const [useNewWheels, setUseNewWheels] = useState(false)
  const [showSpoiler, setShowSpoiler] = useState(true)
  const [bodyColor, setBodyColor] = useState('#00123A')
  const [glassTint, setGlassTint] = useState('#bfc5c6')
  const modelRef = useRef();
  const [isPortrait, setIsPortrait] = useState(false);
  const [trayOpen, setTrayOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const appContainerRef = useRef(null);

  // Desktop tray toggle logic
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 800;

  useEffect(() => {
    function checkOrientation() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setIsPortrait(true);
      } else {
        setIsPortrait(false);
      }
    }
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return (
    <div ref={appContainerRef} style={{ width: '100vw', height: '100vh', background: '#363B46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '95vw', height: '90vh', background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        {isPortrait && (
          <div id="rotate-warning">
            Please rotate your device to landscape mode for the best experience.
          </div>
        )}
        <ConfiguratorMenu 
          bodyColor={bodyColor} setBodyColor={setBodyColor}
          useNewWheels={useNewWheels} setUseNewWheels={setUseNewWheels}
          glassTint={glassTint} setGlassTint={setGlassTint}
          suspensionY={suspensionY} setSuspensionY={setSuspensionY}
          showSpoiler={showSpoiler} setShowSpoiler={setShowSpoiler}
          appContainerRef={appContainerRef}
        />
        <Canvas
          style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}
          shadows
          camera={{ position: [-27, 5, 5], fov: 35 }}
          gl={{ toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        >
          <SetExposure value={0.8} />
          <color attach="background" args={["#ffffff"]} />
          <Suspense fallback={<Loader />}>
            <CarModel
              key={`${bodyColor}-${glassTint}-${useNewWheels}-${showSpoiler}-${suspensionY}`}
              ref={modelRef}
              suspensionY={suspensionY}
              useNewWheels={useNewWheels}
              showSpoiler={showSpoiler}
              bodyColor={bodyColor}
              glassTint={glassTint}
            />
            <FitCameraToModel objectRef={modelRef} />
            <Environment files={citrusHDR} background={false} intensity={1.5} />
            <ForceWhiteBackground />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={100}
              shadow-camera-left={-30}
              shadow-camera-right={30}
              shadow-camera-top={30}
              shadow-camera-bottom={-30}
              color="#fff"
            />
            <directionalLight
              position={[-15, 10, -10]}
              intensity={0.4}
              color="#e0e6ff"
            />
            <directionalLight
              position={[0, 15, -25]}
              intensity={0.6}
              color="#b0c4ff"
            />
            <ambientLight intensity={0.2} color="#fff" />
            <ShadowPlane />
          </Suspense>
          <OrbitControls
            target={[0, 4, 0]}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            enableZoom={false}
            enablePan={false}
          />
        </Canvas>
      </div>
    </div>
  )
}
