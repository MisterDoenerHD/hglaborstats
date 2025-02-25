
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MinecraftModelProps {
  playerName: string;
}

const MinecraftModel: React.FC<MinecraftModelProps> = ({ playerName }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(200, 200);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create player head
    const textureLoader = new THREE.TextureLoader();
    const headGeometry = new THREE.BoxGeometry(1, 1, 1);
    const headMaterials = [
      new THREE.MeshStandardMaterial({ map: textureLoader.load(`https://minecraft-api.vercel.app/api/skins/${playerName}/head/right`) }),
      new THREE.MeshStandardMaterial({ map: textureLoader.load(`https://minecraft-api.vercel.app/api/skins/${playerName}/head/left`) }),
      new THREE.MeshStandardMaterial({ map: textureLoader.load(`https://minecraft-api.vercel.app/api/skins/${playerName}/head/top`) }),
      new THREE.MeshStandardMaterial({ map: textureLoader.load(`https://minecraft-api.vercel.app/api/skins/${playerName}/head/bottom`) }),
      new THREE.MeshStandardMaterial({ map: textureLoader.load(`https://minecraft-api.vercel.app/api/skins/${playerName}/head/front`) }),
      new THREE.MeshStandardMaterial({ map: textureLoader.load(`https://minecraft-api.vercel.app/api/skins/${playerName}/head/back`) })
    ];
    
    const head = new THREE.Mesh(headGeometry, headMaterials);
    scene.add(head);

    // Position camera
    camera.position.z = 2;

    // Animation
    let rotation = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      rotation += 0.01;
      head.rotation.y = rotation;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [playerName]);

  return (
    <div 
      ref={containerRef} 
      className="w-[200px] h-[200px] mx-auto mb-6 animate-slide-in"
    />
  );
};

export default MinecraftModel;
