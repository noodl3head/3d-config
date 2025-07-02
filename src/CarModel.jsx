import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'

export default function CarModel({ suspensionY = 0, useNewWheels = false, showSpoiler = true, bodyColor = '#548AE7', glassTint = '#bfc5c6' }) {
  const gltf = useGLTF('/bmw_m3.glb')

  const wrapperRef = useRef()
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    if (!gltf?.scene || typeof gltf.scene.clone !== 'function' || typeof gltf.scene.traverse !== 'function') return

    const cloned = gltf.scene.clone(true)
    const wrapper = new THREE.Group()
    let spoilerObjects = [];
    let bodyGroup = null;
    let glassGroup = null;
    let wheelSet1 = null;
    let wheelSet2 = null;

    cloned.traverse((obj) => {
      if (obj.name && obj.name.toLowerCase() === 'body') {
        bodyGroup = obj;
      }
      if (obj.name && obj.name.toLowerCase() === 'glass') {
        glassGroup = obj;
      }
      if (obj.name && obj.name.toLowerCase() === 'spoiler') {
        spoilerObjects.push(obj);
      }
      if (obj.name && obj.name.toLowerCase() === 'wheel_set_1') {
        wheelSet1 = obj;
      }
      if (obj.name && obj.name.toLowerCase() === 'wheel_set_2') {
        wheelSet2 = obj;
      }
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material = obj.material.map(mat => {
              if (mat.name && mat.name.toLowerCase() === 'body-paint') {
                return new THREE.MeshPhysicalMaterial({
                  color: bodyColor,
                  metalness: 1.0,
                  roughness: 0.2,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.05,
                  reflectivity: 1.0,
                  sheen: 1.0,
                  envMapIntensity: 1.5,
                  name: 'body-paint',
                });
              } else if (mat.name && mat.name.toLowerCase() === 'glass') {
                return new THREE.MeshPhysicalMaterial({
                  color: glassTint,
                  metalness: 0.0,
                  roughness: 0.01,
                  transmission: 1.0,
                  thickness: 0.1,
                  ior: 1.5,
                  transparent: true,
                  opacity: 1.0,
                  envMapIntensity: 1.0,
                  name: 'glass',
                });
              } else if (mat.name && mat.name.toLowerCase() === 'emission-white') {
                return new THREE.MeshPhysicalMaterial({
                  color: '#ffffff',
                  emissive: '#ffffff',
                  emissiveIntensity: 20,
                  metalness: 0.1,
                  roughness: 0.15,
                  transmission: 0.5,
                  transparent: false,
                  opacity: 1.0,
                  envMapIntensity: 1.5,
                  name: 'emission-white',
                });
              } else if (mat.name && mat.name.toLowerCase() === 'blinn2.001') {
                return new THREE.MeshPhysicalMaterial({
                  color: '#ffffff',
                  metalness: 0.0,
                  roughness: 0.05,
                  transmission: 1.0,
                  thickness: 0.2,
                  ior: 1.5,
                  transparent: true,
                  opacity: 0.15,
                  envMapIntensity: 1.5,
                  name: 'blinn2.001',
                });
              } else {
                return mat.clone();
              }
            });
          } else if (obj.material.name && obj.material.name.toLowerCase() === 'body-paint') {
            obj.material = new THREE.MeshPhysicalMaterial({
              color: bodyColor,
              metalness: 1.0,
              roughness: 0.2,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
              reflectivity: 1.0,
              sheen: 1.0,
              envMapIntensity: 1.5,
              name: 'body-paint',
            });
          } else if (obj.material.name && obj.material.name.toLowerCase() === 'glass') {
            obj.material = new THREE.MeshPhysicalMaterial({
              color: glassTint,
              metalness: 0.0,
              roughness: 0.01,
              transmission: 1.0,
              thickness: 0.1,
              ior: 1.5,
              transparent: true,
              opacity: 1.0,
              envMapIntensity: 1.0,
              name: 'glass',
            });
          } else if (obj.material.name && obj.material.name.toLowerCase() === 'emission-white') {
            obj.material = new THREE.MeshPhysicalMaterial({
              color: 0xffffff,
              emissive: '#aeefff',
              emissiveIntensity: 50.0,
              metalness: 0.1,
              roughness: 0.15,
              transmission: 0.5,
              transparent: false,
              opacity: 1.0,
              envMapIntensity: 1.5,
              name: 'emission-white',
            });
          } else if (obj.material.name && obj.material.name.toLowerCase() === 'blinn2.001') {
            obj.material = new THREE.MeshPhysicalMaterial({
              color: '#ffffff',
              metalness: 0.0,
              roughness: 0.05,
              transmission: 1.0,
              thickness: 0.2,
              ior: 1.5,
              transparent: true,
              opacity: 0.15,
              envMapIntensity: 1.5,
              name: 'blinn2.001',
            });
          } else {
            obj.material = obj.material.clone();
          }
        }
      }
    });

    // Apply ride height
    if (bodyGroup) bodyGroup.position.y = Math.max(-0.25, Math.min(0.25, suspensionY));

    // Handle wheel sets
    if (wheelSet1 && wheelSet2) {
      wheelSet1.visible = !useNewWheels;
      wheelSet2.visible = useNewWheels;
    }

    // Handle spoiler visibility
    spoilerObjects.forEach((spoilerObj) => {
      spoilerObj.visible = !!showSpoiler;
      spoilerObj.traverse(child => {
        child.visible = !!showSpoiler;
      });
    });

    wrapper.add(cloned);
    wrapperRef.current = wrapper;
    setSceneReady(true);
  }, [gltf, bodyColor, glassTint, useNewWheels, showSpoiler, suspensionY]);

  if (!sceneReady || !wrapperRef.current) return null;
  return <primitive object={wrapperRef.current} />;
}
