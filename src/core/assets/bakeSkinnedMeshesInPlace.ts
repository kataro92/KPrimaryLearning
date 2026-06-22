import * as THREE from 'three';

const _bind = new THREE.Vector3();
const _vert = new THREE.Vector3();
const _skinned = new THREE.Vector3();
const _boneMat = new THREE.Matrix4();
const _skinMat = new THREE.Matrix4();

/**
 * Bake Tripo / rigged SkinnedMesh nodes into static Mesh nodes (rest pose).
 * Parent rotation then works like procedural geometry.
 */
export function bakeSkinnedMeshesInPlace(root: THREE.Object3D): number {
  const skinned: THREE.SkinnedMesh[] = [];
  root.traverse((node) => {
    if (node instanceof THREE.SkinnedMesh) skinned.push(node);
  });

  let baked = 0;
  for (const src of skinned) {
    if (!src.skeleton || !src.geometry.attributes.skinIndex || !src.geometry.attributes.skinWeight) continue;

    src.skeleton.pose();
    src.skeleton.update();
    src.updateMatrixWorld(true);

    const geo = src.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const skinIndex = geo.attributes.skinIndex as THREE.BufferAttribute;
    const skinWeight = geo.attributes.skinWeight as THREE.BufferAttribute;
    const boneMatrices = src.skeleton.boneMatrices;
    if (!boneMatrices) continue;
    const bakedPos = new Float32Array(posAttr.count * 3);

    for (let i = 0; i < posAttr.count; i++) {
      _bind.set(0, 0, 0);
      _vert.fromBufferAttribute(posAttr, i);

      for (let j = 0; j < 4; j++) {
        const w = skinWeight.getComponent(i, j);
        if (w === 0) continue;
        const bi = skinIndex.getComponent(i, j);
        _boneMat.fromArray(boneMatrices, bi * 16);
        _skinMat.multiplyMatrices(_boneMat, src.bindMatrix);
        _skinned.copy(_vert).applyMatrix4(_skinMat);
        _bind.addScaledVector(_skinned, w);
      }

      bakedPos[i * 3] = _bind.x;
      bakedPos[i * 3 + 1] = _bind.y;
      bakedPos[i * 3 + 2] = _bind.z;
    }

    const bakedGeo = geo.clone();
    bakedGeo.deleteAttribute('skinIndex');
    bakedGeo.deleteAttribute('skinWeight');
    bakedGeo.setAttribute('position', new THREE.BufferAttribute(bakedPos, 3));
    bakedGeo.computeVertexNormals();

    const rawMats = Array.isArray(src.material) ? src.material : [src.material];
    const mats = rawMats.map((m) => m.clone());
    const mesh = new THREE.Mesh(bakedGeo, mats.length === 1 ? mats[0]! : mats);
    mesh.name = src.name;
    mesh.castShadow = src.castShadow;
    mesh.receiveShadow = src.receiveShadow;
    mesh.position.copy(src.position);
    mesh.quaternion.copy(src.quaternion);
    mesh.scale.copy(src.scale);

    const parent = src.parent;
    if (!parent) continue;
    parent.add(mesh);
    parent.remove(src);

    src.geometry.dispose();
    rawMats.forEach((m) => m.dispose());
    baked++;
  }

  return baked;
}
