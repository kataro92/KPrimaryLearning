import * as THREE from 'three';
import { HORIZON_Y } from './sceneConstants';

let fabricTexCache: THREE.CanvasTexture | null = null;

export function getFabricTexture(): THREE.CanvasTexture {
  if (fabricTexCache) return fabricTexCache;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#909090';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.strokeStyle = `rgba(255,255,255,${y % 8 === 0 ? 0.1 : 0.05})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let x = 0; x < canvas.width; x += 4) {
    ctx.strokeStyle = `rgba(0,0,0,${x % 8 === 0 ? 0.07 : 0.035})`;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  fabricTexCache = new THREE.CanvasTexture(canvas);
  fabricTexCache.wrapS = THREE.RepeatWrapping;
  fabricTexCache.wrapT = THREE.RepeatWrapping;
  fabricTexCache.repeat.set(2.5, 2.5);
  fabricTexCache.colorSpace = THREE.SRGBColorSpace;
  return fabricTexCache;
}

export function makeFlagTexture(colors: [string, string, string]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  const sw = canvas.width / 3;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * sw, 0, sw, canvas.height);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const stripeW = canvas.width / 14;
  for (let i = 0; i < 14; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#15803d' : '#1a7f37';
    ctx.fillRect(i * stripeW, 0, stripeW, canvas.height);
  }
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const h = 3 + Math.random() * 10;
    ctx.strokeStyle = `rgba(${60 + Math.random() * 40},${140 + Math.random() * 60},${50 + Math.random() * 30},${0.15 + Math.random() * 0.2})`;
    ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - h);
    ctx.stroke();
  }
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(74, 222, 128, ${0.06 + Math.random() * 0.1})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 8 + Math.random() * 12);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeGrassNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 0.88 + Math.random() * 0.12;
    img.data[i] = 128 + (Math.random() - 0.5) * 30;
    img.data[i + 1] = 128 + (Math.random() - 0.5) * 30;
    img.data[i + 2] = Math.floor(255 * n);
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  return tex;
}

export function makeSkyStadiumTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const horizon = Math.floor(canvas.height * HORIZON_Y);
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, '#0c4a6e');
  sky.addColorStop(0.35, '#0369a1');
  sky.addColorStop(0.72, '#38bdf8');
  sky.addColorStop(1, '#7dd3fc');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, horizon);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.06})`;
    ctx.beginPath();
    ctx.ellipse(Math.random() * canvas.width, Math.random() * horizon * 0.7, 40 + Math.random() * 80, 12 + Math.random() * 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeCrowdNoiseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const v = 40 + Math.random() * 80;
      const hue = Math.random() > 0.5 ? `rgb(${v},${v * 0.9},${v * 1.1})` : `rgb(${v * 1.2},${v * 0.7},${v * 0.8})`;
      ctx.fillStyle = hue;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeBallPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const pentR = 36;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      const cx = col * 64 + 32 + (row % 2) * 32;
      const cy = row * 80 + 48;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const px = cx + Math.cos(a) * pentR;
        const py = cy + Math.sin(a) * pentR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 42, 0);
    ctx.lineTo(i * 42 + 20, canvas.height);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
