import * as THREE from 'three';
import { skinProfileForObject } from './objectSkins';
import { propTextureLibrary, type SkinId } from './textureLibrary';

type MeshRole = 'glass' | 'metal' | 'accent' | 'secondary' | 'primary';

function classifyMaterial(mat: THREE.MeshStandardMaterial, mesh: THREE.Mesh): MeshRole {
  if (mat.transparent && mat.opacity < 0.92) return 'glass';
  if (mat.metalness >= 0.45) return 'metal';

  const hsl = { h: 0, s: 0, l: 0 };
  mat.color.getHSL(hsl);
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());
  const volume = size.x * size.y * size.z;

  if (hsl.l > 0.78 && hsl.s > 0.45 && volume < 0.08) return 'accent';
  if (mat.emissiveIntensity > 0.22 && hsl.s > 0.35 && volume < 0.12) return 'accent';
  return 'primary';
}

function pickSkin(role: MeshRole, profile: ReturnType<typeof skinProfileForObject>): SkinId {
  if (role === 'secondary' && profile.secondary) return profile.secondary;
  if (role === 'metal') return 'metal';
  return profile.primary;
}

/** Gắn ảnh vật liệu thật (CC0) + họa tiết lên mesh sau khi dựng hình. */
export function applyObjectSkins(root: THREE.Group, objectId: string): void {
  if (!propTextureLibrary.isReady()) return;

  const profile = skinProfileForObject(objectId);
  let secondaryUsed = false;

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const old = obj.material;
    if (!(old instanceof THREE.MeshStandardMaterial)) return;

    const role = classifyMaterial(old, obj);
    let next: THREE.MeshStandardMaterial;

    if (role === 'glass') {
      next = propTextureLibrary.createGlassMaterial(old);
    } else if (role === 'accent') {
      next = propTextureLibrary.createAccentMaterial(old);
    } else if (role === 'metal') {
      next = propTextureLibrary.createMetalMaterial(old, obj);
    } else if (profile.secondary && !secondaryUsed && role === 'primary') {
      const hsl = { h: 0, s: 0, l: 0 };
      old.color.getHSL(hsl);
      if (hsl.l > 0.55 || hsl.s < 0.25) {
        next = propTextureLibrary.createSkinnedMaterial(profile.secondary, old, obj);
        secondaryUsed = true;
      } else {
        next = propTextureLibrary.createSkinnedMaterial(pickSkin(role, profile), old, obj);
      }
    } else {
      next = propTextureLibrary.createSkinnedMaterial(pickSkin(role, profile), old, obj);
    }

    obj.material = next;
    old.dispose();
  });
}
