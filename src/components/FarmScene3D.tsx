import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

export type TimeOfDay = 'dawn' | 'noon' | 'golden' | 'twilight';
export type CameraPreset = 'hero' | 'farmer' | 'barn' | 'tractor' | 'orbit';

interface FarmScene3DProps {
  timeOfDay: TimeOfDay;
  cameraPreset: CameraPreset;
  windSpeed: number; // 0 to 2 (1 = normal)
  irrigationActive: boolean;
  onSelectFeature?: (feature: { name: string; category: string; description: string; stat?: string }) => void;
  isUiHidden?: boolean;
}

export const FarmScene3D: React.FC<FarmScene3DProps> = ({
  timeOfDay,
  cameraPreset,
  windSpeed,
  irrigationActive,
  onSelectFeature,
  isUiHidden = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  // References for dynamic updates inside animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const barnWindowLightRef = useRef<THREE.PointLight | null>(null);

  // Dynamic animation elements
  const cropSwayGroups = useRef<THREE.Group[]>([]);
  const farmerRef = useRef<{
    root: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    can: THREE.Group;
    isWatering: boolean;
    targetX: number;
    dir: number;
  } | null>(null);
  const mistParticlesRef = useRef<THREE.Points | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const waterCanDropsRef = useRef<THREE.Points | null>(null);
  const windTurbineBladesRef = useRef<THREE.Group[]>([]);

  // Camera targets and smooth lerping
  const targetCamPos = useRef(new THREE.Vector3(0, 14, 26));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.5, -4));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, -4));
  const mousePos = useRef({ x: 0, y: 0 });
  const orbitAngle = useRef(0);

  // Lighting profiles for each Time of Day
  const lightingPresets = {
    dawn: {
      sky: 0xf6d5b0,
      ground: 0x486940,
      sunColor: 0xffdfad,
      sunIntensity: 2.2,
      sunPos: [35, 18, -25],
      fogColor: 0xefd3ba,
      fogNear: 25,
      fogFar: 95,
      hemiIntensity: 0.8,
      ambientIntensity: 0.35,
      windowGlow: 0.1,
    },
    noon: {
      sky: 0x9be2ff,
      ground: 0x517e47,
      sunColor: 0xfffae6,
      sunIntensity: 2.6,
      sunPos: [20, 48, 10],
      fogColor: 0xd6eefb,
      fogNear: 35,
      fogFar: 110,
      hemiIntensity: 1.0,
      ambientIntensity: 0.45,
      windowGlow: 0.0,
    },
    golden: {
      sky: 0xffaf59,
      ground: 0x403522,
      sunColor: 0xff9933,
      sunIntensity: 2.5,
      sunPos: [-38, 16, -20],
      fogColor: 0xf6b579,
      fogNear: 25,
      fogFar: 95,
      hemiIntensity: 0.85,
      ambientIntensity: 0.38,
      windowGlow: 0.4,
    },
    twilight: {
      sky: 0x223049,
      ground: 0x16221c,
      sunColor: 0x738cb2,
      sunIntensity: 0.8,
      sunPos: [-45, 8, -35],
      fogColor: 0x1e2738,
      fogNear: 20,
      fogFar: 85,
      hemiIntensity: 0.4,
      ambientIntensity: 0.25,
      windowGlow: 1.8,
    },
  };

  // Camera preset positions
  const getCameraPositions = useCallback((preset: CameraPreset) => {
    switch (preset) {
      case 'hero':
        // Wide-angle elevated perspective across the farm field toward the horizon
        return {
          pos: new THREE.Vector3(0, 13.5, 25),
          look: new THREE.Vector3(0, 1.8, -6),
        };
      case 'farmer':
        // Focused closer on the farmer working between crop rows in the mid-background
        return {
          pos: new THREE.Vector3(3.5, 5.2, 7.5),
          look: new THREE.Vector3(3.5, 2.0, -4.5),
        };
      case 'barn':
        // Overlook toward the modern timber barn, silo, and hay meadow
        return {
          pos: new THREE.Vector3(-14, 8.5, 8),
          look: new THREE.Vector3(-18, 4.0, -18),
        };
      case 'tractor':
        // View across the perimeter lane focused on the modern green tractor
        return {
          pos: new THREE.Vector3(12, 6.0, 6.0),
          look: new THREE.Vector3(15, 2.8, -12),
        };
      case 'orbit':
        return {
          pos: new THREE.Vector3(
            Math.sin(orbitAngle.current) * 26,
            12,
            Math.cos(orbitAngle.current) * 26
          ),
          look: new THREE.Vector3(0, 2.0, -4),
        };
    }
  }, []);

  // Update camera target when preset changes
  useEffect(() => {
    if (cameraPreset !== 'orbit') {
      const { pos, look } = getCameraPositions(cameraPreset);
      targetCamPos.current.copy(pos);
      targetLookAt.current.copy(look);
    }
  }, [cameraPreset, getCameraPositions]);

  // Update lighting when time of day changes
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !hemiLightRef.current) return;
    const p = lightingPresets[timeOfDay];

    sceneRef.current.background = new THREE.Color(p.fogColor);
    if (sceneRef.current.fog) {
      sceneRef.current.fog.color.setHex(p.fogColor);
      (sceneRef.current.fog as THREE.Fog).near = p.fogNear;
      (sceneRef.current.fog as THREE.Fog).far = p.fogFar;
    }

    sunLightRef.current.color.setHex(p.sunColor);
    sunLightRef.current.intensity = p.sunIntensity;
    sunLightRef.current.position.set(p.sunPos[0], p.sunPos[1], p.sunPos[2]);

    hemiLightRef.current.color.setHex(p.sky);
    hemiLightRef.current.groundColor.setHex(p.ground);
    hemiLightRef.current.intensity = p.hemiIntensity;

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = p.ambientIntensity;
    }

    if (barnWindowLightRef.current) {
      barnWindowLightRef.current.intensity = p.windowGlow;
    }
  }, [timeOfDay]);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialLight = lightingPresets[timeOfDay];
    scene.background = new THREE.Color(initialLight.fogColor);
    scene.fog = new THREE.Fog(initialLight.fogColor, initialLight.fogNear, initialLight.fogFar);

    // 2. Camera (Wide-angle, elevated)
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.5, 200);
    camera.position.set(0, 13.5, 25);
    cameraRef.current = camera;

    // 3. Renderer with soft shadow maps and Spline-style PBR tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(
      initialLight.sky,
      initialLight.ground,
      initialLight.hemiIntensity
    );
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const ambientLight = new THREE.AmbientLight(0xffffff, initialLight.ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(initialLight.sunColor, initialLight.sunIntensity);
    sunLight.position.set(initialLight.sunPos[0], initialLight.sunPos[1], initialLight.sunPos[2]);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 120;
    const d = 35;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Soft Fill / Rim light for that signature Spline 3D sheen
    const rimLight = new THREE.DirectionalLight(0xa5d6a7, 0.6);
    rimLight.position.set(-20, 25, 20);
    scene.add(rimLight);

    // Warm Barn Interior Light
    const barnLight = new THREE.PointLight(0xffa726, initialLight.windowGlow, 25);
    barnLight.position.set(-18, 4, -18);
    scene.add(barnLight);
    barnWindowLightRef.current = barnLight;

    // Materials Palette (Spline 3D aesthetic: rounded, soft specular, rich organic tones)
    const materials = {
      soilMound: new THREE.MeshStandardMaterial({
        color: 0x4a321f, // Rich dark brown loam
        roughness: 0.88,
        metalness: 0.05,
        flatShading: false,
      }),
      soilFurrow: new THREE.MeshStandardMaterial({
        color: 0x362315, // Furrow shadow soil
        roughness: 0.95,
        metalness: 0.02,
      }),
      meadowGrass: new THREE.MeshStandardMaterial({
        color: 0x4c873b, // Lush fresh grass
        roughness: 0.75,
        metalness: 0.04,
      }),
      rollingHills: new THREE.MeshStandardMaterial({
        color: 0x5b944b,
        roughness: 0.9,
      }),
      cabbageOuter: new THREE.MeshStandardMaterial({
        color: 0x22c55e, // Fresh green
        roughness: 0.45,
        metalness: 0.05,
      }),
      cabbageHeart: new THREE.MeshStandardMaterial({
        color: 0x86efac, // Tender light green
        roughness: 0.35,
      }),
      tomatoStem: new THREE.MeshStandardMaterial({
        color: 0x166534,
        roughness: 0.6,
      }),
      tomatoFruit: new THREE.MeshStandardMaterial({
        color: 0xef4444, // Bright ripe tomato red
        roughness: 0.25,
        metalness: 0.1,
      }),
      carrotGreens: new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.55,
      }),
      carrotTop: new THREE.MeshStandardMaterial({
        color: 0xf97316, // Orange carrot top crown
        roughness: 0.4,
      }),
      cornLeaves: new THREE.MeshStandardMaterial({
        color: 0x65a30d,
        roughness: 0.5,
      }),
      cornTassel: new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.4,
      }),
      irrigationPipe: new THREE.MeshStandardMaterial({
        color: 0x334155, // Matte slate polymer pipe
        roughness: 0.4,
        metalness: 0.3,
      }),
      brassNozzle: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.3,
        metalness: 0.8,
      }),
      timberBarn: new THREE.MeshStandardMaterial({
        color: 0x991b1b, // Classic modern rustic red barn
        roughness: 0.7,
        metalness: 0.05,
      }),
      barnRoof: new THREE.MeshStandardMaterial({
        color: 0x1e293b, // Modern slate dark roof
        roughness: 0.5,
        metalness: 0.2,
      }),
      whiteTrim: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.5,
      }),
      siloMetal: new THREE.MeshStandardMaterial({
        color: 0xcbd5e1, // Galvanized metal silo
        roughness: 0.25,
        metalness: 0.75,
      }),
      hayGolden: new THREE.MeshStandardMaterial({
        color: 0xeab308, // Golden straw
        roughness: 0.9,
      }),
      fenceWood: new THREE.MeshStandardMaterial({
        color: 0x78553d, // Weathered wood
        roughness: 0.85,
      }),
      tractorGreen: new THREE.MeshStandardMaterial({
        color: 0x15803d, // John Deere green
        roughness: 0.3,
        metalness: 0.2,
      }),
      tractorYellow: new THREE.MeshStandardMaterial({
        color: 0xfacc15, // Yellow rims
        roughness: 0.35,
        metalness: 0.3,
      }),
      tractorTire: new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.9,
        metalness: 0.1,
      }),
      tractorGlass: new THREE.MeshPhysicalMaterial({
        color: 0xbae6fd,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        transmission: 0.7,
      }),
      farmerHat: new THREE.MeshStandardMaterial({
        color: 0xd4a373, // Straw hat
        roughness: 0.8,
      }),
      farmerShirt: new THREE.MeshStandardMaterial({
        color: 0x38bdf8, // Chambray light blue
        roughness: 0.65,
      }),
      farmerOveralls: new THREE.MeshStandardMaterial({
        color: 0x1d4ed8, // Denim dungarees
        roughness: 0.7,
      }),
      farmerBoots: new THREE.MeshStandardMaterial({
        color: 0x382314, // Leather boots
        roughness: 0.8,
      }),
      farmerSkin: new THREE.MeshStandardMaterial({
        color: 0xf5cfb3,
        roughness: 0.6,
      }),
      wateringCan: new THREE.MeshStandardMaterial({
        color: 0x059669, // Emerald metal can
        roughness: 0.3,
        metalness: 0.6,
      }),
      waterTowerWood: new THREE.MeshStandardMaterial({
        color: 0x854d0e,
        roughness: 0.8,
      }),
      waterTowerTank: new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.5,
        metalness: 0.4,
      }),
    };

    // ==========================================
    // 5. TERRAIN: Large Farm Field with Crop Furrows
    // ==========================================
    const farmGroundGroup = new THREE.Group();
    scene.add(farmGroundGroup);

    // Flat base meadow
    const groundGeo = new THREE.PlaneGeometry(160, 160, 40, 40);
    const groundMesh = new THREE.Mesh(groundGeo, materials.meadowGrass);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.15;
    groundMesh.receiveShadow = true;
    farmGroundGroup.add(groundMesh);

    // Distant rolling hills for peaceful atmosphere
    const hillGeo = new THREE.ConeGeometry(32, 12, 16);
    const hill1 = new THREE.Mesh(hillGeo, materials.rollingHills);
    hill1.position.set(-45, 2, -65);
    hill1.scale.set(1.4, 0.7, 1.2);
    farmGroundGroup.add(hill1);

    const hill2 = new THREE.Mesh(hillGeo, materials.rollingHills);
    hill2.position.set(35, 1, -75);
    hill2.scale.set(1.8, 0.9, 1.4);
    farmGroundGroup.add(hill2);

    const hill3 = new THREE.Mesh(hillGeo, materials.rollingHills);
    hill3.position.set(-10, 0, -85);
    hill3.scale.set(2.2, 0.8, 1.5);
    farmGroundGroup.add(hill3);

    // ORGANIZED CROP ROWS & FURROWS
    // 7 parallel raised soil mounds running along Z (from z = 8 to z = -24)
    const rowPositionsX = [-12, -8, -4, 0, 4, 8, 12];
    const rowLength = 32;

    rowPositionsX.forEach((rx, rowIndex) => {
      // Raised rounded soil bed
      const moundGeo = new THREE.CylinderGeometry(0.75, 1.1, rowLength, 12);
      moundGeo.rotateX(Math.PI / 2);
      const mound = new THREE.Mesh(moundGeo, materials.soilMound);
      mound.position.set(rx, 0.25, -8);
      mound.scale.set(1.2, 0.5, 1);
      mound.receiveShadow = true;
      mound.castShadow = true;
      farmGroundGroup.add(mound);

      // Furrow path between beds
      if (rowIndex < rowPositionsX.length - 1) {
        const furrowX = rx + 2;
        const furrowGeo = new THREE.PlaneGeometry(1.6, rowLength);
        furrowGeo.rotateX(-Math.PI / 2);
        const furrow = new THREE.Mesh(furrowGeo, materials.soilFurrow);
        furrow.position.set(furrowX, 0.02, -8);
        furrow.receiveShadow = true;
        farmGroundGroup.add(furrow);

        // Sleek irrigation pipe along the furrow
        const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, rowLength - 2, 8);
        pipeGeo.rotateX(Math.PI / 2);
        const pipe = new THREE.Mesh(pipeGeo, materials.irrigationPipe);
        pipe.position.set(furrowX + 0.35, 0.08, -8);
        pipe.castShadow = true;
        farmGroundGroup.add(pipe);

        // Micro-sprinkler risers every 6 meters
        for (let spz = -22; spz <= 6; spz += 6.5) {
          const riserGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6);
          const riser = new THREE.Mesh(riserGeo, materials.irrigationPipe);
          riser.position.set(furrowX + 0.35, 0.26, spz);

          const nozzleGeo = new THREE.SphereGeometry(0.045, 8, 8);
          const nozzle = new THREE.Mesh(nozzleGeo, materials.brassNozzle);
          nozzle.position.set(0, 0.23, 0);
          riser.add(nozzle);
          farmGroundGroup.add(riser);
        }
      }
    });

    // ==========================================
    // 6. CROPS & VEGETABLES (Organized, Plentiful, Animated)
    // ==========================================
    const cropSways: THREE.Group[] = [];

    // Helper: Build a stylized cabbage/lettuce head
    const createCabbage = () => {
      const cabbageGroup = new THREE.Group();
      // Outer ruffled leaves
      const outerGeo = new THREE.SphereGeometry(0.38, 7, 7);
      outerGeo.scale(1.15, 0.7, 1.15);
      const outerMesh = new THREE.Mesh(outerGeo, materials.cabbageOuter);
      outerMesh.castShadow = true;
      outerMesh.receiveShadow = true;
      cabbageGroup.add(outerMesh);

      // Leaf rosettes
      for (let i = 0; i < 4; i++) {
        const petalGeo = new THREE.ConeGeometry(0.24, 0.45, 5);
        petalGeo.rotateZ(0.65);
        petalGeo.rotateY((i * Math.PI) / 2 + Math.PI / 4);
        const petal = new THREE.Mesh(petalGeo, materials.cabbageOuter);
        petal.position.set(0, 0.08, 0);
        cabbageGroup.add(petal);
      }

      // Tender glowing heart
      const heartGeo = new THREE.SphereGeometry(0.2, 6, 6);
      const heart = new THREE.Mesh(heartGeo, materials.cabbageHeart);
      heart.position.set(0, 0.2, 0);
      cabbageGroup.add(heart);
      return cabbageGroup;
    };

    // Helper: Build a tomato bush with visible red fruit
    const createTomatoBush = () => {
      const bush = new THREE.Group();
      // Central leafy spheres
      const leafGeo = new THREE.DodecahedronGeometry(0.32, 1);
      const m1 = new THREE.Mesh(leafGeo, materials.tomatoStem);
      m1.position.set(0, 0.32, 0);
      m1.castShadow = true;
      bush.add(m1);

      const m2 = new THREE.Mesh(leafGeo, materials.tomatoStem);
      m2.position.set(0.12, 0.55, -0.08);
      m2.scale.set(0.8, 0.8, 0.8);
      m2.castShadow = true;
      bush.add(m2);

      // Red tomatoes hanging
      const tomatoGeo = new THREE.SphereGeometry(0.1, 7, 7);
      const t1 = new THREE.Mesh(tomatoGeo, materials.tomatoFruit);
      t1.position.set(0.22, 0.35, 0.18);
      t1.castShadow = true;
      bush.add(t1);

      const t2 = new THREE.Mesh(tomatoGeo, materials.tomatoFruit);
      t2.position.set(-0.2, 0.4, 0.15);
      t2.castShadow = true;
      bush.add(t2);

      const t3 = new THREE.Mesh(tomatoGeo, materials.tomatoFruit);
      t3.position.set(0.05, 0.22, -0.22);
      bush.add(t3);
      return bush;
    };

    // Helper: Build carrot / root plant with orange crown & feathery fronds
    const createCarrotPlant = () => {
      const carrot = new THREE.Group();
      // Orange root top peeking from soil
      const crownGeo = new THREE.CylinderGeometry(0.09, 0.05, 0.12, 6);
      const crown = new THREE.Mesh(crownGeo, materials.carrotTop);
      crown.position.set(0, 0.05, 0);
      crown.castShadow = true;
      carrot.add(crown);

      // 4 feathery fronds
      for (let i = 0; i < 4; i++) {
        const frondGeo = new THREE.ConeGeometry(0.12, 0.5, 4);
        frondGeo.rotateX(0.25);
        frondGeo.rotateY((i * Math.PI) / 2);
        const frond = new THREE.Mesh(frondGeo, materials.carrotGreens);
        frond.position.set(0, 0.25, 0);
        frond.castShadow = true;
        carrot.add(frond);
      }
      return carrot;
    };

    // Helper: Build tall corn / maize stalk with golden tassels
    const createCornStalk = () => {
      const corn = new THREE.Group();
      // Stalk
      const stalkGeo = new THREE.CylinderGeometry(0.05, 0.07, 1.4, 6);
      const stalk = new THREE.Mesh(stalkGeo, materials.cornLeaves);
      stalk.position.set(0, 0.7, 0);
      stalk.castShadow = true;
      corn.add(stalk);

      // Arching leaves
      for (let i = 0; i < 5; i++) {
        const leafGeo = new THREE.ConeGeometry(0.15, 0.7, 4);
        leafGeo.rotateZ(0.7);
        leafGeo.rotateY((i * Math.PI * 2) / 5);
        const leaf = new THREE.Mesh(leafGeo, materials.cornLeaves);
        leaf.position.set(0, 0.4 + i * 0.18, 0);
        corn.add(leaf);
      }

      // Golden tassel at top
      const tasselGeo = new THREE.ConeGeometry(0.09, 0.35, 5);
      const tassel = new THREE.Mesh(tasselGeo, materials.cornTassel);
      tassel.position.set(0, 1.45, 0);
      corn.add(tassel);
      return corn;
    };

    // Populate rows systematically
    // Row 0 (-12): Cabbages
    // Row 1 (-8): Carrots
    // Row 2 (-4): Tomatoes
    // Row 3 (0): Cabbages / lettuces (clean center foreground)
    // Row 4 (4): Tomatoes (where the farmer works nearby)
    // Row 5 (8): Carrots
    // Row 6 (12): Tall Sweet Corn
    rowPositionsX.forEach((rx, rIdx) => {
      const zStep = rIdx === 6 ? 1.8 : 1.35; // Stalk spacing
      for (let z = -22; z <= 6; z += zStep) {
        // Keep foreground center (z > 2 and |rx| < 4) slightly lighter for clean website hero
        if (z > 2 && Math.abs(rx) <= 4 && Math.random() > 0.4) continue;

        let plant: THREE.Group;
        if (rIdx === 0 || rIdx === 3) {
          plant = createCabbage();
          plant.position.set(rx + (Math.random() - 0.5) * 0.15, 0.35, z);
          const s = 0.85 + Math.random() * 0.25;
          plant.scale.set(s, s, s);
        } else if (rIdx === 1 || rIdx === 5) {
          plant = createCarrotPlant();
          plant.position.set(rx + (Math.random() - 0.5) * 0.15, 0.36, z);
          const s = 0.9 + Math.random() * 0.2;
          plant.scale.set(s, s, s);
        } else if (rIdx === 2 || rIdx === 4) {
          plant = createTomatoBush();
          plant.position.set(rx + (Math.random() - 0.5) * 0.18, 0.32, z);
          const s = 0.85 + Math.random() * 0.3;
          plant.scale.set(s, s, s);
        } else {
          plant = createCornStalk();
          plant.position.set(rx + (Math.random() - 0.5) * 0.15, 0.32, z);
          const s = 0.85 + Math.random() * 0.25;
          plant.scale.set(s, s, s);
        }

        plant.rotation.y = Math.random() * Math.PI * 2;
        scene.add(plant);
        cropSways.push(plant);
      }
    });

    cropSwayGroups.current = cropSways;

    // ==========================================
    // 7. THE FARMER (Active in background, natural, smaller, watering/checking)
    // ==========================================
    const farmerRoot = new THREE.Group();
    // Position farmer walking in furrow between Row 4 and Row 5 at mid-distance (z = -6)
    farmerRoot.position.set(6, 0.0, -6);
    farmerRoot.scale.set(0.65, 0.65, 0.65); // Naturally smaller as requested
    scene.add(farmerRoot);

    // Torso (Shirt + Denim Dungarees)
    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.72, 8);
    const torso = new THREE.Mesh(torsoGeo, materials.farmerShirt);
    torso.position.set(0, 1.25, 0);
    torso.castShadow = true;
    farmerRoot.add(torso);

    const bibGeo = new THREE.BoxGeometry(0.38, 0.42, 0.32);
    const bib = new THREE.Mesh(bibGeo, materials.farmerOveralls);
    bib.position.set(0, 1.15, 0.02);
    farmerRoot.add(bib);

    // Head
    const headGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const head = new THREE.Mesh(headGeo, materials.farmerSkin);
    head.position.set(0, 1.78, 0);
    head.castShadow = true;
    farmerRoot.add(head);

    // Straw Hat (Spline 3D style wide brim + crown)
    const hatBrimGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 16);
    const hatBrim = new THREE.Mesh(hatBrimGeo, materials.farmerHat);
    hatBrim.position.set(0, 1.9, 0);
    hatBrim.castShadow = true;
    farmerRoot.add(hatBrim);

    const hatCrownGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.28, 12);
    const hatCrown = new THREE.Mesh(hatCrownGeo, materials.farmerHat);
    hatCrown.position.set(0, 2.05, 0);
    hatCrown.castShadow = true;
    farmerRoot.add(hatCrown);

    // Left & Right Legs (Pivoting at hip for walk cycle)
    const createLeg = () => {
      const legPivot = new THREE.Group();
      const pantGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.68, 6);
      const pant = new THREE.Mesh(pantGeo, materials.farmerOveralls);
      pant.position.set(0, -0.34, 0);
      pant.castShadow = true;
      legPivot.add(pant);

      const bootGeo = new THREE.BoxGeometry(0.16, 0.14, 0.28);
      const boot = new THREE.Mesh(bootGeo, materials.farmerBoots);
      boot.position.set(0, -0.72, 0.06);
      boot.castShadow = true;
      legPivot.add(boot);
      return legPivot;
    };

    const leftLeg = createLeg();
    leftLeg.position.set(-0.16, 0.88, 0);
    farmerRoot.add(leftLeg);

    const rightLeg = createLeg();
    rightLeg.position.set(0.16, 0.88, 0);
    farmerRoot.add(rightLeg);

    // Left Arm (Swings naturally)
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.35, 1.5, 0);
    const leftArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.58, 6);
    const leftArmMesh = new THREE.Mesh(leftArmGeo, materials.farmerShirt);
    leftArmMesh.position.set(0, -0.28, 0);
    leftArmMesh.castShadow = true;
    leftArmPivot.add(leftArmMesh);
    farmerRoot.add(leftArmPivot);

    // Right Arm (Holding Watering Can / Inspection Tool)
    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.35, 1.5, 0);
    const rightArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.58, 6);
    const rightArmMesh = new THREE.Mesh(rightArmGeo, materials.farmerShirt);
    rightArmMesh.position.set(0, -0.28, 0);
    rightArmMesh.castShadow = true;
    rightArmPivot.add(rightArmMesh);

    // Emerald Watering Can
    const canGroup = new THREE.Group();
    canGroup.position.set(0, -0.6, 0.18);
    const canBodyGeo = new THREE.CylinderGeometry(0.15, 0.16, 0.35, 8);
    const canBody = new THREE.Mesh(canBodyGeo, materials.wateringCan);
    canBody.castShadow = true;
    canGroup.add(canBody);

    const spoutGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.45, 6);
    spoutGeo.rotateZ(-0.65);
    const spout = new THREE.Mesh(spoutGeo, materials.wateringCan);
    spout.position.set(0.24, 0.1, 0);
    canGroup.add(spout);

    const roseGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.06, 8);
    roseGeo.rotateZ(-0.65);
    const rose = new THREE.Mesh(roseGeo, materials.brassNozzle);
    rose.position.set(0.42, 0.24, 0);
    canGroup.add(rose);

    rightArmPivot.add(canGroup);
    farmerRoot.add(rightArmPivot);

    farmerRef.current = {
      root: farmerRoot,
      leftLeg,
      rightLeg,
      leftArm: leftArmPivot,
      rightArm: rightArmPivot,
      can: canGroup,
      isWatering: false,
      targetX: 6,
      dir: -1,
    };

    // Farmer Water Drops Particle System
    const waterDropCount = 60;
    const waterDropGeo = new THREE.BufferGeometry();
    const dropPositions = new Float32Array(waterDropCount * 3);
    for (let i = 0; i < waterDropCount; i++) {
      dropPositions[i * 3] = (Math.random() - 0.5) * 0.4;
      dropPositions[i * 3 + 1] = -Math.random() * 0.8;
      dropPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    waterDropGeo.setAttribute('position', new THREE.BufferAttribute(dropPositions, 3));
    const dropMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
    });
    const dropParticles = new THREE.Points(waterDropGeo, dropMat);
    dropParticles.position.set(6.4, 0.8, -6);
    scene.add(dropParticles);
    waterCanDropsRef.current = dropParticles;

    // ==========================================
    // 8. MODERN RED BARN, GRAIN SILO & WATER TANK
    // ==========================================
    const barnGroup = new THREE.Group();
    barnGroup.position.set(-20, 0, -20);
    barnGroup.rotation.y = Math.PI / 6; // Angled attractively toward the camera
    scene.add(barnGroup);

    // Barn Main Building
    const barnBodyGeo = new THREE.BoxGeometry(7, 5, 10);
    const barnBody = new THREE.Mesh(barnBodyGeo, materials.timberBarn);
    barnBody.position.set(0, 2.5, 0);
    barnBody.castShadow = true;
    barnBody.receiveShadow = true;
    barnGroup.add(barnBody);

    // Barn Pitched Roof
    const roofGeo = new THREE.ConeGeometry(5.8, 3.2, 4);
    roofGeo.rotateY(Math.PI / 4);
    roofGeo.scale(1.0, 1.0, 1.6);
    const barnRoof = new THREE.Mesh(roofGeo, materials.barnRoof);
    barnRoof.position.set(0, 6.2, 0);
    barnRoof.castShadow = true;
    barnGroup.add(barnRoof);

    // White Trim Barn Doors (Classic X pattern)
    const doorFrameGeo = new THREE.BoxGeometry(2.4, 3.2, 0.2);
    const doorFrame = new THREE.Mesh(doorFrameGeo, materials.whiteTrim);
    doorFrame.position.set(0, 1.6, 5.05);
    barnGroup.add(doorFrame);

    const doorInnerGeo = new THREE.BoxGeometry(2.1, 2.9, 0.22);
    const doorInner = new THREE.Mesh(doorInnerGeo, materials.timberBarn);
    doorInner.position.set(0, 1.6, 5.06);
    barnGroup.add(doorInner);

    // Attic Loft Window (Glowing Warmly)
    const loftWinGeo = new THREE.BoxGeometry(1.2, 1.2, 0.2);
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const loftWin = new THREE.Mesh(loftWinGeo, winMat);
    loftWin.position.set(0, 5.2, 5.05);
    barnGroup.add(loftWin);

    // Cylindrical Grain Silo adjacent to barn
    const siloGroup = new THREE.Group();
    siloGroup.position.set(-5.5, 0, 1.5);
    const siloBodyGeo = new THREE.CylinderGeometry(1.6, 1.6, 8.5, 16);
    const siloBody = new THREE.Mesh(siloBodyGeo, materials.siloMetal);
    siloBody.position.set(0, 4.25, 0);
    siloBody.castShadow = true;
    siloGroup.add(siloBody);

    const siloDomeGeo = new THREE.SphereGeometry(1.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const siloDome = new THREE.Mesh(siloDomeGeo, materials.siloMetal);
    siloDome.position.set(0, 8.5, 0);
    siloDome.castShadow = true;
    siloGroup.add(siloDome);
    barnGroup.add(siloGroup);

    // Water Tank Tower (Cedar barrel on wooden trestle)
    const waterTower = new THREE.Group();
    waterTower.position.set(-18, 0, -6);
    // 4 timber legs
    for (let i = 0; i < 4; i++) {
      const legGeo = new THREE.CylinderGeometry(0.1, 0.14, 5.2, 6);
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const leg = new THREE.Mesh(legGeo, materials.waterTowerWood);
      leg.position.set(Math.cos(angle) * 1.1, 2.6, Math.sin(angle) * 1.1);
      leg.castShadow = true;
      waterTower.add(leg);
    }
    // Tank Barrel
    const tankGeo = new THREE.CylinderGeometry(1.4, 1.4, 2.2, 14);
    const tank = new THREE.Mesh(tankGeo, materials.waterTowerTank);
    tank.position.set(0, 6.2, 0);
    tank.castShadow = true;
    waterTower.add(tank);

    // Conical tank roof
    const tankRoofGeo = new THREE.ConeGeometry(1.6, 0.9, 14);
    const tankRoof = new THREE.Mesh(tankRoofGeo, materials.timberBarn);
    tankRoof.position.set(0, 7.7, 0);
    waterTower.add(tankRoof);
    scene.add(waterTower);

    // ==========================================
    // 9. MODERN GREEN TRACTOR IN DISTANCE
    // ==========================================
    const tractorGroup = new THREE.Group();
    // Placed along the field perimeter lane on the right
    tractorGroup.position.set(16, 0, -12);
    tractorGroup.rotation.y = -Math.PI / 5;
    scene.add(tractorGroup);

    // Engine Hood & Chassis
    const hoodGeo = new THREE.BoxGeometry(1.8, 1.2, 2.6);
    const hood = new THREE.Mesh(hoodGeo, materials.tractorGreen);
    hood.position.set(0, 1.2, 0.6);
    hood.castShadow = true;
    tractorGroup.add(hood);

    // Operator Cab with panoramic glass
    const cabGeo = new THREE.BoxGeometry(1.7, 1.5, 1.8);
    const cab = new THREE.Mesh(cabGeo, materials.tractorGlass);
    cab.position.set(0, 2.3, -1.1);
    cab.castShadow = true;
    tractorGroup.add(cab);

    // Cab Roof
    const cabRoofGeo = new THREE.BoxGeometry(1.9, 0.25, 2.1);
    const cabRoof = new THREE.Mesh(cabRoofGeo, materials.tractorGreen);
    cabRoof.position.set(0, 3.1, -1.1);
    cabRoof.castShadow = true;
    tractorGroup.add(cabRoof);

    // Exhaust Stack
    const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.5, 8);
    const exhaust = new THREE.Mesh(exhaustGeo, materials.irrigationPipe);
    exhaust.position.set(0.7, 2.4, 1.2);
    tractorGroup.add(exhaust);

    // Big Rear Wheels with Yellow Rims
    const createTractorWheel = (radius: number, width: number, isRear: boolean) => {
      const wheelGroup = new THREE.Group();
      const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 14);
      tireGeo.rotateZ(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, materials.tractorTire);
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rimGeo = new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, width + 0.02, 10);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, materials.tractorYellow);
      wheelGroup.add(rim);
      return wheelGroup;
    };

    const rearLeftWheel = createTractorWheel(1.1, 0.65, true);
    rearLeftWheel.position.set(-1.25, 1.1, -1.2);
    tractorGroup.add(rearLeftWheel);

    const rearRightWheel = createTractorWheel(1.1, 0.65, true);
    rearRightWheel.position.set(1.25, 1.1, -1.2);
    tractorGroup.add(rearRightWheel);

    const frontLeftWheel = createTractorWheel(0.65, 0.45, false);
    frontLeftWheel.position.set(-1.05, 0.65, 1.5);
    tractorGroup.add(frontLeftWheel);

    const frontRightWheel = createTractorWheel(0.65, 0.45, false);
    frontRightWheel.position.set(1.05, 0.65, 1.5);
    tractorGroup.add(frontRightWheel);

    // ==========================================
    // 10. GOLDEN HAY BALES & WOODEN FENCES
    // ==========================================
    // Hay Bales dotted around meadow
    const balePositions = [
      [-16, 0.7, 4, 0.2],
      [-14.5, 0.7, 5.5, -0.4],
      [-15.2, 1.9, 4.8, 0.1], // Stacked bale
      [15, 0.7, 2, 0.3],
      [17, 0.7, 4, -0.5],
      [18, 0.7, -4, 0.1],
    ];

    balePositions.forEach(([bx, by, bz, rot]) => {
      const baleGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.4, 14);
      baleGeo.rotateZ(Math.PI / 2);
      const bale = new THREE.Mesh(baleGeo, materials.hayGolden);
      bale.position.set(bx, by, bz);
      bale.rotation.y = rot;
      bale.castShadow = true;
      bale.receiveShadow = true;
      scene.add(bale);
    });

    // Rustic Wooden Fence along sides and perimeter
    const buildFenceLine = (startX: number, startZ: number, count: number, stepX: number, stepZ: number) => {
      for (let i = 0; i < count; i++) {
        const px = startX + i * stepX;
        const pz = startZ + i * stepZ;
        // Post
        const postGeo = new THREE.CylinderGeometry(0.08, 0.09, 1.4, 6);
        const post = new THREE.Mesh(postGeo, materials.fenceWood);
        post.position.set(px, 0.7, pz);
        post.castShadow = true;
        scene.add(post);

        // Horizontal rail connecting to next post
        if (i < count - 1) {
          const railGeo = new THREE.BoxGeometry(0.08, 0.1, Math.hypot(stepX, stepZ) + 0.1);
          const angle = Math.atan2(stepX, stepZ);
          const r1 = new THREE.Mesh(railGeo, materials.fenceWood);
          r1.position.set(px + stepX * 0.5, 0.95, pz + stepZ * 0.5);
          r1.rotation.y = angle;
          r1.castShadow = true;
          scene.add(r1);

          const r2 = new THREE.Mesh(railGeo, materials.fenceWood);
          r2.position.set(px + stepX * 0.5, 0.55, pz + stepZ * 0.5);
          r2.rotation.y = angle;
          r2.castShadow = true;
          scene.add(r2);
        }
      }
    };

    // Left fence along barn boundary
    buildFenceLine(-14, 8, 8, -1.2, -4);
    // Right fence along road boundary
    buildFenceLine(14, 8, 8, 0.6, -4);

    // ==========================================
    // 11. HARVEST CRATES & GARDEN TOOLS
    // ==========================================
    const crateGroup = new THREE.Group();
    crateGroup.position.set(-10, 0, 7);
    scene.add(crateGroup);

    const crateGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
    const crate1 = new THREE.Mesh(crateGeo, materials.fenceWood);
    crate1.position.set(0, 0.25, 0);
    crate1.castShadow = true;
    crateGroup.add(crate1);

    // Pumpkins / squash in crate
    const vegGeo = new THREE.SphereGeometry(0.18, 7, 7);
    vegGeo.scale(1.2, 0.8, 1.2);
    const veg1 = new THREE.Mesh(vegGeo, materials.carrotTop);
    veg1.position.set(-0.15, 0.52, 0);
    crateGroup.add(veg1);

    const veg2 = new THREE.Mesh(vegGeo, materials.carrotTop);
    veg2.position.set(0.16, 0.52, 0.05);
    crateGroup.add(veg2);

    // ==========================================
    // 12. DISTANT WIND TURBINES ON HORIZON
    // ==========================================
    const turbines: THREE.Group[] = [];
    const turbinePositions = [
      [-32, 0, -60],
      [28, 0, -68],
      [42, 0, -55],
    ];

    turbinePositions.forEach(([tx, ty, tz]) => {
      const turbineRoot = new THREE.Group();
      turbineRoot.position.set(tx, ty, tz);

      // Tower
      const towerGeo = new THREE.CylinderGeometry(0.2, 0.45, 16, 8);
      const tower = new THREE.Mesh(towerGeo, materials.siloMetal);
      tower.position.set(0, 8, 0);
      turbineRoot.add(tower);

      // Nacelle hub
      const hubGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const hub = new THREE.Mesh(hubGeo, materials.siloMetal);
      hub.position.set(0, 16, 0.2);
      turbineRoot.add(hub);

      // 3 Blades
      const bladesGroup = new THREE.Group();
      bladesGroup.position.set(0, 16, 0.4);
      for (let b = 0; b < 3; b++) {
        const bladeGeo = new THREE.ConeGeometry(0.18, 5.5, 4);
        bladeGeo.rotateZ((b * Math.PI * 2) / 3);
        const blade = new THREE.Mesh(bladeGeo, materials.whiteTrim);
        blade.position.set(
          Math.sin((b * Math.PI * 2) / 3) * 2.75,
          Math.cos((b * Math.PI * 2) / 3) * 2.75,
          0
        );
        blade.rotation.z = (b * Math.PI * 2) / 3;
        bladesGroup.add(blade);
      }
      turbineRoot.add(bladesGroup);
      turbines.push(bladesGroup);
      scene.add(turbineRoot);
    });

    windTurbineBladesRef.current = turbines;

    // ==========================================
    // 13. FLOATING SUN DUST & POLLEN PARTICLES
    // ==========================================
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 45;
      dustPos[i * 3 + 1] = 1 + Math.random() * 12;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfff4c2,
      size: 0.12,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // ==========================================
    // 14. IRRIGATION MIST PARTICLES (Sprinklers)
    // ==========================================
    const mistCount = 450;
    const mistGeo = new THREE.BufferGeometry();
    const mistPos = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      const furrowChoice = rowPositionsX[Math.floor(Math.random() * (rowPositionsX.length - 1))] + 2.35;
      const zChoice = -20 + Math.random() * 26;
      mistPos[i * 3] = furrowChoice + (Math.random() - 0.5) * 1.2;
      mistPos[i * 3 + 1] = 0.3 + Math.random() * 1.5;
      mistPos[i * 3 + 2] = zChoice + (Math.random() - 0.5) * 1.2;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    const mistMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.16,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    scene.add(mistPoints);
    mistParticlesRef.current = mistPoints;

    setLoading(false);

    // ==========================================
    // 15. INTERACTION: Pointer Parallax & Raycast
    // ==========================================
    // Pointer & Touch handlers for phone, tablet, and desktop
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mousePos.current = { x, y };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        mousePos.current = { x, y };
      }
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!onSelectFeature) return;
      const rect = container.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].point;
        // Check proximity to notable agricultural elements
        if (farmerRef.current && hit.distanceTo(farmerRef.current.root.position) < 3.0) {
          onSelectFeature({
            name: 'Agronomist Active Field Walk',
            category: 'Human Care & Oversight',
            description: 'Checking individual plant turgor and applying targeted micro-nutrient foliar hydration between crop furrows.',
            stat: 'Task: Row 5 Moisture Verification',
          });
        } else if (hit.distanceTo(tractorGroup.position) < 4.0) {
          onSelectFeature({
            name: 'Autonomous Electric Agri-Trac',
            category: 'Fleet Automation',
            description: 'Zero-emission electric tractor equipped with RTK centimeter-precision guidance for night seeding and minimal soil compaction.',
            stat: 'Battery: 94% · Ready',
          });
        } else if (hit.distanceTo(barnGroup.position) < 8.0) {
          onSelectFeature({
            name: 'Heritage Post & Beam Barn & Silo',
            category: 'Farm Infrastructure',
            description: 'Passive solar barn housing harvest consolidation, seed drying, and automated atmospheric crop storage.',
            stat: 'Storage Temp: 14.2°C',
          });
        } else if (hit.distanceTo(waterTower.position) < 3.5) {
          onSelectFeature({
            name: 'Gravity-Fed Rainwater Reservoir',
            category: 'Resource Efficiency',
            description: 'Captured precipitation routed through biological gravel filters into pressurized drip irrigation manifolds.',
            stat: 'Volume: 8,400 Gallons',
          });
        } else if (hit.z > -20 && hit.z < 8 && Math.abs(hit.x) < 14) {
          onSelectFeature({
            name: 'Organic Loam Crop Furrow',
            category: 'Precision Cultivation',
            description: 'High organic-matter topsoil with subsurface pulse drip piping and mycorrhizal fungal inoculation for maximum yield.',
            stat: 'Soil Moisture: 42% · Health 98.6%',
          });
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('click', handlePointerDown);

    // ==========================================
    // 16. ANIMATION & RENDER LOOP
    // ==========================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // 1. Subtle Crop Wind Sway
      const activeWind = windSpeed;
      cropSwayGroups.current.forEach((crop, idx) => {
        const wave = Math.sin(elapsedTime * 2.2 * activeWind + crop.position.x * 0.4 + crop.position.z * 0.3);
        crop.rotation.z = wave * 0.045 * activeWind;
        crop.rotation.x = Math.cos(elapsedTime * 1.8 * activeWind + crop.position.x * 0.2) * 0.03 * activeWind;
      });

      // 2. Farmer Walking & Working Animation Loop
      if (farmerRef.current) {
        const f = farmerRef.current;
        // Farmer walks back and forth between z = -4 and z = -14
        const walkSpeed = 0.55;
        f.root.position.z += f.dir * walkSpeed * 0.016;

        if (f.root.position.z < -14) {
          f.dir = 1;
          f.root.rotation.y = 0; // Turn facing forward
        } else if (f.root.position.z > -4) {
          f.dir = -1;
          f.root.rotation.y = Math.PI; // Turn facing backward
        }

        // Natural leg swinging walk cycle
        const walkCycle = Math.sin(elapsedTime * 3.5);
        f.leftLeg.rotation.x = walkCycle * 0.45;
        f.rightLeg.rotation.x = -walkCycle * 0.45;

        // Arm motion
        f.leftArm.rotation.x = -walkCycle * 0.35;
        // Right arm gently tilts watering can down to water crops periodically
        const waterMotion = Math.sin(elapsedTime * 1.5);
        f.rightArm.rotation.x = 0.25 + waterMotion * 0.15;
        f.can.rotation.z = 0.2 + waterMotion * 0.25;

        // Move water droplets along with the farmer
        if (waterCanDropsRef.current) {
          waterCanDropsRef.current.position.set(
            f.root.position.x + (f.dir > 0 ? 0.35 : -0.35),
            0.75,
            f.root.position.z + 0.35
          );
          const posAttr = waterCanDropsRef.current.geometry.attributes.position as THREE.BufferAttribute;
          const posArray = posAttr.array as Float32Array;
          for (let i = 0; i < posArray.length; i += 3) {
            posArray[i + 1] -= 0.028;
            if (posArray[i + 1] < -0.7) {
              posArray[i + 1] = 0;
            }
          }
          posAttr.needsUpdate = true;
        }
      }

      // 3. Wind Turbine Rotor Rotation
      windTurbineBladesRef.current.forEach((blades) => {
        blades.rotation.z += 0.012 * activeWind;
      });

      // 4. Floating Sun Dust Motes
      if (dustParticlesRef.current) {
        const dPos = dustParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const arr = dPos.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i] += Math.sin(elapsedTime + i) * 0.005;
          arr[i + 1] += Math.cos(elapsedTime * 0.8 + i) * 0.003;
          if (arr[i + 1] > 14) arr[i + 1] = 1;
        }
        dPos.needsUpdate = true;
      }

      // 5. Irrigation Sprinklers Mist Visibility & Pulse
      if (mistParticlesRef.current) {
        mistParticlesRef.current.visible = irrigationActive;
        if (irrigationActive) {
          const mMat = mistParticlesRef.current.material as THREE.PointsMaterial;
          mMat.opacity = 0.35 + Math.sin(elapsedTime * 3) * 0.1;
        }
      }

      // 6. Camera Orbiting or Parallax Lerping
      if (cameraPreset === 'orbit') {
        orbitAngle.current += 0.0025;
        camera.position.x = Math.sin(orbitAngle.current) * 26;
        camera.position.z = Math.cos(orbitAngle.current) * 26;
        camera.position.y = 13.5;
        camera.lookAt(targetLookAt.current);
      } else {
        // Parallax offset based on mouse position
        const parallaxX = mousePos.current.x * 1.8;
        const parallaxY = mousePos.current.y * 0.8;

        camera.position.x += (targetCamPos.current.x + parallaxX - camera.position.x) * 0.04;
        camera.position.y += (targetCamPos.current.y + parallaxY - camera.position.y) * 0.04;
        camera.position.z += (targetCamPos.current.z - camera.position.z) * 0.04;

        currentLookAt.current.lerp(targetLookAt.current, 0.05);
        camera.lookAt(currentLookAt.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Responsive Resize Handler (Adapts field of view for phones, tablets & laptops)
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;
      camera.aspect = aspect;

      // For narrow phone portrait screens (aspect < 1), widen FOV so farm landscape stays in view
      if (aspect < 0.8) {
        camera.fov = 62;
      } else if (aspect < 1.2) {
        camera.fov = 54;
      } else {
        camera.fov = 46;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial resize trigger
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('click', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [timeOfDay, getCameraPositions]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#0f1710] flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <span className="text-sm font-medium text-emerald-300 tracking-wider">
              Rendering Spline 3D Farm Ecosystem...
            </span>
          </div>
        </div>
      )}

      {/* Subtle Vignette & Gradient Scrim for Legibility (Ensures WCAG contrast for website text without hiding 3D details) */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          isUiHidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(15,23,16,0.05) 0%, rgba(15,23,16,0.35) 70%, rgba(15,23,16,0.7) 100%)',
        }}
      />
    </div>
  );
};
