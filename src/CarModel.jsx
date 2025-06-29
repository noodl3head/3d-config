import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useEffect, useRef, useState } from 'react'

export default function CarModel({ suspensionY = 0, useNewWheels = false }) {
  const gltf = useGLTF('/bmw_m3.glb')

  const wrapperRef = useRef()
  const wheelSet1Ref = useRef(new THREE.Group())
  const wheelSet2Ref = useRef(new THREE.Group())
  const bodyGroupRef = useRef(new THREE.Group())
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    console.log('GLTF:', gltf)
    console.log('gltf.scene:', gltf.scene)
    console.log('gltf.scene.clone:', gltf.scene?.clone)
    if (!gltf?.scene || typeof gltf.scene.clone !== 'function' || typeof gltf.scene.traverse !== 'function') return

    const cloned = gltf.scene.clone(true)
    const wrapper = new THREE.Group()
    const bodyGroup = new THREE.Group()

    // Log full hierarchy once
    console.log('🔍 SCENE HIERARCHY:')
    cloned.traverse((obj) => {
      console.log('-', obj.name)
    })

    // 1. Collect wheel meshes
    const wheelMeshes = []
    cloned.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = obj.receiveShadow = true;
        obj.material = obj.material.clone();

        const name = obj.name?.toLowerCase?.() || ''
        if (name.includes('wheel')) {
          console.log('Adding to wheel group:', obj.name)
          const meshClone = obj.clone()
          meshClone.material = obj.material
          if (name.includes('_2')) {
            wheelSet2Ref.current.add(meshClone)
          } else {
            wheelSet1Ref.current.add(meshClone)
          }
        } else if (name.includes('body') || name.includes('glass')) {
          console.log('Adding to body group:', obj.name)
          bodyGroup.add(obj.clone())
        } else {
          console.log('Adding to wrapper:', obj.name)
          wrapper.add(obj.clone())
        }
      }
    })

    // Save references
    wrapperRef.current = wrapper
    bodyGroupRef.current = bodyGroup

    // Set initial visibility BEFORE adding to wrapper
    wheelSet1Ref.current.visible = !useNewWheels;
    wheelSet2Ref.current.visible = useNewWheels;

    // Build hierarchy
    wrapper.add(bodyGroup);
    wrapper.add(wheelSet1Ref.current);
    wrapper.add(wheelSet2Ref.current);

    setSceneReady(true)
  }, [gltf])

  // Handle toggle between wheel sets
  useEffect(() => {
    if (!sceneReady) return;
    if (wheelSet1Ref.current && wheelSet2Ref.current) {
      wheelSet1Ref.current.visible = !useNewWheels;
      wheelSet2Ref.current.visible = useNewWheels;
      // Debug: log visible meshes
      const allMeshes = [];
      wheelSet1Ref.current.traverse(obj => { if (obj.isMesh && obj.visible) allMeshes.push(obj.name); });
      wheelSet2Ref.current.traverse(obj => { if (obj.isMesh && obj.visible) allMeshes.push(obj.name); });
      console.log('Visible wheel meshes after toggle:', allMeshes);
    }
  }, [useNewWheels, sceneReady]);

  // Update suspension height
  useEffect(() => {
    if (!sceneReady) return
    const clampedY = Math.max(-0.25, Math.min(0.25, suspensionY))
    bodyGroupRef.current.position.y = clampedY
  }, [suspensionY, sceneReady])

  if (!sceneReady || !wrapperRef.current) return null
  return <primitive object={wrapperRef.current} />
}
