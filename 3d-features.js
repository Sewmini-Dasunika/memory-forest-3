// Advanced 3D Features for Memory Forest
// Requires Three.js library

class AdvancedMemoryTree {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.tree = null;
        this.particles = [];
        this.bloomPass = null;
        this.memories = [];
        this.selectedLeaf = null;
    }

    // Create enhanced tree with geometry variations
    createAdvancedTree() {
        const treeGroup = new THREE.Group();

        // Main trunk with procedural generation
        this.createProceduralTrunk(treeGroup);

        // Branching system
        this.createBranchingSystem(treeGroup);

        // Particle effects
        this.createParticleEffects(treeGroup);

        // Bloom/glow effects
        this.addBloomEffects(treeGroup);

        this.tree = treeGroup;
        this.scene.add(treeGroup);

        return treeGroup;
    }

    // Procedural trunk generation
    createProceduralTrunk(parent) {
        const segments = 20;
        const height = 12;

        for (let i = 0; i < segments; i++) {
            const progress = i / segments;
            const radius = 0.8 * (1 - progress * 0.6);
            const y = (i / segments) * height;

            // Create trunk segment
            const geometry = new THREE.CylinderGeometry(radius, radius * 0.95, height / segments, 8);
            const material = new THREE.MeshStandardMaterial({
                color: 0x654321,
                roughness: 0.8,
                metalness: 0.1,
                map: this.createBarkTexture()
            });

            const segment = new THREE.Mesh(geometry, material);
            segment.position.y = y;
            segment.castShadow = true;
            segment.receiveShadow = true;
            parent.add(segment);

            // Add growth rings
            if (i % 3 === 0) {
                const ringGeometry = new THREE.TorusGeometry(radius + 0.05, 0.08, 8, 32);
                const ringMaterial = new THREE.MeshStandardMaterial({
                    color: 0x8B4513,
                    metalness: 0.3
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.y = y;
                ring.rotation.x = Math.PI / 2;
                parent.add(ring);
            }
        }
    }

    // Create dynamic branching system
    createBranchingSystem(parent) {
        const branchLevels = 4;
        
        this.createBranchLevel(parent, 8, 3, 1, branchLevels);
    }

    createBranchLevel(parent, startHeight, branchCount, branchRadius, depth) {
        if (depth === 0) return;

        for (let i = 0; i < branchCount; i++) {
            const angle = (i / branchCount) * Math.PI * 2;
            const length = 3 + Math.random() * 2;

            // Branch geometry
            const curvePoints = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(
                    Math.cos(angle) * length * 0.5,
                    length * 0.3,
                    Math.sin(angle) * length * 0.5
                ),
                new THREE.Vector3(
                    Math.cos(angle) * length,
                    length,
                    Math.sin(angle) * length
                )
            ];

            const curve = new THREE.CatmullRomCurve3(curvePoints);
            const points = curve.getPoints(10);

            // Create tapered cylinder for branch
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const indices = [];

            for (let j = 0; j < points.length; j++) {
                const progress = j / points.length;
                const radius = branchRadius * (1 - progress * 0.7);
                const circle = 16;

                for (let k = 0; k < circle; k++) {
                    const angle = (k / circle) * Math.PI * 2;
                    vertices.push(
                        points[j].x + Math.cos(angle) * radius,
                        points[j].y,
                        points[j].z + Math.sin(angle) * radius
                    );
                }
            }

            // Create material
            const color = this.getRandomBranchColor();
            const material = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.6,
                metalness: 0.2
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = startHeight;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            parent.add(mesh);

            // Add leaves to branch end
            this.createLeafCluster(parent, points[points.length - 1], color, startHeight);

            // Recursive branching
            if (depth > 1) {
                const newParent = new THREE.Group();
                newParent.position.copy(points[points.length - 1]);
                newParent.position.y += startHeight;
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

    // Create leaf clusters
    createLeafCluster(parent, position, color, baseHeight) {
        const leafCount = 3 + Math.random() * 3;

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
            leaf.position.y += baseHeight;
            leaf.position.x += (Math.random() - 0.5) * 0.5;
            leaf.position.z += (Math.random() - 0.5) * 0.5;

            leaf.rotation.x = Math.random() * Math.PI;
            leaf.rotation.y = Math.random() * Math.PI;
            leaf.rotation.z = Math.random() * Math.PI;

            leaf.castShadow = true;
            leaf.receiveShadow = true;

            parent.add(leaf);
        }
    }

    // Create particle effects
    createParticleEffects(parent) {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        for (let i = 0; i < particleCount; i++) {
            vertices.push(
                (Math.random() - 0.5) * 20,
                Math.random() * 15,
                (Math.random() - 0.5) * 20
            );
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

        const material = new THREE.PointsMaterial({
            size: 0.3,
            color: 0x7CFC00,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(geometry, material);
        particles.castShadow = true;
        parent.add(particles);

        this.particles = particles;
    }

    // Add bloom/glow effects
    addBloomEffects(parent) {
        // This requires post-processing setup in main scene
        const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x7CFC00,
            transparent: true,
            opacity: 0.1
        });

        parent.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                glow.position.copy(child.position);
                glow.scale.set(1.5, 1.5, 1.5);
                parent.add(glow);
            }
        });
    }

    // Create bark texture
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

    // Get random branch color based on memory type
    getRandomBranchColor() {
        const colors = [0xFFD700, 0x32CD32, 0xFF1493, 0x00CED1, 0x7CFC00];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Animate particles
    animateParticles() {
        if (this.particles) {
            this.particles.rotation.x += 0.0001;
            this.particles.rotation.y += 0.0002;
        }
    }

    // Add interaction (select leaf)
    selectLeaf(leaf, memory) {
        this.selectedLeaf = leaf;
        leaf.material.emissiveIntensity = 0.8;
        console.log("🍃 Leaf selected:", memory.title);
    }

    // Deselect leaf
    deselectLeaf() {
        if (this.selectedLeaf) {
            this.selectedLeaf.material.emissiveIntensity = 0.2;
            this.selectedLeaf = null;
        }
    }

    // Grow tree animation
    growTree() {
        this.tree.scale.y = 0;
        const startTime = Date.now();
        const duration = 2000;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.tree.scale.y = progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Bloom effect animation
    animateBloom() {
        const time = Date.now() * 0.001;

        this.tree.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material.emissive) {
                child.material.emissiveIntensity = 0.2 + Math.sin(time) * 0.1;
            }
        });
    }
}

// Export for use
export default AdvancedMemoryTree;