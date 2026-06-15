import * as THREE from "/prototype/vendor/three.module.js";
import { GLTFLoader } from "/prototype/vendor/loaders/GLTFLoader.js";

const canvas = document.querySelector("#avatarCanvas");
const stage = document.querySelector("#stageTouch");
const fallback = document.querySelector("#stageImage");
const MODEL_URL = "/prototype/models/award-presenter.glb";

if (canvas && stage) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 1.45, 6.1);

  const root = new THREE.Group();
  const body = new THREE.Group();
  const head = new THREE.Group();
  const realModel = new THREE.Group();
  const breathGroup = new THREE.Group();
  breathGroup.add(root);
  scene.add(breathGroup);
  root.add(body, head, realModel);
  realModel.visible = false;

  const materials = {
    skin: new THREE.MeshStandardMaterial({ color: 0xf0b28f, roughness: 0.62, metalness: 0.02 }),
    skinWarm: new THREE.MeshStandardMaterial({ color: 0xffc2a5, roughness: 0.62 }),
    hair: new THREE.MeshStandardMaterial({ color: 0x17131c, roughness: 0.5, metalness: 0.05 }),
    jacket: new THREE.MeshStandardMaterial({ color: 0x121827, roughness: 0.58, metalness: 0.08 }),
    lapel: new THREE.MeshStandardMaterial({ color: 0x05070d, roughness: 0.64 }),
    shirt: new THREE.MeshStandardMaterial({ color: 0xf3f7ff, roughness: 0.5 }),
    accent: new THREE.MeshStandardMaterial({
      color: 0xff4d9a,
      roughness: 0.34,
      emissive: 0x3c061f,
      emissiveIntensity: 0.25
    }),
    teal: new THREE.MeshStandardMaterial({
      color: 0x31d6c8,
      roughness: 0.26,
      emissive: 0x043532,
      emissiveIntensity: 0.5
    }),
    dark: new THREE.MeshStandardMaterial({ color: 0x080a10, roughness: 0.5 }),
    eye: new THREE.MeshStandardMaterial({ color: 0x07070a, roughness: 0.28 }),
    mouth: new THREE.MeshStandardMaterial({ color: 0x4b1223, roughness: 0.5 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x9ffcf2,
      transparent: true,
      opacity: 0.2,
      roughness: 0.18,
      metalness: 0,
      transmission: 0.2
    }),
    glow: new THREE.MeshBasicMaterial({ color: 0x31d6c8, transparent: true, opacity: 0.28 })
  };

  const add = (parent, geometry, material, position, scale, rotation) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    if (rotation) mesh.rotation.set(...rotation);
    parent.add(mesh);
    return mesh;
  };

  const sphere = new THREE.SphereGeometry(1, 48, 32);
  const lowSphere = new THREE.SphereGeometry(1, 32, 18);
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 36);
  const cone = new THREE.ConeGeometry(1, 1, 36);
  const capsule = new THREE.CapsuleGeometry(1, 1, 28, 42);
  const box = new THREE.BoxGeometry(1, 1, 1);

  add(body, new THREE.CylinderGeometry(0.48, 0.68, 1.12, 40), materials.jacket, [0, -0.05, -0.34], [1, 1, 0.3]);
  add(body, new THREE.CylinderGeometry(0.68, 0.58, 0.22, 40), materials.jacket, [0, 0.48, -0.34], [1, 1, 0.28]);
  add(body, capsule, materials.jacket, [-0.68, -0.14, -0.32], [0.11, 0.5, 0.11], [0.16, 0, 0.28]);
  add(body, capsule, materials.jacket, [0.68, -0.14, -0.32], [0.11, 0.5, 0.11], [0.16, 0, -0.28]);
  add(body, capsule, materials.skinWarm, [-0.76, -0.54, -0.28], [0.09, 0.1, 0.09]);
  add(body, capsule, materials.skinWarm, [0.76, -0.54, -0.28], [0.09, 0.1, 0.09]);
  add(body, new THREE.ConeGeometry(0.2, 0.7, 4), materials.shirt, [0, 0.02, -0.08], [1, 1, 0.12], [0, Math.PI / 4, Math.PI]);
  add(body, new THREE.ConeGeometry(0.09, 0.48, 4), materials.accent, [0, -0.06, 0], [1, 1, 0.12], [0, Math.PI / 4, Math.PI]);
  add(body, cylinder, materials.skin, [0, 0.72, -0.12], [0.15, 0.22, 0.15]);

  add(head, sphere, materials.skin, [0, 1.55, 0.18], [0.5, 0.6, 0.47]);
  add(head, sphere, materials.skinWarm, [-0.4, 1.52, 0.2], [0.09, 0.12, 0.07]);
  add(head, sphere, materials.skinWarm, [0.4, 1.52, 0.2], [0.09, 0.12, 0.07]);
  add(head, sphere, materials.hair, [0, 1.84, 0.12], [0.52, 0.22, 0.48]);
  add(head, sphere, materials.hair, [-0.18, 1.93, 0.29], [0.32, 0.11, 0.17], [0, 0, -0.24]);
  add(head, sphere, materials.hair, [0.17, 1.92, 0.29], [0.3, 0.1, 0.17], [0, 0, 0.2]);
  add(head, sphere, materials.hair, [-0.48, 1.66, 0.14], [0.08, 0.23, 0.16], [0, 0, -0.18]);
  add(head, sphere, materials.hair, [0.48, 1.66, 0.14], [0.08, 0.23, 0.16], [0, 0, 0.18]);

  const leftEye = add(head, sphere, materials.eye, [-0.17, 1.6, 0.62], [0.04, 0.03, 0.024]);
  const rightEye = add(head, sphere, materials.eye, [0.17, 1.6, 0.62], [0.04, 0.03, 0.024]);
  add(head, box, materials.hair, [-0.17, 1.71, 0.62], [0.14, 0.02, 0.018], [0, 0, -0.16]);
  add(head, box, materials.hair, [0.17, 1.71, 0.62], [0.14, 0.02, 0.018], [0, 0, 0.16]);
  const mouth = add(head, box, materials.mouth, [0, 1.4, 0.65], [0.16, 0.022, 0.022]);
  add(head, sphere, materials.skinWarm, [0, 1.51, 0.67], [0.06, 0.1, 0.035]);
  const eyeBaseScale = { x: 0.04, y: 0.03, z: 0.024 };
  const mouthBaseScale = { x: 0.16, y: 0.022, z: 0.022 };

  const baseRing = add(root, new THREE.TorusGeometry(1.22, 0.018, 8, 96), materials.teal, [0, -0.9, -0.08], [1, 0.22, 1], [Math.PI / 2, 0, 0]);
  const haloRing = add(root, new THREE.TorusGeometry(1.62, 0.01, 8, 128), materials.glow, [0, 0.7, -0.32], [1, 1.12, 1], [0.08, 0.05, 0]);

  const particles = Array.from({ length: 15 }, (_, index) => {
    const angle = (index / 15) * Math.PI * 2;
    const radius = 1.18 + (index % 4) * 0.15;
    const dot = add(root, lowSphere, index % 3 === 0 ? materials.accent : materials.teal, [Math.cos(angle) * radius, 0.32 + (index % 5) * 0.34, Math.sin(angle) * 0.28 - 0.18], [0.022, 0.022, 0.022]);
    dot.userData = { angle, radius, speed: 0.36 + index * 0.014, y: dot.position.y };
    return dot;
  });

  scene.add(new THREE.HemisphereLight(0xffffff, 0x141622, 1.8));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(2.4, 3.5, 4.2);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xff4d9a, 2.1);
  rimLight.position.set(-2.6, 1.6, 2);
  scene.add(rimLight);
  const tealLight = new THREE.PointLight(0x31d6c8, 2.4, 5);
  tealLight.position.set(0, 0.3, 2.3);
  scene.add(tealLight);

  let usingRealModel = false;
  const loader = new GLTFLoader();
  loader.load(
    MODEL_URL,
    (gltf) => {
      const source = gltf.scene;
      source.traverse((child) => {
        if (!child.isMesh) return;
        child.frustumCulled = false;
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) child.material.side = THREE.DoubleSide;
      });

      const box = new THREE.Box3().setFromObject(source);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      if (!size.y) return;

      const normalized = new THREE.Group();
      source.position.set(-center.x, -box.min.y, -center.z);
      normalized.scale.setScalar(3.25 / size.y);
      normalized.add(source);
      realModel.add(normalized);
      realModel.visible = true;
      usingRealModel = true;
      canvas.dataset.avatarModel = "real";
      stage.classList.add("has-real-model");
      lastWidth = 0;
      resize();
    },
    undefined,
    () => {
      canvas.dataset.avatarModel = "fallback";
      stage.classList.remove("has-real-model");
    }
  );

  let currentState = "idle";
  let reactUntil = 0;
  let lastWidth = 0;
  let lastHeight = 0;
  const clock = new THREE.Clock();

  function resize() {
    const boxRect = stage.getBoundingClientRect();
    const width = Math.max(1, Math.round(boxRect.width));
    const height = Math.max(1, Math.round(boxRect.height));
    if (width === lastWidth && height === lastHeight) return;
    lastWidth = width;
    lastHeight = height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const compact = width > height * 1.45;
    camera.position.z = compact ? (usingRealModel ? 3.05 : 5.45) : usingRealModel ? 7 : 6.1;
    camera.position.y = compact ? (usingRealModel ? 2.02 : 1.12) : usingRealModel ? 1.2 : 1.45;
    camera.updateProjectionMatrix();
  }

  function setState(state = "idle", duration = 0) {
    currentState = state;
    if (state === "speaking" || state === "touched") reactUntil = performance.now() + Math.max(duration, 900);
  }

  stage.addEventListener("avatar-state", (event) => setState(event.detail?.state, event.detail?.duration));
  stage.addEventListener("pointerdown", () => {
    reactUntil = performance.now() + 720;
    currentState = "touched";
  });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);

  if (fallback) fallback.hidden = true;
  resize();
  canvas.classList.add("is-ready");

  function animate() {
    const elapsed = clock.getElapsedTime();
    const now = performance.now();
    const isReacting = now < reactUntil;
    const isSpeaking = currentState === "speaking" || (isReacting && currentState === "touched");
    const isThinking = currentState === "thinking";
    const compact = lastWidth > lastHeight * 1.45;

    resize();
    body.visible = !usingRealModel && !compact;
    head.visible = !usingRealModel;
    realModel.visible = usingRealModel;
    baseRing.visible = !usingRealModel && !compact;
    haloRing.visible = !usingRealModel && !compact;
    particles.forEach((dot) => {
      dot.visible = !usingRealModel && !compact;
    });
    breathGroup.scale.y = 1 + Math.sin(elapsed * 2.1) * 0.018;
    root.rotation.y = Math.sin(elapsed * 0.55) * 0.12 + (isReacting ? Math.sin(elapsed * 12) * 0.035 : 0);
    realModel.rotation.y = -Math.PI / 2 + Math.sin(elapsed * 0.42) * 0.045;
    root.position.y = usingRealModel
      ? compact
        ? -4.28
        : -1.62 + Math.sin(elapsed * 1.5) * 0.025
      : compact
        ? -0.86
        : -0.08 + Math.sin(elapsed * 1.5) * 0.025;
    root.scale.setScalar(usingRealModel ? (compact ? 2 : 1) : compact ? 1.14 : 1);
    head.rotation.y = Math.sin(elapsed * 0.82) * 0.08;
    head.rotation.x = Math.sin(elapsed * 0.7) * 0.035 + (isThinking ? -0.045 : 0);
    body.rotation.z = Math.sin(elapsed * 0.64) * 0.018;

    const blink = Math.sin(elapsed * 2.2) > 0.982 ? 0.16 : 1;
    leftEye.scale.set(eyeBaseScale.x, eyeBaseScale.y * blink, eyeBaseScale.z);
    rightEye.scale.set(eyeBaseScale.x, eyeBaseScale.y * blink, eyeBaseScale.z);
    mouth.scale.set(
      mouthBaseScale.x * (isSpeaking ? 0.82 + Math.abs(Math.sin(elapsed * 9)) * 0.42 : 1),
      mouthBaseScale.y * (isSpeaking ? 0.9 + Math.abs(Math.sin(elapsed * 15)) * 1.6 : 1),
      mouthBaseScale.z
    );

    baseRing.rotation.z = elapsed * 0.16;
    haloRing.rotation.y = elapsed * 0.22;
    haloRing.rotation.z = Math.sin(elapsed * 0.6) * 0.1;
    tealLight.intensity = 2.2 + Math.sin(elapsed * (isSpeaking ? 8 : 2.2)) * (isSpeaking ? 0.8 : 0.28);
    rimLight.intensity = isThinking ? 2.8 : isSpeaking ? 3.4 : 2.1;

    particles.forEach((dot, index) => {
      const data = dot.userData;
      const angle = data.angle + elapsed * data.speed;
      dot.position.x = Math.cos(angle) * data.radius;
      dot.position.z = Math.sin(angle) * 0.35 - 0.18;
      dot.position.y = data.y + Math.sin(elapsed * 1.4 + index) * 0.05;
      const pulse = 1 + Math.sin(elapsed * 3.8 + index) * 0.28;
      dot.scale.setScalar(0.022 * pulse * (isThinking ? 1.3 : 1));
    });

    camera.lookAt(0, usingRealModel ? (compact ? 1.58 : 0.35) : compact ? 0.78 : 0.86, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
