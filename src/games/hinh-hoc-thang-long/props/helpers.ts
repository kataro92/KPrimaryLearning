import * as THREE from 'three';
import type { MatBag } from './materials';

export function mesh(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  return m;
}

export function box(
  g: THREE.Group,
  m: MatBag,
  color: number,
  w: number,
  h: number,
  d: number,
  x = 0,
  y = 0,
  z = 0,
  opts?: Partial<THREE.MeshStandardMaterialParameters>
): THREE.Mesh {
  const part = mesh(new THREE.BoxGeometry(w, h, d), m.std(color, opts), x, y, z);
  g.add(part);
  return part;
}

export function cyl(
  g: THREE.Group,
  m: MatBag,
  color: number,
  rt: number,
  rb: number,
  h: number,
  x = 0,
  y = 0,
  z = 0,
  seg = 16
): THREE.Mesh {
  const part = mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m.std(color), x, y, z);
  g.add(part);
  return part;
}

export function cone(
  g: THREE.Group,
  m: MatBag,
  color: number,
  r: number,
  h: number,
  x = 0,
  y = 0,
  z = 0,
  sides = 4
): THREE.Mesh {
  const part = mesh(new THREE.ConeGeometry(r, h, sides), m.std(color), x, y, z);
  g.add(part);
  return part;
}

export function fitProp(group: THREE.Group, target = 1.55): void {
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const max = Math.max(size.x, size.y, size.z, 0.001);
  const s = target / max;
  group.scale.setScalar(s);
  group.position.set(-center.x * s, -center.y * s + 0.08, -center.z * s);
}

export function disposeGroup(group: THREE.Group): void {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      const mat = obj.material;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat.dispose();
    }
  });
}
