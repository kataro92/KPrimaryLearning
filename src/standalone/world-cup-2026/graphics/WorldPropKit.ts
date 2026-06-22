import * as THREE from 'three';
import { buildPitchLayerStack } from './pitchLayers';
import { makeCrowdNoiseTexture, makeFlagTexture, makeSkyStadiumTexture } from './ProceduralTextures';
import { STANDS_NY_CENTER } from './sceneConstants';

export interface WorldLayers {
  bgFar: THREE.Group;
  bgMid: THREE.Group;
  playfield: THREE.Group;
  fgProps: THREE.Group;
  pitchStack: THREE.Group;
  pitchGrassLayer: THREE.Mesh;
  pitchMarkingsLayer: THREE.Group;
  /** @deprecated use pitchGrassLayer */
  pitchPlane: THREE.Mesh;
  contactShadowPlane: THREE.Mesh;
  crowdCards: THREE.InstancedMesh | null;
  skyMesh: THREE.Mesh;
  usesSkyArt: boolean;
  usesGrassArt: boolean;
}

export interface OptionalWorldTextureMaps {
  sky?: THREE.Texture;
  grass?: THREE.Texture;
}

export interface BuildWorldOptions {
  normToWorld: (nx: number, ny: number) => THREE.Vector3;
  flagColors: [string, string, string];
  optionalTextures?: OptionalWorldTextureMaps;
  /** WebGL max anisotropy for pitch grass (default 1). */
  grassAnisotropy?: number;
}

export function buildWorldLayers(opts: BuildWorldOptions): WorldLayers {
  const bgFar = new THREE.Group();
  const bgMid = new THREE.Group();
  const playfield = new THREE.Group();
  const fgProps = new THREE.Group();

  const skyArt = opts.optionalTextures?.sky;
  const skyTex = skyArt ?? makeSkyStadiumTexture();
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: skyTex,
      depthWrite: false,
      fog: !skyArt,
    })
  );
  sky.name = 'wc-sky-backdrop';
  sky.renderOrder = -30;
  bgFar.add(sky);

  let crowdCards: THREE.InstancedMesh | null = null;
  if (skyArt) {
    buildBannerStrip(bgMid, opts.flagColors, opts.normToWorld);
  } else {
    buildStadiumRoof(bgMid);
    crowdCards = buildCrowdInstanced(bgMid);
    buildStandTiers(bgMid, opts.flagColors);
    buildFloodlights(bgMid);
    buildBannerStrip(bgMid, opts.flagColors, opts.normToWorld);
  }

  const standsCenterY = opts.normToWorld(0.5, STANDS_NY_CENTER).y;
  bgMid.position.y = standsCenterY - 0.85;

  const pitchLayers = buildPitchLayerStack(
    opts.normToWorld,
    opts.optionalTextures?.grass,
    opts.grassAnisotropy ?? 1
  );
  playfield.add(pitchLayers.root);

  buildForegroundProps(fgProps, opts.normToWorld, opts.flagColors);

  return {
    bgFar,
    bgMid,
    playfield,
    fgProps,
    pitchStack: pitchLayers.root,
    pitchGrassLayer: pitchLayers.grassLayer,
    pitchMarkingsLayer: pitchLayers.markingsLayer,
    pitchPlane: pitchLayers.grassLayer,
    contactShadowPlane: pitchLayers.contactShadow,
    crowdCards,
    skyMesh: sky,
    usesSkyArt: Boolean(skyArt),
    usesGrassArt: Boolean(opts.optionalTextures?.grass),
  };
}

function buildStadiumRoof(group: THREE.Group): void {
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.65, metalness: 0.15 });
  const arch = new THREE.Mesh(new THREE.TorusGeometry(9, 0.35, 8, 32, Math.PI), roofMat);
  arch.position.set(0, 1.8, -1.2);
  arch.rotation.z = Math.PI;
  group.add(arch);
  const beamL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 8), roofMat);
  beamL.position.set(-8, 2.2, -0.8);
  const beamR = beamL.clone();
  beamR.position.x = 8;
  group.add(beamL, beamR);
}

function buildStandTiers(group: THREE.Group, flag: [string, string, string]): void {
  const tierMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75, metalness: 0.08 });
  for (let tier = 0; tier < 4; tier++) {
    const tierGeo = new THREE.BoxGeometry(22 - tier * 1.2, 0.55, 1.2 - tier * 0.15);
    const mesh = new THREE.Mesh(tierGeo, tierMat);
    mesh.position.set(0, 0.35 + tier * 0.52, -1.4 - tier * 0.35);
    mesh.receiveShadow = true;
    group.add(mesh);
    const seatColors = [flag[0], flag[1], flag[2], '#64748b'];
    const seatMat = new THREE.MeshStandardMaterial({
      color: seatColors[tier % seatColors.length] as unknown as number,
      roughness: 0.82,
      metalness: 0.02,
    });
    try {
      seatMat.color.set(seatColors[tier % seatColors.length]!);
    } catch {
      seatMat.color.set(0x64748b);
    }
    for (let s = 0; s < 18; s++) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.35), seatMat);
      seat.position.set(-8.5 + s * 1, 0.62 + tier * 0.52, -1.1 - tier * 0.35);
      group.add(seat);
    }
  }
}

function buildCrowdInstanced(group: THREE.Group): THREE.InstancedMesh {
  const count = 120;
  const geo = new THREE.PlaneGeometry(0.35, 0.55);
  const mat = new THREE.MeshStandardMaterial({
    map: makeCrowdNoiseTexture(),
    transparent: true,
    opacity: 0.85,
    roughness: 0.95,
    metalness: 0,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    dummy.position.set(-10 + (i % 20) * 1.05, 0.55 + Math.floor(i / 20) * 0.48, -1.6 - Math.floor(i / 20) * 0.2);
    dummy.scale.setScalar(0.85 + Math.random() * 0.3);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  group.add(mesh);
  return mesh;
}

function buildFloodlights(group: THREE.Group): void {
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.4, roughness: 0.45 });
  for (const x of [-9.5, 9.5]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8), poleMat);
    pole.position.set(x, 1.6, -0.6);
    pole.castShadow = true;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.35), poleMat);
    head.position.set(x, 3.15, -0.55);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfff7ed, emissive: 0xfbbf24, emissiveIntensity: 1.2 })
    );
    bulb.position.set(x, 3.05, -0.45);
    const spot = new THREE.SpotLight(0xfff7ed, 0.35, 14, Math.PI / 5, 0.4);
    spot.position.set(x, 3.1, -0.4);
    spot.target.position.set(x * 0.2, 0, 0);
    group.add(pole, head, bulb, spot, spot.target);
  }
}

function buildBannerStrip(
  group: THREE.Group,
  colors: [string, string, string],
  normToWorld: (nx: number, ny: number) => THREE.Vector3
): void {
  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 0.22),
    new THREE.MeshBasicMaterial({ map: makeFlagTexture(colors) })
  );
  banner.position.copy(normToWorld(0.5, 0.04));
  banner.position.z = 0.25;
  group.add(banner);
}

function buildForegroundProps(
  group: THREE.Group,
  normToWorld: (nx: number, ny: number) => THREE.Vector3,
  colors: [string, string, string]
): void {
  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.018, 0.55, 6),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.35, roughness: 0.4 })
  );
  const corner = normToWorld(0.06, 0.92);
  flagPole.position.set(corner.x, corner.y + 0.2, 0.15);
  flagPole.castShadow = true;
  const miniFlag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.14),
    new THREE.MeshBasicMaterial({ map: makeFlagTexture(colors), side: THREE.DoubleSide })
  );
  miniFlag.position.set(corner.x + 0.08, corner.y + 0.42, 0.16);
  group.add(flagPole, miniFlag);
}

export function pulseCrowd(crowd: THREE.InstancedMesh | null, t: number, intensity: number): void {
  if (!crowd) return;
  const mat = crowd.material as THREE.MeshStandardMaterial;
  mat.emissive.setHex(0xffffff);
  mat.emissiveIntensity = intensity * (0.15 + Math.sin(t * 18) * 0.1);
}

export function updateBannerColors(group: THREE.Group, colors: [string, string, string]): void {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const mat = child.material as THREE.MeshBasicMaterial;
    if (mat.map && child.geometry instanceof THREE.PlaneGeometry) {
      const h = (child.geometry as THREE.PlaneGeometry).parameters.height;
      if (h === 0.22 || h === 0.14) {
        mat.map = makeFlagTexture(colors);
        mat.needsUpdate = true;
      }
    }
  });
}
