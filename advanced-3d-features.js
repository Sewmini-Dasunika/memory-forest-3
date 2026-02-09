/**
 * Advanced 3D Tree Features for Memory Forest
 * Using Three.js for professional 3D visualization
 * Includes procedural tree generation, animations, and interactions
 */

import * as THREE from 'three';

export class AdvancedMemoryTree {
  constructor(container, canvasWidth, canvasHeight) {
    this.container = container;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvasWidth / canvasHeight,
      0.1,
      10000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.renderer.setSize(canvasWidth, canvasHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.setClearColor(0x0a0e27, 0.8);
    
    this.container.appendChild(this.renderer.domElement);
    
    // Camera position
    this.camera.position.set(0, 8, 15);
    this.camera.lookAt(0, 5, 0);
    
    // Lighting
    this.setupLighting();
    
    // Scene fog
    this.scene.fog = new THREE.Fog(0x0a0e27, 100, 150);
    
    // Tree objects
    this.tree = null;
    this.leaves = [];
    this.particles = null;
    this.selectedLeaf = null;
    
    // Animation state
    this.animationTime = 0;
    this.isGrowing = false;
    
    // Initialize
    this.init();
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(15, 25, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 200;
    this.scene.add(directionalLight);
    
    // Point lights (accent lighting)
    const pointLight1 = new THREE.PointLight(0x7CFC00, 0.5);
    pointLight1.position.set(10, 15, 10);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xFF1493, 0.3);
    pointLight2.position.set(-10, 15, -10);
    this.scene.add(pointLight2);
  }

  init() {
    // Create ground
    this.createGround();
    
    // Create advanced tree
    this.createAdvancedTree();
    
    // Start animation loop
    this.animate();
  }

  createGround() {
    const groundGeometry = new THREE.CircleGeometry(60, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2d1a,
      roughness: 0.9,
      metalness: 0,
      map: this.createGrassTexture()
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -0.01;
    
    this.scene.add(ground);
  }

  createAdvancedTree() {
    this.tree = new THREE.Group();
    
    // Create trunk with procedural geometry
    this.createProceduralTrunk();
    
    // Create branching system
    this.createBranchingSystem();
    
    // Create particles
    this.createParticleSystem();
    
    // Add bloom/glow effects
    this.addBloomEffects();
    
    this.scene.add(this.tree);
  }

  createProceduralTrunk() {
    const segments = 20;
    const height = 12;
    
    for (let i = 0; i < segments; i++) {
      const progress = i / segments;
      const radius = 0.8 * (1 - progress * 0.6);
      const y = (i / segments) * height;
      
      // Create trunk segment
      const geometry = new THREE.CylinderGeometry(radius, radius * 0.95, height / segments, 16);
      const material = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1,
        map: this.createBarkTexture()
      });
      
      const segment = new THREE.Mesh(geometry, material);
      segment.position.y = y;
      segment.castShadow = true;
      segment.receiveShadow = true;
      
      this.tree.add(segment);
      
      // Add growth rings
      if (i % 3 === 0) {
        const ringGeometry = new THREE.TorusGeometry(radius + 0.05, 0.08, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
          color: 0x8B4513,
          metalness: 0.3
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.y = y;
        ring.rotation.x = Math.PI / 2;
        ring.scale.set(0.8, 0.8, 1);
        
        this.tree.add(ring);
      }
    }
  }

  createBranchingSystem() {
    const branchLevels = 4;
    const baseHeight = 8;
    
    this.createBranchLevel(this.tree, baseHeight, 6, 0.4, branchLevels);
  }

  createBranchLevel(parent, startHeight, branchCount, branchRadius, depth) {
    if (depth === 0) return;
    
    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2;
      const length = 3 + Math.random() * 2;
      
      // Create branch geometry
      const geometry = new THREE.CylinderGeometry(
        branchRadius * 0.6,
        branchRadius,
        length,
        12
      );
      
      const color = this.getRandomBranchColor();
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.6,
        metalness: 0.2
      });
      
      const branch = new THREE.Mesh(geometry, material);
      branch.position.y = startHeight + length / 2;
      branch.position.x = Math.cos(angle) * 2;
      branch.position.z = Math.sin(angle) * 2;
      
      branch.rotation.z = Math.PI / 4;
      branch.castShadow = true;
      branch.receiveShadow = true;
      
      parent.add(branch);
      
      // Add leaves to branch
      this.createLeafCluster(parent, branch.position, color, branchRadius);
      
      // Recursive branching
      if (depth > 1) {
        const newParent = new THREE.Group();
        newParent.position.copy(branch.position);
        parent.add(newParent);
        
        this.createBranchLevel(
          newParent,
          0,
          Math.max(2, branchCount - 1),
          branchRadius * 0.6,
          depth - 1
        );
      }
    }
  }

  createLeafCluster(parent, position, color, branchRadius) {
    const leafCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < leafCount; i++) {
      const leafGeometry = new THREE.IcosahedronGeometry(0.2, 3);
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.3,
        emissive: color,
        emissiveIntensity: 0.2
      });
      
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.copy(position);
      leaf.position.x += (Math.random() - 0.5) * 0.8;
      leaf.position.y += (Math.random() - 0.5) * 0.8;
      leaf.position.z += (Math.random() - 0.5) * 0.8;
      
      leaf.rotation.x = Math.random() * Math.PI;
      leaf.rotation.y = Math.random() * Math.PI;
      leaf.rotation.z = Math.random() * Math.PI;
      
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      
      parent.add(leaf);
      this.leaves.push(leaf);
    }
  }

  createParticleSystem() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < particleCount; i++) {
      vertices.push(
        (Math.random() - 0.5) * 30,
        Math.random() * 20,
        (Math.random() - 0.5) * 30
      );
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.3,
      color: 0x7CFC00,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.particles.castShadow = true;
    this.tree.add(this.particles);
  }

  addBloomEffects() {
    // This is where post-processing bloom would be added
    // For now, we use emissive materials on leaves for glow
    this.leaves.forEach(leaf => {
      if (leaf.material.emissive) {
        leaf.material.emissiveIntensity = 0.3;
      }
    });
  }

  createBarkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add bark detail
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.4})`;
      ctx.fillRect(
        Math.random() * 512,
        Math.random() * 512,
        Math.random() * 30 + 5,
        Math.random() * 60 + 10
      );
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    return texture;
  }

  createGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#1a2d1a';
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(45, 85, 45, ${Math.random() * 0.3})`;
      ctx.fillRect(
        Math.random() * 512,
        Math.random() * 512,
        Math.random() * 10 + 2,
        Math.random() * 20 + 5
      );
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.repeat.set(4, 4);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  getRandomBranchColor() {
    const colors = [0xFFD700, 0x32CD32, 0xFF1493, 0x00CED1, 0x7CFC00, 0xADFF2F];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.animationTime += 0.01;
    
    // Animate particles
    if (this.particles) {
      this.particles.rotation.x += 0.0001;
      this.particles.rotation.y += 0.0002;
    }
    
    // Animate leaves
    this.leaves.forEach((leaf, idx) => {
      const time = this.animationTime + idx * 0.1;
      leaf.position.y += Math.sin(time) * 0.005;
      leaf.rotation.x += 0.001;
      leaf.rotation.y += 0.002;
    });
    
    // Animate bloom
    this.animateBloom();
    
    // Tree sway
    if (this.tree) {
      this.tree.rotation.z = Math.sin(this.animationTime * 0.5) * 0.02;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  animateBloom() {
    const time = this.animationTime;
    
    this.leaves.forEach((leaf) => {
      if (leaf.material && leaf.material.emissive) {
        leaf.material.emissiveIntensity = 0.2 + Math.sin(time) * 0.15;
      }
    });
  }

  growTree() {
    this.isGrowing = true;
    this.tree.scale.y = 0;
    const startTime = Date.now();
    const duration = 2000;
    
    const growAnim = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.tree.scale.y = progress;
      
      if (progress < 1) {
        requestAnimationFrame(growAnim);
      } else {
        this.isGrowing = false;
      }
    };
    
    growAnim();
  }

  addMemory(memory) {
    const leafGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const colors = {
      happy: 0xFFD700,
      sad: 0x4169E1,
      normal: 0x7CFC00,
      special: 0xFF1493,
      recovered: 0x00CED1
    };
    
    const color = colors[memory.type] || 0x7CFC00;
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.3,
      emissive: color,
      emissiveIntensity: 0.4
    });
    
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.set(
      (Math.random() - 0.5) * 10,
      Math.random() * 8 + 4,
      (Math.random() - 0.5) * 10
    );
    leaf.castShadow = true;
    leaf.userData = memory;
    
    this.tree.add(leaf);
    this.leaves.push(leaf);
  }

  selectLeaf(leaf) {
    this.selectedLeaf = leaf;
    if (leaf.material) {
      leaf.material.emissiveIntensity = 0.8;
      leaf.scale.set(1.2, 1.2, 1.2);
    }
  }

  deselectLeaf() {
    if (this.selectedLeaf && this.selectedLeaf.material) {
      this.selectedLeaf.material.emissiveIntensity = 0.2;
      this.selectedLeaf.scale.set(1, 1, 1);
      this.selectedLeaf = null;
    }
  }

  resetView() {
    this.camera.position.set(0, 8, 15);
    this.camera.lookAt(0, 5, 0);
  }

  resizeCanvas(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    this.renderer.dispose();
    this.leaves.forEach(leaf => {
      if (leaf.geometry) leaf.geometry.dispose();
      if (leaf.material) leaf.material.dispose();
    });
    this.container.removeChild(this.renderer.domElement);
  }
}

export default AdvancedMemoryTree;