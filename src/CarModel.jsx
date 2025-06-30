import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useEffect, useRef, useState } from 'react'

export default function CarModel({ suspensionY = 0, useNewWheels = false, showSpoiler = true, bodyColor = '#548AE7', glassTint = '#bfc5c6' }) {
  const gltf = useGLTF('/bmw_m3.glb')

  const wrapperRef = useRef()
  const wheelSet1Ref = useRef()
  const wheelSet2Ref = useRef()
  const bodyGroupRef = useRef(new THREE.Group())
  const spoilerRef = useRef()
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    console.log('GLTF:', gltf)
    console.log('gltf.scene:', gltf.scene)
    console.log('gltf.scene.clone:', gltf.scene?.clone)
    if (!gltf?.scene || typeof gltf.scene.clone !== 'function' || typeof gltf.scene.traverse !== 'function') return

    const cloned = gltf.scene.clone(true)
    const wrapper = new THREE.Group()
    let spoilerObjects = [];
    let bodyGroup = null;
    let wheelSet1 = null;
    let wheelSet2 = null;
    // Log full hierarchy once
    console.log('🔍 SCENE HIERARCHY:')
    cloned.traverse((obj) => {
      console.log('-', obj.name)
      if (obj.name && obj.name.toLowerCase() === 'body') {
        bodyGroup = obj;
        bodyGroupRef.current = bodyGroup;
      }
      if (obj.name && obj.name.toLowerCase() === 'spoiler') {
        spoilerObjects.push(obj);
        console.log('Found Spoiler (anywhere):', obj.name, 'Initial visible:', obj.visible);
      }
      if (obj.name && obj.name.toLowerCase() === 'wheel_set_1') {
        wheelSet1 = obj;
        wheelSet1Ref.current = wheelSet1;
        console.log('Found Wheel_set_1:', obj.name);
      }
      if (obj.name && obj.name.toLowerCase() === 'wheel_set_2') {
        wheelSet2 = obj;
        wheelSet2Ref.current = wheelSet2;
        console.log('Found Wheel_set_2:', obj.name);
      }
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.material = obj.material.clone();
      }
    })
    spoilerRef.current = spoilerObjects;
    wrapper.add(cloned);
    wrapperRef.current = wrapper;
    setSceneReady(true)
  }, [gltf])

  // Handle toggle between wheel sets
  useEffect(() => {
    if (!sceneReady) return;
    // Toggle wheel sets
    if (wheelSet1Ref.current && wheelSet2Ref.current) {
      wheelSet1Ref.current.visible = !useNewWheels;
      wheelSet2Ref.current.visible = useNewWheels;
      console.log('Wheel_set_1 visible:', wheelSet1Ref.current.visible, '| Wheel_set_2 visible:', wheelSet2Ref.current.visible);
    }
  }, [useNewWheels, sceneReady]);

  // Handle spoiler visibility
  useEffect(() => {
    if (!sceneReady || !spoilerRef.current) return;
    // Toggle spoiler visibility
    spoilerRef.current.forEach((spoilerObj, idx) => {
      let parentNames = [];
      let parent = spoilerObj.parent;
      while (parent) {
        parentNames.push(parent.name || '(no name)');
        parent = parent.parent;
      }
      console.log(`Toggling Spoiler[${idx}] (${spoilerObj.name}) visibility to:`, !!showSpoiler, '| Current visible:', spoilerObj.visible, '| Parent chain:', parentNames.join(' -> '));
      spoilerObj.visible = !!showSpoiler;
      spoilerObj.traverse(child => {
        child.visible = !!showSpoiler;
      });
    });
  }, [showSpoiler, sceneReady]);

  // Update suspension height
  useEffect(() => {
    if (!sceneReady) return
    const clampedY = Math.max(-0.25, Math.min(0.25, suspensionY))
    if (bodyGroupRef.current) {
      bodyGroupRef.current.position.y = clampedY
      console.log('Body group y-position:', bodyGroupRef.current.position.y)
    }
  }, [suspensionY, sceneReady])

  useEffect(() => {
    if (!sceneReady) return;
    // Find and update the 'body-paint' material color
    let found = false;
    wrapperRef.current.traverse((obj) => {
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => {
            if (mat.name && mat.name.toLowerCase() === 'body-paint') {
              mat.color.set(bodyColor);
              found = true;
            }
          });
        } else if (obj.material.name && obj.material.name.toLowerCase() === 'body-paint') {
          obj.material.color.set(bodyColor);
          found = true;
        }
      }
    });
    if (!found) {
      console.warn('No material named "body-paint" found in model.');
    }
  }, [bodyColor, sceneReady]);

  useEffect(() => {
    if (!sceneReady) return;
    wrapperRef.current.traverse((obj) => {
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => {
            if (mat.name && mat.name.toLowerCase() === 'blinn2.001') {
              mat.transparent = true;
              mat.opacity = 0.1
              mat.metalness = 0.7;
              mat.roughness = 0.05;
              mat.color.set('#f5f5f5');
              mat.envMapIntensity = 1.5;
              mat.needsUpdate = true;
            }
          });
        } else if (obj.material.name && obj.material.name.toLowerCase() === 'blinn2.001') {
          obj.material.transparent = true;
          obj.material.opacity = 0.4;
          obj.material.metalness = 0.8;
          obj.material.roughness = 0.02;
          obj.material.color.set('#2D2D2D');
          obj.material.envMapIntensity = 3;
          obj.material.needsUpdate = true;
        }
      }
    });
  }, [sceneReady]);

  useEffect(() => {
    if (!sceneReady) return;
    // Find and update the 'Glass' material color
    let found = false;
    wrapperRef.current.traverse((obj) => {
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => {
            if (mat.name && mat.name.toLowerCase() === 'glass') {
              mat.color.set(glassTint);
              found = true;
              mat.needsUpdate = true;
            }
          });
        } else if (obj.material.name && obj.material.name.toLowerCase() === 'glass') {
          obj.material.color.set(glassTint);
          found = true;
          obj.material.needsUpdate = true;
        }
      }
    });
    if (!found) {
      console.warn('No material named "Glass" found in model.');
    }
  }, [glassTint, sceneReady]);

  if (!sceneReady || !wrapperRef.current) return null
  return <primitive object={wrapperRef.current} />
}
