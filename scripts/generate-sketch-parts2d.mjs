/**
 * Sinh sketchDraw/parts2d.ts — minh họa 2D riêng cho o001–o100.
 * Chạy: node scripts/generate-sketch-parts2d.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/games/hinh-hoc-thang-long/sketchDraw/parts2d.ts');

/** Mã vẽ canvas (tọa độ ±~70, dùng fill/pen/rect/tri/circle/vnFlag). */
const ART = {
  o001: `fill(ctx,'#b45309');rect(ctx,-55,-55,110,110,4);ctx.fill();pen(ctx,'#78350f');ctx.stroke();fill(ctx,'#bae6fd');rect(ctx,-38,-38,76,76,2);ctx.fill();pen(ctx,'#0ea5e9',1.5);ctx.stroke();pen(ctx,'#92400e');ctx.moveTo(0,-38);ctx.lineTo(0,38);ctx.moveTo(-38,0);ctx.lineTo(38,0);ctx.stroke();`,
  o002: `for(let i=0;i<4;i++)for(let j=0;j<4;j++){fill(ctx,(i+j)%2?'#c48a5a':'#a16207');rect(ctx,-70+i*36,-70+j*36,34,34,2);ctx.fill();pen(ctx,'#78716c',1);ctx.stroke();}`,
  o003: `fill(ctx,'#f5deb3');rect(ctx,-52,-52,104,104,3);ctx.fill();for(let i=0;i<8;i++)for(let j=0;j<8;j++){if((i+j)%2)continue;fill(ctx,'#1c1917');rect(ctx,-44+i*11,-44+j*11,10,10,1);ctx.fill();}`,
  o004: `fill(ctx,'#fbbf24');rect(ctx,-58,-58,116,116,6);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#1d4ed8');rect(ctx,-42,-42,84,84,2);ctx.fill();fill(ctx,'#fef08a');circle(ctx,-18,-12,12);ctx.fill();fill(ctx,'#22c55e');circle(ctx,20,18,14);ctx.fill();`,
  o005: `fill(ctx,'#166534');rect(ctx,-58,-58,116,116,4);ctx.fill();fill(ctx,'#fef3c7');rect(ctx,-40,-40,80,80,2);ctx.fill();pen(ctx,'#eab308',1.5);ctx.strokeRect(-40,-40,80,80);`,
  o006: `fill(ctx,'#dc2626');rect(ctx,-52,-52,104,104,2);ctx.fill();for(let i=0;i<4;i++)for(let j=0;j<4;j++){fill(ctx,(i+j)%2?'#fbbf24':'#b91c1c');rect(ctx,-40+i*20,-40+j*20,18,18,1);ctx.fill();}`,
  o007: `fill(ctx,'#be123c');rect(ctx,-42,-42,84,84,6);ctx.fill();fill(ctx,'#fbbf24');rect(ctx,-4,-42,8,84,0);ctx.fill();rect(ctx,-42,-4,84,8,0);ctx.fill();tri(ctx,-18,-55,18,-55,0,-72);ctx.fillStyle='#fbbf24';ctx.fill();`,
  o008: `fill(ctx,'#f8fafc');circle(ctx,0,0,52);ctx.fill();pen(ctx,'#0f172a',2.5);ctx.stroke();for(let i=0;i<12;i++){const a=i/12*Math.PI*2-Math.PI/2;ctx.beginPath();ctx.moveTo(Math.cos(a)*38,Math.sin(a)*38);ctx.lineTo(Math.cos(a)*46,Math.sin(a)*46);ctx.stroke();}pen(ctx,'#0f172a',3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,28);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(32,4);ctx.stroke();fill(ctx,'#ef4444');circle(ctx,0,0,4);ctx.fill();`,
  o009: `fill(ctx,'#fbbf24');rect(ctx,-55,-55,110,110,4);ctx.fill();fill(ctx,'#e2e8f0');rect(ctx,-40,-40,80,80,2);ctx.fill();pen(ctx,'#94a3b8',1.5);ctx.stroke();`,
  o010: `fill(ctx,'#94a3b8');rect(ctx,-60,-35,120,70,12);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();pen(ctx,'#475569',2);ctx.beginPath();ctx.moveTo(-72,-8);ctx.lineTo(-88,0);ctx.moveTo(72,-8);ctx.lineTo(88,0);ctx.stroke();`,
  o011: `fill(ctx,'#2563eb');rect(ctx,-48,-48,96,96,4);ctx.fill();fill(ctx,'#f8fafc');rect(ctx,-38,-55,76,18,4);ctx.fill();pen(ctx,'#1d4ed8',2);ctx.stroke();fill(ctx,'#dbeafe');circle(ctx,0,-8,22);ctx.fill();`,
  o012: `fill(ctx,'#d97706');circle(ctx,0,0,48);ctx.fill();pen(ctx,'#92400e',2);ctx.stroke();[[-12,-8],[14,6],[-4,18],[22,-14],[-20,12]].forEach(([x,y])=>{fill(ctx,'#451a03');circle(ctx,x,y,5);ctx.fill();});`,
  o013: `fill(ctx,'#0f172a');rect(ctx,-42,-42,84,84,6);ctx.fill();const cols=['#ef4444','#22c55e','#3b82f6','#facc15','#fff','#f97316'];let k=0;for(let x=0;x<3;x++)for(let y=0;y<3;y++){fill(ctx,cols[k++]);rect(ctx,-36+x*24,-36+y*24,20,20,2);ctx.fill();}`,
  o014: `fill(ctx,'#facc15');rect(ctx,-55,-45,110,90,4);ctx.fill();pen(ctx,'#ca8a04',2);ctx.stroke();fill(ctx,'#fef9c3');rect(ctx,-48,-52,24,18,2);ctx.fill();pen(ctx,'#a16207',1.5);for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-35,-20+i*12);ctx.lineTo(40,-20+i*12);ctx.stroke();}`,
  o015: `fill(ctx,'#78350f');rect(ctx,-55,-32,110,64,6);ctx.fill();pen(ctx,'#451a03',2);ctx.stroke();for(let i=0;i<6;i++){pen(ctx,'#451a03',1.5);ctx.beginPath();ctx.moveTo(-45+i*16,-32);ctx.lineTo(-45+i*16,32);ctx.stroke();}fill(ctx,'#a16207');rect(ctx,-55,-32,18,64,2);ctx.fill();`,
  o016: `fill(ctx,'#334155');rect(ctx,-58,-58,116,116,4);ctx.fill();for(let i=0;i<4;i++)for(let j=0;j<3;j++){fill(ctx,'#1d4ed8');rect(ctx,-48+i*26,-40+j*28,22,24,2);ctx.fill();}`,
  o017: `fill(ctx,'#b45309');rect(ctx,-50,-55,100,110,4);ctx.fill();pen(ctx,'#78350f',2);ctx.stroke();fill(ctx,'#bae6fd');tri(ctx,-35,-40,35,-40,0,-55);ctx.fill();pen(ctx,'#0ea5e9',1.5);ctx.stroke();`,
  o018: `fill(ctx,'#7c3aed');ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(48,0);ctx.lineTo(0,52);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#5b21b6',2);ctx.stroke();fill(ctx,'#a78bfa');ctx.beginPath();ctx.moveTo(0,-38);ctx.lineTo(34,0);ctx.lineTo(0,38);ctx.lineTo(-34,0);ctx.closePath();ctx.fill();`,
  o019: `fill(ctx,'#d6d3d1');circle(ctx,0,0,50);ctx.fill();pen(ctx,'#a8a29e',2);ctx.stroke();for(let i=0;i<12;i++){const a=i/12*Math.PI*2;pen(ctx,'#78716c',1);ctx.beginPath();ctx.moveTo(Math.cos(a)*20,Math.sin(a)*20);ctx.lineTo(Math.cos(a)*48,Math.sin(a)*48);ctx.stroke();}`,
  o020: `fill(ctx,'#fbbf24');rect(ctx,-55,-35,110,18,8);ctx.fill();fill(ctx,'#78350f');rect(ctx,-50,-12,100,14,4);ctx.fill();fill(ctx,'#22c55e');rect(ctx,-52,8,104,10,2);ctx.fill();fill(ctx,'#fbbf24');rect(ctx,-55,22,110,16,8);ctx.fill();`,
  o021: `for(let i=0;i<3;i++)for(let j=0;j<3;j++){fill(ctx,(i+j)%2?'#fef3c7':'#c084fc');rect(ctx,-54+i*36,-54+j*36,32,32,3);ctx.fill();pen(ctx,'#7c3aed',1);ctx.stroke();}`,
  o022: `fill(ctx,'#a855f7');rect(ctx,-52,-52,104,104,4);ctx.fill();fill(ctx,'#f3e8ff');tri(ctx,28,-52,52,-52,52,-28);ctx.fill();pen(ctx,'#7c3aed',2);ctx.stroke();pen(ctx,'#6b21a8',1.5);ctx.setLineDash([4,4]);ctx.strokeRect(-50,-50,100,100);ctx.setLineDash([]);`,
  o023: `fill(ctx,'#f8fafc');rect(ctx,-40,-40,80,80,10);ctx.fill();pen(ctx,'#334155',2);ctx.stroke();[[0,0],[18,18],[-18,18],[18,-18],[-18,-18]].forEach(([x,y])=>{fill(ctx,'#0f172a');circle(ctx,x,y,5);ctx.fill();});`,
  o024: `fill(ctx,'#f8fafc');rect(ctx,-50,-50,100,100,4);ctx.fill();pen(ctx,'#cbd5e1',2);ctx.stroke();fill(ctx,'#fafafa');rect(ctx,-35,-25,70,50,6);ctx.fill();pen(ctx,'#e2e8f0',1.5);ctx.stroke();`,
  o025: `fill(ctx,'rgba(186,230,253,0.55)');rect(ctx,-50,-50,100,100,3);ctx.fill();pen(ctx,'#16a34a',4);ctx.strokeRect(-50,-50,100,100);pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-30,-20);ctx.lineTo(25,30);ctx.stroke();`,
  o026: `fill(ctx,'#2563eb');rect(ctx,-28,-55,56,110,8);ctx.fill();fill(ctx,'#1d4ed8');rect(ctx,-18,-48,36,95,6);ctx.fill();fill(ctx,'#fff');rect(ctx,-32,38,18,14,2);ctx.fill();for(let i=0;i<3;i++){fill(ctx,'#fbbf24');rect(ctx,10+i*8,32+i*4,8,12,1);ctx.fill();}`,
  o027: `fill(ctx,'#facc15');rect(ctx,-45,-35,90,70,6);ctx.fill();[[-20,-10],[10,15],[25,-5],[-5,20]].forEach(([x,y])=>{fill(ctx,'#ca8a04');circle(ctx,x,y,7);ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();});`,
  o028: `for(let i=0;i<5;i++){fill(ctx,i%2?'#b45309':'#92400e');rect(ctx,-60,-50+i*20,120,18,2);ctx.fill();pen(ctx,'#78350f',1);ctx.stroke();}`,
  o029: `fill(ctx,'#fef3c7');rect(ctx,-48,-30,96,60,8);ctx.fill();fill(ctx,'#d97706');rect(ctx,-48,-38,96,12,2);ctx.fill();pen(ctx,'#92400e',1.5);ctx.stroke();`,
  o030: `fill(ctx,'#dc2626');rect(ctx,-42,-28,84,56,4);ctx.fill();for(let i=0;i<4;i++)for(let j=0;j<4;j++){fill(ctx,'#facc15');circle(ctx,-28+i*18,-18+j*12,6);ctx.fill();}`,
  o031: `fill(ctx,'#d97706');rect(ctx,-55,-8,110,16,2);ctx.fill();for(const[x]of[[-42],[-14],[14],[42]]){fill(ctx,'#92400e');rect(ctx,x-4,-8,8,45,1);ctx.fill();}`,
  o032: `fill(ctx,'rgba(186,230,253,0.35)');rect(ctx,-55,-40,110,80,3);ctx.fill();pen(ctx,'#38bdf8',2);ctx.strokeRect(-55,-40,110,80);pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-40,-15);ctx.lineTo(35,20);ctx.moveTo(-20,25);ctx.lineTo(45,-10);ctx.stroke();`,
  o033: `fill(ctx,'#fbbf24');rect(ctx,-55,-18,110,36,8);ctx.fill();fill(ctx,'#22c55e');rect(ctx,-50,-6,100,12,2);ctx.fill();fill(ctx,'#ef4444');rect(ctx,-48,6,96,10,2);ctx.fill();`,
  o034: `fill(ctx,'#f5deb3');rect(ctx,-52,-52,104,104,3);ctx.fill();for(let i=0;i<3;i++)for(let j=0;j<3;j++){fill(ctx,(i+j)%2?'#1c1917':'#f5deb3');rect(ctx,-42+i*28,-42+j*28,24,24,1);ctx.fill();}`,
  o035: `fill(ctx,'#b45309');rect(ctx,-70,-50,18,100,2);ctx.fill();rect(ctx,52,-50,18,100,2);ctx.fill();rect(ctx,-70,35,140,18,2);ctx.fill();pen(ctx,'#fbbf24',3);ctx.beginPath();ctx.arc(0,35,35,Math.PI,0);ctx.stroke();`,
  o036: `fill(ctx,'#b45309');rect(ctx,-75,-18,150,36,3);ctx.fill();pen(ctx,'#78350f',2);ctx.stroke();[[-50,-8],[0,8],[50,-8],[25,0]].forEach(([x,y])=>{fill(ctx,'#57534e');circle(ctx,x,y,5);ctx.fill();});`,
  o037: `fill(ctx,'#334155');rect(ctx,-8,-55,16,110,2);ctx.fill();fill(ctx,'#2563eb');rect(ctx,-45,-40,90,55,4);ctx.fill();vnFlag(ctx,-38,-32,76,40);`,
  o038: `fill(ctx,'#d6d3d1');rect(ctx,-55,-35,110,70,4);ctx.fill();pen(ctx,'#a8a29e',2);ctx.stroke();for(const x of[-25,0,25]){fill(ctx,'#fafafa');circle(ctx,x,0,12);ctx.fill();pen(ctx,'#a8a29e',1.5);ctx.stroke();}`,
  o039: `fill(ctx,'#d97706');rect(ctx,-60,-12,120,24,2);ctx.fill();fill(ctx,'#92400e');rect(ctx,35,-8,22,35,2);ctx.fill();for(const x of[-45,-15,15]){fill(ctx,'#78350f');rect(ctx,x-3,-12,6,38,1);ctx.fill();}`,
  o040: `fill(ctx,'#facc15');rect(ctx,-80,-12,160,24,4);ctx.fill();pen(ctx,'#92400e',1.5);ctx.stroke();for(let i=0;i<15;i++){const h=i%5===0?14:8;ctx.beginPath();ctx.moveTo(-72+i*10,-12);ctx.lineTo(-72+i*10,-12+h);ctx.stroke();}`,
  o041: `fill(ctx,'#b45309');rect(ctx,-50,-60,100,120,4);ctx.fill();pen(ctx,'#78350f',2);ctx.stroke();fill(ctx,'#fde68a');circle(ctx,35,0,6);ctx.fill();`,
  o042: `fill(ctx,'#f97316');rect(ctx,-55,-30,110,60,8);ctx.fill();pen(ctx,'#c2410c',2);ctx.stroke();['#ef4444','#22c55e','#3b82f6','#eab308','#a855f7'].forEach((c,i)=>{fill(ctx,c);rect(ctx,-40+i*18,-5,8,45,2);ctx.fill();});`,
  o043: `fill(ctx,'#fbbf24');tri(ctx,-50,35,50,35,0,-40);ctx.fill();pen(ctx,'#d97706',2);ctx.stroke();pen(ctx,'#92400e',1);for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-20+i*12,-15);ctx.lineTo(-15+i*12,10);ctx.stroke();}`,
  o044: `fill(ctx,'#fef9c3');rect(ctx,-50,-60,100,120,4);ctx.fill();pen(ctx,'#ca8a04',2);ctx.stroke();pen(ctx,'#64748b',1.5);for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-38,-35+i*18);ctx.lineTo(38,-35+i*18);ctx.stroke();}`,
  o045: `fill(ctx,'#f8fafc');rect(ctx,-40,-55,80,110,3);ctx.fill();pen(ctx,'#94a3b8',2);ctx.stroke();fill(ctx,'#2563eb');tri(ctx,-40,-55,40,-55,0,-70);ctx.fill();fill(ctx,'#1d4ed8');rect(ctx,-35,-20,70,50,2);ctx.fill();`,
  o046: `fill(ctx,'#b45309');rect(ctx,-55,-35,100,70,6);ctx.fill();pen(ctx,'#78350f',2);ctx.stroke();fill(ctx,'#92400e');rect(ctx,42,-10,18,30,4);ctx.fill();`,
  o047: `fill(ctx,'#94a3b8');rect(ctx,-60,-40,120,80,4);ctx.fill();['#ef4444','#22c55e','#3b82f6','#eab308'].forEach((c,i)=>{fill(ctx,c);rect(ctx,-50+i*26,-28,20,56,2);ctx.fill();});`,
  o048: `fill(ctx,'#d97706');rect(ctx,-60,-40,120,80,3);ctx.fill();pen(ctx,'#92400e',2);ctx.stroke();for(const[x,y]of[[-30,-10],[20,15],[-10,25],[35,-20],[0,0],[50,5]]){fill(ctx,'#78350f');circle(ctx,x,y,5);ctx.fill();}`,
  o049: `fill(ctx,'#fbbf24');rect(ctx,-22,-50,44,100,6);ctx.fill();fill(ctx,'#fbbf24');rect(ctx,-12,-58,24,12,2);ctx.fill();fill(ctx,'#1e293b');circle(ctx,-12,30,8);ctx.fill();circle(ctx,12,30,8);ctx.fill();`,
  o050: `fill(ctx,'#fef3c7');rect(ctx,-45,-55,90,110,4);ctx.fill();pen(ctx,'#d97706',2);ctx.stroke();for(let i=0;i<6;i++){pen(ctx,'#94a3b8',1);ctx.beginPath();ctx.moveTo(-35,-40+i*14);ctx.lineTo(35,-40+i*14);ctx.stroke();}`,
  o051: `fill(ctx,'#84cc16');rect(ctx,-12,-60,24,120,6);ctx.fill();pen(ctx,'#65a30d',2);ctx.stroke();for(let i=0;i<5;i++){pen(ctx,'#4d7c0f',1.5);ctx.beginPath();ctx.moveTo(-12,-48+i*24);ctx.lineTo(12,-48+i*24);ctx.stroke();}`,
  o052: `fill(ctx,'#166534');tri(ctx,-55,40,55,40,-40,-20);ctx.fill();fill(ctx,'#fef3c7');rect(ctx,-45,-25,90,50,2);ctx.fill();pen(ctx,'#d97706',1.5);for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-40+i*18,-20);ctx.lineTo(-35+i*18,15);ctx.stroke();}`,
  o053: `fill(ctx,'#dc2626');rect(ctx,-55,-25,110,50,2);ctx.fill();pen(ctx,'#b91c1c',2);ctx.stroke();pen(ctx,'#78350f',3);ctx.beginPath();ctx.moveTo(0,25);ctx.lineTo(0,58);ctx.stroke();`,
  o054: `fill(ctx,'#f9a8d4');rect(ctx,-35,-55,70,110,12);ctx.fill();pen(ctx,'#db2777',2);ctx.stroke();pen(ctx,'#be185d',1.5);for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(0,-40+i*14,32,0,Math.PI);ctx.stroke();}`,
  o055: `fill(ctx,'#fbbf24');rect(ctx,-55,-22,110,44,10);ctx.fill();pen(ctx,'#d97706',2);ctx.stroke();fill(ctx,'#22c55e');rect(ctx,-45,-8,90,16,2);ctx.fill();`,
  o056: `fill(ctx,'#166534');rect(ctx,-65,-45,130,90,4);ctx.fill();pen(ctx,'#14532d',2);ctx.stroke();fill(ctx,'#f8fafc');[[-40,-10],[-10,15],[25,-5]].forEach(([x,y])=>{rect(ctx,x,y,18,4,1);ctx.fill();});`,
  o057: `fill(ctx,'#cbd5e1');rect(ctx,-58,-38,116,76,6);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let i=0;i<4;i++){fill(ctx,'#f8fafc');circle(ctx,-36+i*24,0,16);ctx.fill();pen(ctx,'#94a3b8',1.5);ctx.stroke();}`,
  o058: `fill(ctx,'#1e40af');rect(ctx,-42,-58,84,116,6);ctx.fill();pen(ctx,'#1e3a8a',2);ctx.stroke();fill(ctx,'#fef2f2');ctx.font='bold 42px system-ui';ctx.textAlign='center';ctx.fillText('A',0,18);`,
  o059: `fill(ctx,'#94a3b8');rect(ctx,-60,-40,120,80,3);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();[[-40,-20],[40,-20],[-40,20],[40,20]].forEach(([x,y])=>{fill(ctx,'#475569');circle(ctx,x,y,6);ctx.fill();});`,
  o060: `fill(ctx,'#ea580c');rect(ctx,-50,-40,100,80,6);ctx.fill();pen(ctx,'#c2410c',2);ctx.stroke();pen(ctx,'#9a3412',3);ctx.beginPath();ctx.moveTo(-25,-40);ctx.lineTo(-25,-55);ctx.lineTo(25,-55);ctx.lineTo(25,-40);ctx.stroke();`,
  o061: `pen(ctx,'#64748b',2);ctx.beginPath();ctx.arc(0,15,8,0,Math.PI*2);ctx.stroke();for(let i=0;i<3;i++){const a=i/3*Math.PI*2;ctx.beginPath();ctx.ellipse(Math.cos(a)*8,15+Math.sin(a)*8,42,14,a,0,Math.PI*2);ctx.fillStyle='#94a3b8';ctx.fill();pen(ctx,'#475569',1.5);ctx.stroke();}`,
  o062: `fill(ctx,'#f8fafc');rect(ctx,-65,-30,130,60,4);ctx.fill();pen(ctx,'#e2e8f0',2);ctx.stroke();pen(ctx,'#cbd5e1',1);for(let i=0;i<14;i++){ctx.beginPath();ctx.moveTo(-55+i*8,-25);ctx.quadraticCurveTo(-50+i*8,5,-45+i*8,25);ctx.stroke();}`,
  o063: `fill(ctx,'#1e293b');rect(ctx,-55,-30,110,60,10);ctx.fill();for(let i=0;i<6;i++){fill(ctx,'#64748b');circle(ctx,-35+i*14,0,5);ctx.fill();}`,
  o064: `pen(ctx,'#64748b',4);ctx.beginPath();ctx.moveTo(-55,35);ctx.lineTo(45,-35);ctx.stroke();pen(ctx,'#475569',3);ctx.beginPath();ctx.moveTo(45,-35);ctx.lineTo(58,-42);ctx.lineTo(52,-28);ctx.closePath();ctx.fillStyle='#94a3b8';ctx.fill();`,
  o065: `fill(ctx,'#fef9c3');rect(ctx,-50,-60,100,120,4);ctx.fill();vnFlag(ctx,-38,-35,76,45);pen(ctx,'#64748b',1.5);for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-35,15+i*14);ctx.lineTo(35,15+i*14);ctx.stroke();}`,
  o066: `pen(ctx,'#0ea5e9',2);ctx.beginPath();ctx.moveTo(0,40);ctx.lineTo(0,-30);ctx.stroke();fill(ctx,'rgba(125,211,252,0.5)');[[-35,-20],[35,-20],[-28,-5],[28,-5]].forEach(([x,y])=>{ctx.beginPath();ctx.ellipse(x,y,22,8,0,0,Math.PI*2);ctx.fill();});`,
  o067: `for(let t=0;t<3;t++){fill(ctx,'#b45309');rect(ctx,-55,-45+t*28,110,22,2);ctx.fill();pen(ctx,'#78350f',1);ctx.stroke();}`,
  o068: `for(let i=0;i<5;i++){fill(ctx,'#b91c1c');rect(ctx,-60+i*8,-20+i*6,28,14,2);ctx.fill();}`,
  o069: `vnFlag(ctx,-55,-38,110,76);pen(ctx,'#64748b',2);ctx.beginPath();ctx.moveTo(-55,-38);ctx.lineTo(-55,50);ctx.stroke();`,
  o070: `fill(ctx,'#fca5a5');tri(ctx,-55,50,55,50,0,-45);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();`,
  o071: `fill(ctx,'#a16207');rect(ctx,-15,-40,30,80,3);ctx.fill();fill(ctx,'#f8fafc');tri(ctx,-10,-35,55,-10,-10,25);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();`,
  o072: `fill(ctx,'#fbbf24');tri(ctx,-55,45,55,45,0,-50);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#ef4444');[[-15,-5],[20,10],[-5,25]].forEach(([x,y])=>{circle(ctx,x,y,8);ctx.fill();});`,
  o073: `fill(ctx,'#facc15');tri(ctx,-50,45,50,45,0,-45);ctx.fill();pen(ctx,'#92400e',2);ctx.stroke();for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(-35+i*10,45);ctx.lineTo(-35+i*10,20);ctx.stroke();}`,
  o074: `for(let t=0;t<3;t++){fill(ctx,'#b91c1c');tri(ctx,-55+t*6,40-t*8,55-t*6,40-t*8,0,-35+t*12);ctx.fill();}fill(ctx,'#fbbf24');circle(ctx,0,-38,8);ctx.fill();`,
  o075: `fill(ctx,'#0ea5e9');tri(ctx,-55,25,10,25,0,-35);ctx.fill();fill(ctx,'#38bdf8');tri(ctx,10,25,55,25,0,-35);ctx.fill();pen(ctx,'#0369a1',2);ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(0,30);ctx.stroke();`,
  o076: `fill(ctx,'#d4d4d8');tri(ctx,-55,30,55,30,0,-35);ctx.fill();pen(ctx,'#a1a1aa',2);ctx.stroke();fill(ctx,'#dc2626');rect(ctx,-55,25,110,8,2);ctx.fill();`,
  o077: `fill(ctx,'#f97316');tri(ctx,-65,40,65,40,0,-30);ctx.fill();for(let i=0;i<6;i++){fill(ctx,i%2?'#fff':'#fdba74');rect(ctx,-60+i*20,-25,18,55,0);ctx.fill();}`,
  o078: `fill(ctx,'#fbbf24');tri(ctx,-55,45,55,45,0,-50);ctx.fill();pen(ctx,'#d97706',2);ctx.stroke();fill(ctx,'#22c55e');rect(ctx,-20,5,40,25,2);ctx.fill();pen(ctx,'#78350f',2);ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(0,45);ctx.stroke();`,
  o079: `fill(ctx,'#fbbf24');tri(ctx,-60,50,60,50,0,-55);ctx.fill();pen(ctx,'#d97706',2);for(let i=0;i<5;i++){const y=50-i*18;ctx.beginPath();ctx.moveTo(-60+i*12,y);ctx.lineTo(60-i*12,y);ctx.stroke();}`,
  o080: `pen(ctx,'#dc2626',2);ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(0,40);ctx.stroke();for(let i=0;i<3;i++){fill(ctx,i%2?'#f472b6':'#fbbf24');circle(ctx,-12+i*12,45+i*5,8);ctx.fill();}fill(ctx,'#fecaca');tri(ctx,-25,-45,25,-45,0,-55);ctx.fill();`,
  o081: `fill(ctx,'#facc15');tri(ctx,-50,45,50,45,0,-40);ctx.fill();[[-15,10],[5,25],[20,5]].forEach(([x,y])=>{fill(ctx,'#ca8a04');circle(ctx,x,y,6);ctx.fill();});`,
  o082: `fill(ctx,'#dc2626');tri(ctx,-50,50,50,50,0,-45);ctx.fill();fill(ctx,'#fff');rect(ctx,-6,-15,12,30,2);ctx.fill();fill(ctx,'#fff');circle(ctx,0,28,6);ctx.fill();`,
  o083: `fill(ctx,'#ea580c');tri(ctx,-65,45,65,45,0,-50);ctx.fill();pen(ctx,'#9a3412',2);ctx.stroke();pen(ctx,'#78350f',2);ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(0,45);ctx.stroke();`,
  o084: `fill(ctx,'#94a3b8');tri(ctx,-60,30,60,30,0,-40);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#475569');rect(ctx,-15,25,30,18,2);ctx.fill();`,
  o085: `fill(ctx,'#fce7f3');tri(ctx,-50,45,50,45,0,-45);ctx.fill();pen(ctx,'#db2777',2);ctx.stroke();['#ef4444','#3b82f6','#22c55e'].forEach((c,i)=>{fill(ctx,c);circle(ctx,-20+i*20,-10,7);ctx.fill();});`,
  o086: `fill(ctx,'#fda4af');tri(ctx,-55,50,55,50,0,-45);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();pen(ctx,'#fff',2);for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(0,-10+i*8,18,i*0.4,Math.PI+i*0.4);ctx.stroke();}`,
  o087: `fill(ctx,'#ea580c');tri(ctx,-65,45,65,45,0,-50);ctx.fill();pen(ctx,'#fff',2);for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-55+i*22,45);ctx.lineTo(-48+i*22,-20);ctx.stroke();}`,
  o088: `fill(ctx,'#a16207');rect(ctx,-12,-45,24,90,3);ctx.fill();fill(ctx,'#f8fafc');tri(ctx,-8,-40,58,-5,-8,30);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#92400e');rect(ctx,-35,40,70,12,2);ctx.fill();`,
  o089: `fill(ctx,'#78716c');rect(ctx,-40,-25,80,50,4);ctx.fill();fill(ctx,'#b45309');rect(ctx,-8,25,16,45,3);ctx.fill();pen(ctx,'#78350f',2);ctx.stroke();`,
  o090: `fill(ctx,'#facc15');tri(ctx,-48,40,48,40,0,-42);ctx.fill();pen(ctx,'#ca8a04',2);ctx.stroke();for(let i=0;i<8;i++){fill(ctx,'#fef08a');circle(ctx,-30+i*8,-5+(i%3)*6,3);ctx.fill();}`,
  o091: `fill(ctx,'#38bdf8');rect(ctx,-45,-28,90,56,6);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let i=0;i<5;i++){fill(ctx,'rgba(255,255,255,0.7)');circle(ctx,-25+i*12,-35-i*3,6);ctx.fill();}`,
  o092: `fill(ctx,'#facc15');tri(ctx,-65,35,65,35,0,-25);ctx.fill();pen(ctx,'#ca8a04',2);ctx.stroke();pen(ctx,'#92400e',2);ctx.beginPath();ctx.moveTo(0,-25);ctx.lineTo(0,40);ctx.lineTo(-70,40);ctx.stroke();`,
  o093: `fill(ctx,'#78716c');rect(ctx,-8,-50,16,100,1);ctx.fill();fill(ctx,'#78716c');rect(ctx,-50,-8,100,16,1);ctx.fill();pen(ctx,'#475569',1.5);for(let x=-40;x<=40;x+=20){for(let y=-40;y<=40;y+=20){ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);ctx.moveTo(x,y-6);ctx.lineTo(x,y+6);ctx.stroke();}}`,
  o094: `fill(ctx,'#3b82f6');tri(ctx,-55,35,55,35,0,-40);ctx.fill();pen(ctx,'#1d4ed8',2);ctx.stroke();fill(ctx,'#ef4444');rect(ctx,-25,30,50,18,4);ctx.fill();`,
  o095: `fill(ctx,'#f8fafc');tri(ctx,-40,35,40,35,0,-30);ctx.fill();pen(ctx,'#334155',2);ctx.stroke();fill(ctx,'#1e293b');rect(ctx,-45,28,90,12,2);ctx.fill();`,
  o096: `for(let i=0;i<4;i++){fill(ctx,'#b91c1c');rect(ctx,-58+i*6,-15+i*4,32,18,2);ctx.fill();pen(ctx,'#7f1d1d',1);ctx.stroke();}`,
  o097: `fill(ctx,'#b45309');rect(ctx,-35,-30,70,60,4);ctx.fill();fill(ctx,'#94a3b8');tri(ctx,-15,-30,15,-30,0,-55);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#78350f');rect(ctx,-6,-55,12,28,2);ctx.fill();`,
  o098: `pen(ctx,'#dc2626',2.5);ctx.beginPath();ctx.moveTo(0,-55);ctx.lineTo(50,30);ctx.lineTo(-50,30);ctx.closePath();ctx.stroke();fill(ctx,'#fecaca');ctx.fill();fill(ctx,'#fbbf24');circle(ctx,0,-20,14);ctx.fill();fill(ctx,'#0f172a');circle(ctx,-5,-22,3);ctx.fill();circle(ctx,5,-22,3);ctx.fill();pen(ctx,'#78350f',2);ctx.beginPath();ctx.moveTo(0,30);ctx.lineTo(0,55);ctx.stroke();`,
  o099: `fill(ctx,'#facc15');tri(ctx,-50,42,50,42,5,-38);ctx.fill();pen(ctx,'#ca8a04',2);ctx.stroke();fill(ctx,'#d97706');tri(ctx,-50,42,50,42,0,-30);ctx.fill();`,
  o100: `fill(ctx,'#7c3aed');rect(ctx,-45,-45,90,90,4);ctx.fill();pen(ctx,'#5b21b6',2);ctx.stroke();fill(ctx,'rgba(167,139,250,0.5)');tri(ctx,0,-50,45,35,-45,35);ctx.fill();pen(ctx,'#c4b5fd',1.5);ctx.stroke();`,
};

let out = `import type { Ctx } from './helpers';\nimport { circle, fill, pen, rect, tri, vnFlag } from './helpers';\n\n`;
out += `/** Minh họa 2D cho từng đồ vật o001–o100 (sinh bởi scripts/generate-sketch-parts2d.mjs). */\n`;
out += `type DrawFn = (ctx: Ctx) => void;\n\n`;

for (let n = 1; n <= 100; n++) {
  const id = `o${String(n).padStart(3, '0')}`;
  const body = ART[id];
  if (!body) throw new Error(`Missing art for ${id}`);
  out += `function draw_${id}(ctx: Ctx): void {\n  ${body}\n}\n\n`;
}

out += `export const BUILDER_DRAW: Record<string, DrawFn> = {\n`;
for (let n = 1; n <= 100; n++) {
  const id = `o${String(n).padStart(3, '0')}`;
  out += `  ${id}: draw_${id},\n`;
}
out += `};\n`;

writeFileSync(OUT, out);
console.log('Wrote', OUT, 'bytes', out.length);
