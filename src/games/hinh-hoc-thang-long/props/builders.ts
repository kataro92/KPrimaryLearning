import * as THREE from 'three';
import { C, MatBag } from './materials';
import { box, cone, cyl, disposeGroup, fitProp, mesh } from './helpers';
import { applyObjectSkins } from './skinApplier';

type BuildFn = (g: THREE.Group, m: MatBag) => void;

function glassPane(g: THREE.Group, m: MatBag, w: number, h: number, z: number): void {
  g.add(
    mesh(
      new THREE.BoxGeometry(w, h, 0.06),
      m.std(C.glass, { transparent: true, opacity: 0.82, emissive: 0x0ea5e9, emissiveIntensity: 0.28 }),
      0,
      0,
      z
    )
  );
}

function addMesh(g: THREE.Group, part: THREE.Mesh): void {
  g.add(part);
}

// --- 34 vuông ---
const o001: BuildFn = (g, m) => {
  box(g, m, C.wood, 1.1, 1.1, 0.12);
  glassPane(g, m, 0.78, 0.78, 0.1);
  box(g, m, C.woodLight, 1.2, 0.08, 0.14, 0, -0.58, 0.05);
  box(g, m, C.wood, 0.06, 1.0, 0.08, -0.42, 0, 0.08);
  box(g, m, C.wood, 0.06, 1.0, 0.08, 0.42, 0, 0.08);
};
const o002: BuildFn = (g, m) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      box(g, m, i % 2 ? 0xc48a5a : 0xa16207, 0.42, 0.42, 0.08, -0.63 + i * 0.42, -0.63 + j * 0.42, 0);
    }
  }
};
const o003: BuildFn = (g, m) => {
  box(g, m, 0xf5deb3, 1.0, 1.0, 0.1);
  for (let i = 0; i < 8; i++) {
    box(g, m, i % 2 === 0 ? 0x1c1917 : 0xfef3c7, 0.1, 0.1, 0.12, -0.35 + (i % 4) * 0.23, -0.35 + Math.floor(i / 4) * 0.23, 0.06);
  }
};
const o004: BuildFn = (g, m) => {
  box(g, m, C.gold, 1.15, 1.15, 0.1);
  box(g, m, 0x60a5fa, 0.82, 0.82, 0.06, 0, 0, 0.08);
  box(g, m, C.brown, 0.12, 0.35, 0.08, 0, -0.72, 0.02);
};
const o005: BuildFn = (g, m) => {
  box(g, m, 0x166534, 1.2, 1.2, 0.06, 0, 0, -0.02);
  box(g, m, 0xfef3c7, 0.95, 0.95, 0.22, 0, 0, 0.04);
  box(g, m, 0x854d0e, 0.18, 0.5, 0.04, 0.38, 0.38, 0.16);
};
const o006: BuildFn = (g, m) => {
  box(g, m, 0xdc2626, 1.1, 1.1, 0.06);
  for (let i = 0; i < 5; i++) {
    box(g, m, 0xfbbf24, 0.14, 0.22, 0.04, -0.5 + i * 0.25, 0.52, 0.04);
  }
  box(g, m, 0x7c2d12, 0.08, 0.08, 0.2, 0, 0, 0.08);
};
const o007: BuildFn = (g, m) => {
  box(g, m, 0xbe123c, 0.95, 0.95, 0.95);
  box(g, m, C.gold, 0.12, 0.95, 0.08, 0, 0, 0.52);
  box(g, m, C.gold, 0.95, 0.12, 0.08, 0, 0, 0.52);
  cone(g, m, C.gold, 0.18, 0.22, 0, 0.55, 0.58, 8);
};
const o008: BuildFn = (g, m) => {
  box(g, m, C.white, 1.0, 1.0, 0.08);
  cyl(g, m, C.black, 0.42, 0.42, 0.06, 0, 0, 0.06);
  box(g, m, C.black, 0.04, 0.38, 0.02, 0.12, 0.05, 0.1);
  box(g, m, C.black, 0.04, 0.28, 0.02, -0.08, -0.12, 0.1);
};
const o009: BuildFn = (g, m) => {
  box(g, m, C.gold, 1.05, 1.05, 0.08);
  addMesh(g, mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.04),
    m.std(0xe2e8f0, { metalness: 0.85, roughness: 0.12, emissive: 0x94a3b8, emissiveIntensity: 0.15 }),
    0,
    0,
    0.08
  ));
};
const o010: BuildFn = (g, m) => {
  box(g, m, C.slate, 1.15, 1.15, 0.14);
  box(g, m, 0x64748b, 0.9, 0.9, 0.06, 0, 0, 0.1);
  box(g, m, C.wood, 0.08, 0.35, 0.12, -0.48, 0, 0.12);
  box(g, m, C.wood, 0.08, 0.35, 0.12, 0.48, 0, 0.12);
};
const o011: BuildFn = (g, m) => {
  cyl(g, m, C.white, 0.55, 0.55, 0.08, 0, 0, 0);
  box(g, m, C.blue, 0.95, 0.95, 0.1, 0, 0, 0.06);
  box(g, m, C.white, 0.22, 0.12, 0.16, 0.42, 0.35, 0.08);
};
const o012: BuildFn = (g, m) => {
  box(g, m, 0xd97706, 1.0, 1.0, 0.14);
  for (let i = 0; i < 8; i++) {
    cyl(g, m, 0x451a03, 0.04, 0.04, 0.06, -0.3 + (i % 4) * 0.2, -0.3 + Math.floor(i / 4) * 0.2, 0.1);
  }
};
const o013: BuildFn = (g, m) => {
  box(g, m, C.black, 0.95, 0.95, 0.95);
  const colors = [0xef4444, 0x22c55e, 0x3b82f6, 0xfacc15, 0xffffff, 0xf97316];
  let k = 0;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      box(g, m, colors[k++]!, 0.28, 0.28, 0.02, -0.3 + x * 0.3, -0.3 + y * 0.3, 0.5);
    }
  }
};
const o014: BuildFn = (g, m) => {
  box(g, m, 0xfef08a, 1.1, 1.1, 0.08);
  box(g, m, C.white, 0.75, 0.75, 0.04, 0, 0, 0.06);
  cyl(g, m, C.slate, 0.35, 0.35, 0.12, 0, 0, -0.08);
};
const o015: BuildFn = (g, m) => {
  box(g, m, 0x78350f, 1.05, 1.05, 0.12);
  for (let i = 0; i < 6; i++) {
    box(g, m, 0x5c3d1e, 0.14, 0.95, 0.02, -0.42 + i * 0.17, 0, 0.08);
  }
  box(g, m, 0xfef3c7, 0.2, 0.2, 0.04, 0.42, 0.42, 0.08);
};
const o016: BuildFn = (g, m) => {
  box(g, m, C.slate, 1.15, 1.15, 0.1);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      box(g, m, 0x1d4ed8, 0.24, 0.32, 0.04, -0.38 + i * 0.26, -0.32 + j * 0.32, 0.08);
    }
  }
  box(g, m, C.white, 0.08, 0.5, 0.08, 0.52, 0, 0.06);
};
const o017: BuildFn = (g, m) => {
  box(g, m, C.wood, 1.0, 1.2, 0.1);
  addMesh(g, mesh(new THREE.TorusGeometry(0.42, 0.06, 8, 16, Math.PI), m.std(C.gold), 0, 0.48, 0.08, Math.PI, 0, 0));
  glassPane(g, m, 0.65, 0.75, 0.08);
};
const o018: BuildFn = (g, m) => {
  box(g, m, 0xf0abfc, 0.95, 0.95, 0.2);
  addMesh(g, mesh(
    new THREE.BoxGeometry(0.88, 0.88, 0.04),
    m.std(0xe9d5ff, { metalness: 0.35, roughness: 0.25 }),
    0,
    0,
    0.12
  ));
};
const o019: BuildFn = (g, m) => {
  cyl(g, m, 0xd6d3d1, 0.5, 0.5, 0.06, 0, 0, 0);
  box(g, m, 0xa8a29e, 0.9, 0.9, 0.08, 0, 0, 0.04);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    box(g, m, 0x78716c, 0.06, 0.14, 0.04, Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0.06);
  }
};
const o020: BuildFn = (g, m) => {
  box(g, m, 0xfde68a, 1.0, 1.0, 0.1);
  box(g, m, 0x84cc16, 0.9, 0.9, 0.06, 0, 0, 0.08);
  box(g, m, 0xfbbf24, 0.85, 0.85, 0.06, 0, 0, 0.14);
  box(g, m, 0xb45309, 0.88, 0.88, 0.05, 0, 0, 0.2);
};
const o021: BuildFn = (g, m) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const c = (i + j) % 2 ? 0xe7e5e4 : 0xd6d3d1;
      box(g, m, c, 0.35, 0.35, 0.08, -0.35 + i * 0.35, -0.35 + j * 0.35, 0);
      if ((i + j) % 2 === 0) {
        box(g, m, 0xa8a29e, 0.12, 0.12, 0.1, -0.35 + i * 0.35, -0.35 + j * 0.35, 0.06);
      }
    }
  }
};
const o022: BuildFn = (g, m) => {
  box(g, m, C.purple, 0.95, 0.95, 0.04, 0, 0, 0);
  box(g, m, C.yellow, 0.7, 0.7, 0.06, 0.08, 0.08, 0.04);
  box(g, m, C.purple, 0.3, 0.95, 0.02, 0.42, 0, 0.02);
  addMesh(g, mesh(new THREE.ConeGeometry(0.15, 0.2, 3), m.std(C.pink), 0.35, 0.35, 0.08));
};
const o023: BuildFn = (g, m) => {
  box(g, m, C.white, 0.9, 0.9, 0.9);
  const dots = [[0, 0], [0.25, 0.25], [-0.25, 0.25], [0.25, -0.25], [-0.25, -0.25]];
  dots.forEach(([x, y]) => cyl(g, m, C.black, 0.06, 0.06, 0.08, x, y, 0.48));
};
const o024: BuildFn = (g, m) => {
  cyl(g, m, C.white, 0.55, 0.55, 0.04, 0, -0.35, 0);
  box(g, m, 0xf5f5f4, 0.85, 0.85, 0.18, 0, 0.05, 0);
  box(g, m, 0x86efac, 0.12, 0.12, 0.04, 0.28, 0.28, 0.12);
};
const o025: BuildFn = (g, m) => {
  box(g, m, C.slate, 1.0, 1.0, 0.18);
  addMesh(g, mesh(
    new THREE.BoxGeometry(0.88, 0.88, 0.08),
    m.std(C.glass, { transparent: true, opacity: 0.55 }),
    0,
    0,
    0.06
  ));
  box(g, m, C.green, 0.12, 1.0, 0.06, 0.5, 0, 0.06);
};
const o026: BuildFn = (g, m) => {
  box(g, m, 0x2563eb, 1.1, 1.1, 0.06);
  box(g, m, 0x1d4ed8, 0.75, 0.75, 0.08, 0.15, 0.15, 0.04);
  box(g, m, C.white, 0.18, 0.18, 0.04, -0.35, -0.35, 0.06);
};
const o027: BuildFn = (g, m) => {
  box(g, m, 0xfef08a, 0.95, 0.95, 0.2);
  for (let i = 0; i < 5; i++) {
    cyl(g, m, 0xfbbf24, 0.05, 0.05, 0.12, -0.25 + i * 0.12, 0.1, 0.12);
  }
};
const o028: BuildFn = (g, m) => {
  for (let i = 0; i < 5; i++) {
    box(g, m, i % 2 ? C.woodLight : C.wood, 0.95, 0.16, 0.08, 0, -0.4 + i * 0.2, 0);
  }
  box(g, m, C.wood, 1.0, 0.08, 0.1, 0, 0.48, 0);
};
const o029: BuildFn = (g, m) => {
  cyl(g, m, C.cream, 0.48, 0.48, 0.22, 0, 0, 0);
  addMesh(g, mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.04, 24),
    m.std(0xb45309, { transparent: true, opacity: 0.75 }),
    0,
    0.1,
    0.12
  ));
};
const o030: BuildFn = (g, m) => {
  box(g, m, C.red, 0.95, 0.95, 0.35);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      cyl(g, m, C.yellow, 0.07, 0.07, 0.08, -0.32 + i * 0.22, -0.32 + j * 0.22, 0.2);
    }
  }
};
const o031: BuildFn = (g, m) => {
  box(g, m, C.woodLight, 1.1, 1.1, 0.1);
  for (const [x, z] of [
    [-0.45, -0.45],
    [0.45, -0.45],
    [-0.45, 0.45],
    [0.45, 0.45],
  ]) {
    box(g, m, C.wood, 0.1, 0.55, 0.1, x, -0.55, z);
  }
};
const o032: BuildFn = (g, m) => {
  box(g, m, C.slate, 1.05, 1.05, 0.06);
  addMesh(g, mesh(
    new THREE.BoxGeometry(0.95, 0.95, 0.04),
    m.std(0xf0f9ff, { transparent: true, opacity: 0.45 }),
    0,
    0,
    0.05
  ));
  box(g, m, C.white, 0.08, 0.4, 0.06, 0, 0.52, 0.04);
};
const o033: BuildFn = (g, m) => {
  cyl(g, m, 0xfde68a, 0.5, 0.5, 0.12, 0, 0, 0);
  box(g, m, 0xb45309, 0.95, 0.95, 0.1, 0, 0.08, 0);
  box(g, m, 0x84cc16, 0.9, 0.9, 0.06, 0, 0.1, 0.08);
  box(g, m, 0xfef3c7, 0.88, 0.88, 0.05, 0, 0.12, 0.14);
};
const o034: BuildFn = (g, m) => {
  box(g, m, C.wood, 1.15, 1.15, 0.12);
  box(g, m, 0x1c1917, 0.95, 0.95, 0.06, 0, 0, 0.08);
  for (let i = 0; i < 9; i++) {
    box(g, m, i % 2 ? 0xfef3c7 : 0x1c1917, 0.08, 0.08, 0.02, -0.28 + (i % 3) * 0.28, -0.28 + Math.floor(i / 3) * 0.28, 0.1);
  }
};

// --- 33 chữ nhật ---
const o035: BuildFn = (g, m) => {
  box(g, m, C.brick, 0.2, 1.1, 0.5, -0.75, 0, 0);
  box(g, m, C.brick, 0.2, 1.1, 0.5, 0.75, 0, 0);
  box(g, m, C.brick, 1.5, 0.25, 0.45, 0, 0.35, 0);
  box(g, m, C.wood, 0.85, 0.95, 0.1, 0, -0.05, 0.28);
  addMesh(g, mesh(new THREE.TorusGeometry(0.38, 0.06, 8, 14, Math.PI), m.std(C.gold), 0, 0.42, 0.32, Math.PI, 0, 0));
};
const o036: BuildFn = (g, m) => {
  box(g, m, C.wood, 1.8, 0.28, 0.32);
  for (let i = 0; i < 4; i++) {
    cyl(g, m, C.slate, 0.04, 0.04, 0.08, -0.65 + i * 0.45, 0.08, 0.18);
  }
};
const o037: BuildFn = (g, m) => {
  cyl(g, m, C.slate, 0.06, 0.06, 0.9, 0, -0.45, 0);
  box(g, m, C.blue, 1.2, 0.75, 0.08, 0, 0.35, 0);
  box(g, m, C.white, 0.95, 0.55, 0.04, 0, 0.35, 0.06);
  box(g, m, C.yellow, 0.35, 0.35, 0.06, 0, 0.35, 0.1);
};
const o038: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.0, 16, 1, true), m.std(C.brick), 0, 0, 0));
  for (let i = 0; i < 3; i++) {
    box(g, m, 0x1c1917, 0.35, 0.12, 0.36, 0, -0.25 + i * 0.25, 0);
  }
};
const o039: BuildFn = (g, m) => {
  box(g, m, C.woodLight, 1.6, 0.12, 0.9);
  box(g, m, C.wood, 1.55, 0.08, 0.85, 0, 0.06, 0.02);
  box(g, m, C.slate, 0.12, 0.35, 0.5, -0.72, -0.2, 0);
  box(g, m, C.black, 0.08, 0.06, 0.06, 0.5, 0.02, 0.48);
};
const o040: BuildFn = (g, m) => {
  box(g, m, C.yellow, 1.7, 0.22, 0.35);
  for (let i = 0; i < 16; i++) {
    box(g, m, C.black, 0.02, 0.08, 0.02, -0.75 + i * 0.1, 0.06, 0.18);
  }
  box(g, m, C.black, 0.12, 0.12, 0.04, 0.75, 0, 0.14);
};
const o041: BuildFn = (g, m) => {
  box(g, m, C.wood, 0.12, 1.15, 0.55);
  box(g, m, C.woodLight, 0.08, 1.05, 0.48, 0.08, 0, 0.04);
  cyl(g, m, C.gold, 0.06, 0.06, 0.12, 0.18, 0, 0.32);
  box(g, m, C.glass, 0.06, 0.35, 0.06, 0.18, 0.35, 0.28);
};
const o042: BuildFn = (g, m) => {
  box(g, m, C.blue, 1.35, 0.42, 0.55);
  box(g, m, C.black, 1.2, 0.06, 0.5, 0, 0.12, 0.02);
  for (let i = 0; i < 5; i++) {
    cyl(g, m, C.yellow, 0.04, 0.04, 0.35, -0.4 + i * 0.2, 0, 0.1);
  }
};
const o043: BuildFn = (g, m) => {
  box(g, m, 0xfde68a, 1.5, 0.42, 0.38);
  box(g, m, 0xd97706, 1.45, 0.08, 0.36, 0, 0.06, 0);
  for (let i = 0; i < 5; i++) {
    box(g, m, 0xb45309, 0.06, 0.06, 0.04, -0.55 + i * 0.28, 0.1, 0.2);
  }
};
const o044: BuildFn = (g, m) => {
  box(g, m, C.cream, 1.25, 0.75, 0.06);
  for (let i = 0; i < 4; i++) {
    box(g, m, C.slate, 0.85, 0.06, 0.02, 0, -0.22 + i * 0.14, 0.05);
  }
  box(g, m, C.red, 0.18, 0.18, 0.04, -0.45, 0.22, 0.06);
};
const o045: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.BoxGeometry(0.75, 1.1, 0.55), m.std(C.white), 0.2, 0, 0, 0, 0.5, 0));
  addMesh(g, mesh(new THREE.BoxGeometry(0.75, 1.1, 0.55), m.std(C.white), -0.2, 0, 0, 0, -0.5, 0));
  box(g, m, C.blue, 0.5, 0.5, 0.06, 0, 0.35, 0.3);
};
const o046: BuildFn = (g, m) => {
  box(g, m, C.woodLight, 1.35, 0.18, 0.75);
  box(g, m, C.wood, 0.22, 0.12, 0.35, 0.65, 0, 0);
  for (let i = 0; i < 4; i++) {
    box(g, m, 0xa16207, 0.2, 0.04, 0.02, -0.45 + i * 0.3, 0.05, 0.38);
  }
};
const o047: BuildFn = (g, m) => {
  box(g, m, C.slate, 1.5, 0.35, 0.55);
  for (let i = 0; i < 4; i++) {
    box(g, m, [C.red, C.blue, C.green, C.yellow][i]!, 0.12, 0.55, 0.38, -0.55 + i * 0.18, 0.12, 0.05);
  }
};
const o048: BuildFn = (g, m) => {
  box(g, m, C.wood, 1.75, 0.22, 0.4);
  for (let i = 0; i < 6; i++) {
    box(g, m, 0x5c3d1e, 0.08, 0.1, 0.06, -0.6 + i * 0.24, 0.06, 0.2);
  }
};
const o049: BuildFn = (g, m) => {
  cyl(g, m, C.slate, 0.28, 0.28, 0.55, -0.35, 0, 0);
  cyl(g, m, C.slate, 0.28, 0.28, 0.55, 0.35, 0, 0);
  box(g, m, C.black, 0.35, 0.95, 0.35, 0, 0, 0);
  box(g, m, C.yellow, 0.2, 0.2, 0.04, 0, 0.35, 0.2);
};
const o050: BuildFn = (g, m) => {
  box(g, m, C.cream, 1.2, 0.08, 0.85);
  box(g, m, C.red, 1.15, 0.75, 0.06, 0, 0.06, 0.02);
  cyl(g, m, C.slate, 0.04, 0.04, 0.82, -0.58, 0.04, 0);
  for (let i = 0; i < 5; i++) {
    box(g, m, C.slate, 0.9, 0.04, 0.02, 0, -0.28 + i * 0.14, 0.05);
  }
};
const o051: BuildFn = (g, m) => {
  cyl(g, m, 0x84cc16, 0.1, 0.1, 1.6);
  for (let i = 0; i < 5; i++) {
    box(g, m, 0x65a30d, 0.14, 0.14, 0.12, 0, -0.55 + i * 0.28, 0);
  }
};
const o052: BuildFn = (g, m) => {
  box(g, m, 0xfef3c7, 1.3, 0.08, 0.7);
  box(g, m, 0xe7e5e4, 1.25, 0.06, 0.65, 0, 0.05, 0.02);
  box(g, m, C.green, 0.35, 0.35, 0.06, 0.35, 0, 0.36);
};
const o053: BuildFn = (g, m) => {
  box(g, m, C.red, 1.5, 0.12, 0.45);
  box(g, m, C.wood, 0.08, 0.08, 1.1, 0, 0, 0);
  box(g, m, C.yellow, 0.35, 0.35, 0.04, 0, 0.45, 0.35);
};
const o054: BuildFn = (g, m) => {
  cyl(g, m, 0xf472b6, 0.35, 0.35, 0.55, -0.45, 0, 0);
  box(g, m, 0xec4899, 1.1, 0.55, 0.55, 0.15, 0, 0);
  box(g, m, C.white, 0.12, 0.12, 0.12, 0.55, 0.2, 0.2);
};
const o055: BuildFn = (g, m) => {
  box(g, m, 0xfde68a, 1.15, 0.38, 0.42);
  box(g, m, 0xfbbf24, 1.05, 0.08, 0.38, 0, 0.06, 0);
  box(g, m, 0x84cc16, 0.2, 0.2, 0.06, 0.42, 0.08, 0.22);
};
const o056: BuildFn = (g, m) => {
  box(g, m, 0x14532d, 1.45, 0.85, 0.08);
  box(g, m, C.white, 0.35, 0.08, 0.06, -0.35, 0.15, 0.06);
  cyl(g, m, C.white, 0.04, 0.04, 0.35, 0.45, -0.2, 0.08);
};
const o057: BuildFn = (g, m) => {
  box(g, m, C.slate, 1.4, 0.35, 0.5);
  for (let i = 0; i < 4; i++) {
    cyl(g, m, C.cream, 0.12, 0.1, 0.12, -0.45 + i * 0.3, 0.12, 0.08);
  }
};
const o058: BuildFn = (g, m) => {
  box(g, m, C.white, 0.65, 0.95, 0.06);
  box(g, m, C.red, 0.55, 0.75, 0.04, 0, 0, 0.05);
  box(g, m, C.black, 0.2, 0.28, 0.04, -0.15, -0.2, 0.06);
};
const o059: BuildFn = (g, m) => {
  addMesh(g, mesh(
    new THREE.BoxGeometry(1.4, 0.08, 0.55),
    m.std(0x94a3b8, { metalness: 0.75, roughness: 0.22 }),
    0,
    0,
    0
  ));
  for (let i = 0; i < 4; i++) {
    cyl(g, m, C.slate, 0.04, 0.04, 0.06, -0.45 + i * 0.3, 0, 0.32);
  }
};
const o060: BuildFn = (g, m) => {
  box(g, m, C.orange, 1.25, 0.75, 0.55);
  box(g, m, C.black, 0.35, 0.08, 0.06, 0, 0.28, 0.3);
  box(g, m, C.yellow, 0.15, 0.15, 0.06, -0.45, 0.2, 0.3);
};
const o061: BuildFn = (g, m) => {
  box(g, m, C.white, 0.12, 0.12, 0.35, 0, 0, 0);
  addMesh(g, mesh(new THREE.BoxGeometry(1.2, 0.08, 0.35), m.std(C.slate), 0, 0, 0, 0, 0, 0.4));
  for (let i = 0; i < 3; i++) {
    box(g, m, C.slate, 0.35, 0.06, 0.28, 0, 0, 0.15 + i * 0.12);
  }
};
const o062: BuildFn = (g, m) => {
  box(g, m, 0xfef3c7, 1.35, 0.1, 0.65);
  for (let i = 0; i < 8; i++) {
    box(g, m, 0xe7e5e4, 0.12, 0.06, 0.04, -0.5 + i * 0.14, 0.04, 0.06);
  }
  box(g, m, 0x86efac, 0.25, 0.25, 0.06, 0.45, 0, 0.06);
};
const o063: BuildFn = (g, m) => {
  box(g, m, C.black, 1.15, 0.42, 0.38);
  for (let i = 0; i < 6; i++) {
    box(g, m, C.slate, 0.14, 0.1, 0.06, -0.38 + (i % 3) * 0.38, -0.08 + Math.floor(i / 3) * 0.16, 0.22);
  }
  box(g, m, C.red, 0.18, 0.08, 0.04, 0, 0.12, 0.22);
};
const o064: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.BoxGeometry(1.4, 0.14, 0.25), m.std(C.slate, { metalness: 0.6 }), 0, 0, 0, 0, 0, 0.5));
  box(g, m, C.slate, 0.18, 0.18, 0.35, 0.55, 0, 0.1);
};
const o065: BuildFn = (g, m) => {
  box(g, m, C.cream, 1.1, 0.72, 0.06);
  box(g, m, C.red, 0.22, 0.14, 0.04, -0.4, 0.25, 0.05);
  box(g, m, C.yellow, 0.22, 0.14, 0.04, -0.4, 0.25, 0.09);
  for (let i = 0; i < 3; i++) {
    box(g, m, C.slate, 0.75, 0.05, 0.02, 0, -0.2 + i * 0.14, 0.05);
  }
};
const o066: BuildFn = (g, m) => {
  box(g, m, C.green, 0.08, 0.08, 0.65, 0, 0, 0);
  addMesh(g, mesh(new THREE.BoxGeometry(0.55, 0.06, 0.35), m.std(0x86efac, { transparent: true, opacity: 0.7 }), -0.35, 0, 0.1));
  addMesh(g, mesh(new THREE.BoxGeometry(0.55, 0.06, 0.35), m.std(0x4ade80, { transparent: true, opacity: 0.7 }), 0.35, 0, 0.1));
};
const o067: BuildFn = (g, m) => {
  for (let i = 0; i < 3; i++) {
    box(g, m, C.wood, 1.35, 0.1, 0.55, 0, -0.2 + i * 0.2, 0);
    box(g, m, C.woodLight, 0.08, 0.45, 0.52, -0.62, -0.2 + i * 0.2, 0);
    box(g, m, C.woodLight, 0.08, 0.45, 0.52, 0.62, -0.2 + i * 0.2, 0);
  }
};

// --- 33 tam giác ---
const o068: BuildFn = (g, m) => {
  box(g, m, C.brick, 1.4, 0.18, 0.65, 0, -0.42, 0);
  cone(g, m, C.tile, 1.05, 0.75, 0, 0.42, 0, 4);
  for (let i = 0; i < 5; i++) {
    box(g, m, C.tile, 0.22, 0.08, 0.35, -0.5 + i * 0.25, 0.55, 0.05);
  }
};
const o069: BuildFn = (g, m) => {
  cyl(g, m, C.wood, 0.05, 0.05, 1.0, 0.55, 0, 0);
  addMesh(g, mesh(new THREE.ConeGeometry(0.55, 0.65, 3), m.std(C.red), -0.2, 0.15, 0, Math.PI, 0, 0));
  box(g, m, C.yellow, 0.12, 0.12, 0.04, -0.05, 0.42, 0.1);
};
const o070: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.BoxGeometry(0.5, 0.5, 0.45), m.std(0x475569), 0.35, 0, 0, 0, 0, -0.6));
  addMesh(g, mesh(new THREE.ConeGeometry(0.55, 0.55, 3), m.std(0xfca5a5), -0.25, 0.1, 0, 0, 0.8, 0));
};
const o071: BuildFn = (g, m) => {
  box(g, m, C.wood, 0.08, 0.55, 0.08, -0.35, -0.15, 0);
  addMesh(g, mesh(new THREE.ConeGeometry(0.75, 0.95, 3), m.std(C.white), 0.15, 0.2, 0, 0, -0.9, 0));
  box(g, m, C.brown, 0.04, 0.35, 0.04, 0.05, 0.45, 0.15);
};
const o072: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.85, 0.12, 32), m.std(0xfde68a), 0, -0.15, 0, Math.PI / 2, 0, 0));
  addMesh(g, mesh(new THREE.ConeGeometry(0.8, 0.7, 32, 1, false, 0, Math.PI * 0.42), m.std(0xef4444), 0, 0.15, 0, 0, 0, 0));
  for (let i = 0; i < 4; i++) {
    cyl(g, m, C.yellow, 0.05, 0.05, 0.04, -0.15 + i * 0.1, 0.35, 0.25);
  }
};
const o073: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.7, 0.7, 3), m.std(C.yellow, { transparent: true, opacity: 0.5 }), 0, 0, 0, 0, 0, Math.PI));
  box(g, m, C.slate, 0.08, 0.75, 0.08, -0.42, 0, 0);
  for (let i = 0; i < 6; i++) {
    box(g, m, C.black, 0.02, 0.12, 0.02, -0.35, -0.3 + i * 0.12, 0.05);
  }
};
const o074: BuildFn = (g, m) => {
  box(g, m, C.gold, 1.2, 0.2, 0.7, 0, -0.45, 0);
  cone(g, m, C.tile, 0.55, 0.45, -0.35, 0.65, 0, 4);
  cone(g, m, C.tile, 0.55, 0.45, 0.35, 0.65, 0, 4);
  cone(g, m, C.tile, 0.75, 0.55, 0, 0.85, 0, 4);
};
const o075: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.9, 0.35, 3), m.std(0x1e3a8a), 0, 0, 0, 0, 0, Math.PI));
  box(g, m, C.white, 0.65, 0.08, 0.35, 0, -0.05, 0.05);
};
const o076: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.85, 0.55, 32, 1, true), m.std(0xfef3c7), 0, 0.1, 0, 0, 0, 0));
  box(g, m, C.brown, 0.65, 0.06, 0.65, 0, -0.05, 0);
  box(g, m, C.red, 0.12, 0.35, 0.04, 0.35, -0.15, 0.15);
};
const o077: BuildFn = (g, m) => {
  box(g, m, C.brick, 1.3, 0.15, 0.5, 0, -0.35, 0);
  addMesh(g, mesh(new THREE.ConeGeometry(0.95, 0.55, 3), m.std(0x38bdf8), 0, 0.35, 0.2, 0, 0, Math.PI));
  for (let i = 0; i < 4; i++) {
    box(g, m, C.white, 0.18, 0.06, 0.02, -0.35 + i * 0.24, 0.52, 0.22);
  }
};
const o078: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.75, 0.65, 32, 1, false, 0, Math.PI * 0.5), m.std(0xfde68a), 0.2, 0, 0, 0, -0.8, 0));
  box(g, m, 0x84cc16, 0.5, 0.06, 0.35, 0.05, 0.05, 0);
  box(g, m, 0xb45309, 0.48, 0.05, 0.32, 0.05, 0.1, 0.02);
};
const o079: BuildFn = (g, m) => {
  box(g, m, 0xd6d3d1, 1.1, 0.18, 1.1, 0, -0.5, 0);
  cone(g, m, 0xfbbf24, 0.85, 0.95, 0, 0.55, 0, 4);
};
const o080: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.65, 0.75, 3), m.std(C.red), 0, 0.1, 0, 0, 0, Math.PI));
  box(g, m, C.yellow, 0.08, 0.55, 0.06, 0, -0.35, 0);
  for (const x of [-0.2, 0, 0.2]) {
    box(g, m, C.pink, 0.12, 0.12, 0.04, x, -0.55, 0.1);
  }
};
const o081: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.75, 0.55, 32, 1, false, 0, Math.PI * 0.55), m.std(0xfef08a), 0.15, 0, 0, 0, -0.6, 0));
  for (let i = 0; i < 4; i++) {
    cyl(g, m, 0xfbbf24, 0.05, 0.05, 0.08, 0.05 + i * 0.08, 0.15, 0.2);
  }
};
const o082: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.8, 0.75, 3), m.std(C.red), 0, 0.1, 0, 0, 0, Math.PI));
  box(g, m, C.white, 0.12, 0.45, 0.06, 0, -0.05, 0.05);
  box(g, m, C.black, 0.08, 0.25, 0.04, 0, 0.12, 0.08);
};
const o083: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.9, 0.85, 4), m.std(C.orange), 0, 0.2, 0, 0, 0, Math.PI));
  box(g, m, C.slate, 0.08, 0.08, 0.45, 0.45, -0.35, 0);
  cyl(g, m, C.slate, 0.04, 0.04, 0.25, 0.45, -0.55, 0);
};
const o084: BuildFn = (g, m) => {
  box(g, m, C.slate, 0.35, 0.12, 0.55, -0.25, 0, 0);
  addMesh(g, mesh(new THREE.ConeGeometry(0.75, 0.35, 3), m.std(0x94a3b8, { metalness: 0.5 }), 0.2, 0.05, 0, 0, -0.5, 0.3));
  cone(g, m, C.blue, 0.12, 0.35, 0.35, 0.05, 0, 8);
};
const o085: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.7, 0.6, 32, 1, false, 0, Math.PI * 0.45), m.std(0xfbcfe8), 0.1, 0, 0, 0, -0.7, 0));
  for (let i = 0; i < 3; i++) {
    cyl(g, m, C.red, 0.06, 0.06, 0.05, 0.15 + i * 0.1, 0.2, 0.22);
  }
};
const o086: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.75, 0.5, 3), m.std(0xfecaca), 0, 0, 0, 0, 0.6, 0));
  box(g, m, C.white, 0.35, 0.12, 0.4, 0, -0.12, 0);
  box(g, m, 0x22d3ee, 0.2, 0.08, 0.35, 0, 0.05, 0.05);
};
const o087: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.95, 0.9, 4), m.std(C.orange), 0, 0.25, 0, 0, 0, Math.PI));
  box(g, m, C.brown, 0.08, 0.08, 0.5, 0.42, -0.35, 0);
};
const o088: BuildFn = (g, m) => {
  box(g, m, C.wood, 0.85, 0.15, 0.35, 0, -0.35, 0);
  addMesh(g, mesh(new THREE.ConeGeometry(0.7, 0.85, 3), m.std(C.white), 0.1, 0.25, 0.1, 0, -0.8, 0.2));
  box(g, m, C.brown, 0.04, 0.4, 0.04, -0.15, 0.35, 0.05);
};
const o089: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.65, 0.55, 3), m.std(0x78716c), 0.15, 0, 0, 0, 0.5, 0));
  box(g, m, C.wood, 0.12, 0.45, 0.12, -0.35, -0.1, 0);
};
const o090: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.55, 0.45, 32, 1, false, 0, Math.PI * 0.4), m.std(0xf97316), 0, 0, 0, 0, -0.5, 0.4));
  box(g, m, C.yellow, 0.08, 0.08, 0.06, 0.15, 0.2, 0.28);
};
const o091: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.6, 0.5, 3), m.std(0xbae6fd), 0.1, 0, 0, 0, 0.4, 0));
  addMesh(g, mesh(new THREE.SphereGeometry(0.12, 12, 12), m.std(C.white, { transparent: true, opacity: 0.65 }), 0.25, 0.25, 0.2));
};
const o092: BuildFn = (g, m) => {
  box(g, m, C.wood, 1.2, 0.12, 0.45, 0, -0.3, 0);
  addMesh(g, mesh(new THREE.ConeGeometry(0.9, 0.5, 3), m.std(0xfde047), 0, 0.35, 0.15, 0, 0, Math.PI));
};
const o093: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.45, 0.55, 3), m.std(C.wood), 0, 0.15, 0, 0, 0, Math.PI));
  box(g, m, C.slate, 0.35, 0.12, 0.35, 0, -0.2, 0);
  box(g, m, C.black, 0.04, 0.35, 0.04, 0.2, 0.15, 0.05);
};
const o094: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.85, 0.4, 3), m.std(0x60a5fa), 0.15, 0.05, 0, 0, -0.4, 0.5));
  box(g, m, C.slate, 0.5, 0.1, 0.35, -0.15, -0.05, 0);
};
const o095: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.75, 0.7, 3), m.std(C.white), 0, 0.1, 0, 0, 0, Math.PI));
  box(g, m, 0x1c1917, 0.55, 0.08, 0.45, 0, -0.05, 0.05);
  box(g, m, 0x166534, 0.12, 0.35, 0.04, 0, 0.15, 0.1);
};
const o096: BuildFn = (g, m) => {
  box(g, m, C.brick, 1.2, 0.15, 0.55, 0, -0.38, 0);
  for (let i = 0; i < 4; i++) {
    cone(g, m, C.tile, 0.22, 0.28, -0.35 + i * 0.22, 0.35 + i * 0.08, 0, 4);
  }
};
const o097: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.7, 0.55, 3), m.std(C.woodLight), 0.1, 0, 0, 0, 0.55, 0));
  box(g, m, C.wood, 0.12, 0.4, 0.12, -0.32, -0.05, 0);
};
const o098: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.85, 0.75, 3), m.std(C.red), 0, 0.15, 0, 0, 0, Math.PI));
  box(g, m, C.gold, 0.18, 0.12, 0.04, 0, 0.42, 0.08);
  box(g, m, C.black, 0.08, 0.08, 0.04, -0.08, 0.35, 0.08);
  box(g, m, C.black, 0.08, 0.08, 0.04, 0.08, 0.35, 0.08);
};
const o099: BuildFn = (g, m) => {
  addMesh(g, mesh(new THREE.ConeGeometry(0.65, 0.45, 32, 1, false, 0, Math.PI * 0.35), m.std(0xfbbf24), 0, 0, 0, 0, -0.4, 0.35));
  box(g, m, 0xb45309, 0.12, 0.08, 0.3, 0.1, 0.05, 0);
};
const o100: BuildFn = (g, m) => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.45, -0.35);
  shape.lineTo(0.45, -0.35);
  shape.lineTo(0, 0.45);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: false });
  const part = mesh(geo, m.std(0xa855f7, { emissive: 0x7c3aed, emissiveIntensity: 0.2 }));
  g.add(part);
  box(g, m, C.gold, 0.08, 0.55, 0.08, -0.42, 0, 0);
};

const BUILDERS: Record<string, BuildFn> = {
  o001, o002, o003, o004, o005, o006, o007, o008, o009, o010,
  o011, o012, o013, o014, o015, o016, o017, o018, o019, o020,
  o021, o022, o023, o024, o025, o026, o027, o028, o029, o030,
  o031, o032, o033, o034, o035, o036, o037, o038, o039, o040,
  o041, o042, o043, o044, o045, o046, o047, o048, o049, o050,
  o051, o052, o053, o054, o055, o056, o057, o058, o059, o060,
  o061, o062, o063, o064, o065, o066, o067, o068, o069, o070,
  o071, o072, o073, o074, o075, o076, o077, o078, o079, o080,
  o081, o082, o083, o084, o085, o086, o087, o088, o089, o090,
  o091, o092, o093, o094, o095, o096, o097, o098, o099, o100,
};

export function buildObjectProp(objectId: string): THREE.Group {
  const g = new THREE.Group();
  const m = new MatBag();
  const fn = BUILDERS[objectId] ?? BUILDERS.o001;
  fn(g, m);
  applyObjectSkins(g, objectId);
  fitProp(g);
  (g as THREE.Group & { __matBag?: MatBag }).__matBag = m;
  return g;
}

export function disposeObjectProp(group: THREE.Group): void {
  const bag = (group as THREE.Group & { __matBag?: MatBag }).__matBag;
  bag?.dispose();
  disposeGroup(group);
}
