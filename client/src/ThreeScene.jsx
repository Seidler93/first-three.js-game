import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box3 } from 'three';

const ThreeScene = () => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const playerRef = useRef(null);
  const bulletsRef = useRef([]);

  let wall1, wall2, wall3, wall4; // Declare wall variables

  useEffect(() => {
    // Initialize Three.js scene here
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    // Set up camera and renderer
    camera.position.set(0, 10, 0); // Adjust the y-coordinate to position the camera above the scene
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append renderer to the DOM
    const container = sceneRef.current;
    container.appendChild(renderer.domElement);

    // Create player object
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, 0, 0);
    scene.add(player);

    // Create random objects
    // for (let i = 0; i < 10; i++) {
    //   const objectGeometry = new THREE.BoxGeometry(1, 1, 1);
    //   const objectMaterial = new THREE.MeshBasicMaterial({ color: 0x333333  });
    //   const object = new THREE.Mesh(objectGeometry, objectMaterial);

    //   // Randomly position the objects within a certain range
    //   object.position.set(
    //     Math.random() * 20 - 10, // X coordinate between -10 and 10
    //     0,      // Y coordinate between 0 and 5 (height of objects)
    //     Math.random() * 20 - 10  // Z coordinate between -10 and 10
    //   );

    //   scene.add(object);
    // }

    // Create walls as rectangles
    const wallGeometry = new THREE.BoxGeometry(10, 1, 1); // Adjust the width for the length of the rectangle
    const wallGeometry2 = new THREE.BoxGeometry(1, 1, 10); // Adjust the width for the length of the rectangle
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 }); // Dark grey color

    wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, 0, -5); // Front wall
    scene.add(wall1);

    wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.set(0, 0, 5); // Back wall
    scene.add(wall2);

    wall3 = new THREE.Mesh(wallGeometry2, wallMaterial);
    wall3.position.set(5, 0, 0); // Right wall
    scene.add(wall3);

    wall4 = new THREE.Mesh(wallGeometry2, wallMaterial);
    wall4.position.set(-5, 0, 0); // Left wall
    scene.add(wall4);



    // Initialize references
    cameraRef.current = camera;
    rendererRef.current = renderer;
    playerRef.current = player;

    // Animation/render loop
    const animate = () => {
      // Update game logic here

      handlePlayerMovement();
      handleShooting(scene); // Pass the scene to the shooting function
      updateBullets();

      // Render scene
      renderer.render(scene, camera);

      // Call animate recursively
      requestAnimationFrame(animate);
    };

    // Start the animation loop
    animate();

    // Cleanup function
    return () => {
      // Remove player from the scene
      if (playerRef.current && sceneRef.current) {
        sceneRef.current.removeChild(rendererRef.current.domElement);
      }

      // Cleanup Three.js resources if needed
      rendererRef.current.dispose();
    };

  }, []); // Empty dependency array ensures this effect runs once on mount

  const handlePlayerMovement = () => {
    if (!playerRef.current || !cameraRef.current) return;
  
    const playerBoundingBox = new Box3().setFromObject(playerRef.current);
  
    // Check for collisions with walls
    const walls = [wall1, wall2, wall3, wall4];
    for (const wall of walls) {
      const wallBoundingBox = new Box3().setFromObject(wall);
  
      if (playerBoundingBox.intersectsBox(wallBoundingBox)) {
        handleCollision(); // Handle collision logic
        return;
      }
    }
  
    handleInput(); // Update player position based on input
  };
  
  const handleInput = () => {
    // Update player position based on input
    if (arrowRightKeyPressed) {
      playerRef.current.position.x += playerSpeed;
    }
    if (arrowLeftKeyPressed) {
      playerRef.current.position.x -= playerSpeed;
    }
    if (arrowUpKeyPressed) {
      playerRef.current.position.z -= playerSpeed;
    }
    if (arrowDownKeyPressed) {
      playerRef.current.position.z += playerSpeed;
    }
  
    // Update camera position to follow the player
    const playerPosition = playerRef.current.position.clone();
    cameraRef.current.position.set(playerPosition.x, playerPosition.y + 10, playerPosition.z + 5);

    // Look at the player
    cameraRef.current.lookAt(playerPosition);
  
    // Save the current position for the next collision check
    playerRef.current.previousPosition = playerRef.current.position.clone();
  };
  
  const handleCollision = () => {
    // Handle collision logic (e.g., prevent player movement)
    playerRef.current.position.set(
      playerRef.current.previousPosition.x,
      playerRef.current.previousPosition.y,
      playerRef.current.previousPosition.z
    );
  };
  
  // const handlePlayerMovement = () => {
  //   // Ensure playerRef.current is defined
  //   if (!playerRef.current || !cameraRef.current) return;
  
  //   const playerBoundingBox = new Box3().setFromObject(playerRef.current);

  //   // Check for collisions with walls
  //   const walls = [wall1, wall2, wall3, wall4];
  //   for (const wall of walls) {
  //     const wallBoundingBox = new Box3().setFromObject(wall);
  
  //     if (playerBoundingBox.intersectsBox(wallBoundingBox)) {
  //       // Handle collision logic (e.g., prevent player movement)
  //       playerRef.current.position.set(playerRef.current.previousPosition.x, playerRef.current.previousPosition.y, playerRef.current.previousPosition.z);
  //       return;
  //     }
  //   }

  //   // Save the previous position before updating player position
  //   const previousPosition = playerRef.current.position.clone();

  //   // Update player position based on input
  //   if (arrowRightKeyPressed) {
  //     playerRef.current.position.x += playerSpeed;
  //   }
  //   if (arrowLeftKeyPressed) {
  //     playerRef.current.position.x -= playerSpeed;
  //   }
  //   if (arrowUpKeyPressed) {
  //     playerRef.current.position.z -= playerSpeed;
  //   }
  //   if (arrowDownKeyPressed) {
  //     playerRef.current.position.z += playerSpeed;
  //   }
  
  //   // Update camera position to follow the player
  //   const playerPosition = playerRef.current.position.clone();
  //   cameraRef.current.position.set(playerPosition.x, playerPosition.y + 10, playerPosition.z + 5);

  //   // Save the current position for the next collision check
  //   playerRef.current.previousPosition = previousPosition;
  
  //   // Look at the player
  //   cameraRef.current.lookAt(playerPosition);
  // };
  

  const handleShooting = (scene) => {
    if (!playerRef.current || !bulletsRef.current) return;
  
    // Detect shooting input (e.g., space bar)
    if (spaceBarPressed && !spaceBarPrevState) {
      const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
      bullet.position.copy(playerRef.current.position);
  
      if (scene && scene.add) {
        scene.add(bullet);
        bulletsRef.current.push(bullet);
      }
    }
  
    spaceBarPrevState = spaceBarPressed;
  };
  

// Update bullets
const updateBullets = () => {
  if (!bulletsRef.current || !sceneRef.current) return;

  bulletsRef.current.forEach((bullet) => {
    bullet.position.z -= bulletSpeed;

    if (bullet.position.z < -10) {
      if (sceneRef.current && sceneRef.current.remove) {
        sceneRef.current.remove(bullet);
        bulletsRef.current = bulletsRef.current.filter((b) => b !== bullet);
      }
    }
  });
};



  // Handle User Input
  const handleKeyDown = (event) => {
    // Update corresponding variables based on keydown events
    switch (event.key) {
      case 'd':
        arrowRightKeyPressed = true;
        break;
      case 'a':
        arrowLeftKeyPressed = true;
        break;
      case 'w':
        arrowUpKeyPressed = true;
        break;
      case 's':
        arrowDownKeyPressed = true;
        break;
      case ' ':
        spaceBarPressed = true;
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    // Update corresponding variables based on keyup events
    switch (event.key) {
      case 'd':
        arrowRightKeyPressed = false;
        break;
      case 'a':
        arrowLeftKeyPressed = false;
        break;
      case 'w':
        arrowUpKeyPressed = false;
        break;
      case 's':
        arrowDownKeyPressed = false;
        break;
      case ' ':
        spaceBarPressed = false;
        break;
      default:
        break;
    }
  };

  // Attach event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Replace these variables with your own state management mechanism
  let arrowRightKeyPressed = false;
  let arrowLeftKeyPressed = false;
  let arrowUpKeyPressed = false;
  let arrowDownKeyPressed = false;
  let spaceBarPressed = false;
  let spaceBarPrevState = false; // Added variable
  const playerSpeed = 0.1;
  const bulletSpeed = 0.2;

  return <div ref={sceneRef} />;
};

export default ThreeScene;

