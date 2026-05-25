import type { Ctx } from './helpers';
import { circle, fill, pen, rect, tri } from './helpers';

/** Minh họa o101–o538 — mỗi câu một nét vẽ (generate-hinh-hoc-unique-drawings.mjs). */
type DrawFn = (ctx: Ctx) => void;

function draw_o101(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-51,-49,98,101,4);ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();pen(ctx,'#22c55e',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#a855f7',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o102(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-52,-50,99,102,5);ctx.fill();pen(ctx,'#ef4444',1.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#14b8a6');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o103(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-53,-51,100,103,6);ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#f97316',1.5);ctx.stroke();
}

function draw_o104(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-54,-52,101,96,7);ctx.fill();pen(ctx,'#eab308',1.5);ctx.stroke();pen(ctx,'#8b5cf6',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#06b6d4',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o105(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-48,-48,102,97,3);ctx.fill();pen(ctx,'#22c55e',2.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#ec4899');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o106(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-49,-49,103,98,4);ctx.fill();pen(ctx,'#14b8a6',1.5);ctx.stroke();fill(ctx,'#b45309');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#14b8a6',1.5);ctx.stroke();
}

function draw_o107(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-69,-14,138,32,5);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#64748b',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o108(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-70,-15,140,24,2);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-58+t*9,-15);ctx.lineTo(-58+t*9,15);ctx.stroke();}
}

function draw_o109(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-71,-16,142,25,3);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#a855f7',1);ctx.beginPath();ctx.moveTo(-59+t*10,-16);ctx.lineTo(-59+t*10,16);ctx.stroke();}
}

function draw_o110(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-72,-17,144,26,4);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-60+t*9,-17);ctx.lineTo(-60+t*9,17);ctx.stroke();}
}

function draw_o111(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-73,-18,146,27,5);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o112(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-67,-12,134,28,2);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o113(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-68,-13,136,29,3);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#ef4444',1);ctx.beginPath();ctx.moveTo(-56+t*10,-13);ctx.lineTo(-56+t*10,13);ctx.stroke();}
}

function draw_o114(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-69,-14,138,30,4);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f97316',1);ctx.beginPath();ctx.moveTo(-57+t*9,-14);ctx.lineTo(-57+t*9,14);ctx.stroke();}
}

function draw_o115(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-70,-15,140,31,5);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#eab308',1);ctx.beginPath();ctx.moveTo(-58+t*10,-15);ctx.lineTo(-58+t*10,15);ctx.stroke();}
}

function draw_o116(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-71,-16,142,32,2);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#22c55e',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o117(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-72,-17,144,24,3);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#14b8a6',1);ctx.beginPath();ctx.moveTo(-60+t*10,-17);ctx.lineTo(-60+t*10,17);ctx.stroke();}
}

function draw_o118(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-73,-18,146,25,4);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#3b82f6',1);ctx.beginPath();ctx.moveTo(-61+t*9,-18);ctx.lineTo(-61+t*9,18);ctx.stroke();}
}

function draw_o119(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-67,-12,134,26,5);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#8b5cf6',1);ctx.beginPath();ctx.moveTo(-55+t*10,-12);ctx.lineTo(-55+t*10,12);ctx.stroke();}
}

function draw_o120(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-68,-13,136,27,2);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#ec4899',1);ctx.beginPath();ctx.moveTo(-56+t*9,-13);ctx.lineTo(-56+t*9,13);ctx.stroke();}
}

function draw_o121(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-69,-14,138,28,3);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#b45309',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o122(ctx: Ctx): void {
  fill(ctx,'#64748b');circle(ctx,0,0,45);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();pen(ctx,'#eab308',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o123(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');circle(ctx,0,0,46);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#22c55e');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#8b5cf6');circle(ctx,14,12,11);ctx.fill();
}

function draw_o124(ctx: Ctx): void {
  fill(ctx,'#a855f7');circle(ctx,0,0,47);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#14b8a6',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o125(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-73,-18,146,32,3);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o126(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-67,-12,134,24,4);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o127(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-68,-13,136,25,5);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-56+t*10,-13);ctx.lineTo(-56+t*10,13);ctx.stroke();}
}

function draw_o128(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-69,-14,138,26,2);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#ef4444',1);ctx.beginPath();ctx.moveTo(-57+t*9,-14);ctx.lineTo(-57+t*9,14);ctx.stroke();}
}

function draw_o129(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-70,-15,140,27,3);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#f97316',1);ctx.beginPath();ctx.moveTo(-58+t*10,-15);ctx.lineTo(-58+t*10,15);ctx.stroke();}
}

function draw_o130(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-71,-16,142,28,4);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#eab308',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o131(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-53,-49,101,99,4);ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();pen(ctx,'#22c55e',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#a855f7',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o132(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-54,-50,102,100,5);ctx.fill();pen(ctx,'#ef4444',1.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#14b8a6');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o133(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-48,-51,103,101,6);ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#f97316',1.5);ctx.stroke();
}

function draw_o134(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2.5);ctx.stroke();ctx.restore();pen(ctx,'#8b5cf6',2.5);ctx.beginPath();ctx.moveTo(26,-26);ctx.lineTo(47,-32);ctx.lineTo(42,-24);ctx.closePath();ctx.fillStyle='#eab308';ctx.fill();
}

function draw_o135(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ec4899',2.5);ctx.beginPath();ctx.moveTo(18,-25);ctx.lineTo(48,-36);ctx.lineTo(43,-23);ctx.closePath();ctx.fillStyle='#22c55e';ctx.fill();
}

function draw_o136(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#b45309',2.5);ctx.beginPath();ctx.moveTo(19,-24);ctx.lineTo(49,-35);ctx.lineTo(44,-26);ctx.closePath();ctx.fillStyle='#14b8a6';ctx.fill();
}

function draw_o137(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-71,-16,142,26,3);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#64748b',1);ctx.beginPath();ctx.moveTo(-59+t*10,-16);ctx.lineTo(-59+t*10,16);ctx.stroke();}
}

function draw_o138(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-72,-17,144,27,4);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-60+t*9,-17);ctx.lineTo(-60+t*9,17);ctx.stroke();}
}

function draw_o139(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-73,-18,146,28,5);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#a855f7',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o140(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-67,-12,134,29,2);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o141(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-68,-13,136,30,3);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-56+t*10,-13);ctx.lineTo(-56+t*10,13);ctx.stroke();}
}

function draw_o142(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-69,-14,138,31,4);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-57+t*9,-14);ctx.lineTo(-57+t*9,14);ctx.stroke();}
}

function draw_o143(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-70,-15,140,32,5);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#ef4444',1);ctx.beginPath();ctx.moveTo(-58+t*10,-15);ctx.lineTo(-58+t*10,15);ctx.stroke();}
}

function draw_o144(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-71,-16,142,24,2);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f97316',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o145(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-72,-17,144,25,3);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#eab308',1);ctx.beginPath();ctx.moveTo(-60+t*10,-17);ctx.lineTo(-60+t*10,17);ctx.stroke();}
}

function draw_o146(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-54,-49,98,98,4);ctx.fill();pen(ctx,'#06b6d4',1.5);ctx.stroke();pen(ctx,'#22c55e',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#a855f7',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o147(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-48,-50,99,99,5);ctx.fill();pen(ctx,'#ef4444',2.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#14b8a6');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o148(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-49,-51,100,100,6);ctx.fill();pen(ctx,'#f97316',1.5);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#f97316',1.5);ctx.stroke();
}

function draw_o149(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-69,-14,138,29,3);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#8b5cf6',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o150(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-70,-15,140,30,4);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#ec4899',1);ctx.beginPath();ctx.moveTo(-58+t*9,-15);ctx.lineTo(-58+t*9,15);ctx.stroke();}
}

function draw_o151(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-71,-16,142,31,5);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#b45309',1);ctx.beginPath();ctx.moveTo(-59+t*10,-16);ctx.lineTo(-59+t*10,16);ctx.stroke();}
}

function draw_o152(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-72,-17,144,32,2);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#64748b',1);ctx.beginPath();ctx.moveTo(-60+t*9,-17);ctx.lineTo(-60+t*9,17);ctx.stroke();}
}

function draw_o153(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-73,-18,146,24,3);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o154(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-67,-12,134,25,4);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#a855f7',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o155(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-49,-48,98,99,3);ctx.fill();pen(ctx,'#b45309',2.5);ctx.stroke();pen(ctx,'#84cc16',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#3b82f6',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o156(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-50,-49,99,100,4);ctx.fill();pen(ctx,'#64748b',1.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#f43f5e');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o157(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-51,-50,100,101,5);ctx.fill();pen(ctx,'#0ea5e9',2.5);ctx.stroke();fill(ctx,'#06b6d4');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#0ea5e9',1.5);ctx.stroke();
}

function draw_o158(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-52,-51,101,102,6);ctx.fill();pen(ctx,'#a855f7',1.5);ctx.stroke();pen(ctx,'#ef4444',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#b45309',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o159(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-53,-52,102,103,7);ctx.fill();pen(ctx,'#84cc16',2.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#f97316');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o160(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-54,-48,103,96,3);ctx.fill();pen(ctx,'#f43f5e',1.5);ctx.stroke();fill(ctx,'#eab308');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#f43f5e',1.5);ctx.stroke();
}

function draw_o161(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-67,-12,134,32,3);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#22c55e',1);ctx.beginPath();ctx.moveTo(-55+t*10,-12);ctx.lineTo(-55+t*10,12);ctx.stroke();}
}

function draw_o162(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-68,-13,136,24,4);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#14b8a6',1);ctx.beginPath();ctx.moveTo(-56+t*9,-13);ctx.lineTo(-56+t*9,13);ctx.stroke();}
}

function draw_o163(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-69,-14,138,25,5);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#3b82f6',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o164(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-70,-15,140,26,2);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#8b5cf6',1);ctx.beginPath();ctx.moveTo(-58+t*9,-15);ctx.lineTo(-58+t*9,15);ctx.stroke();}
}

function draw_o165(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-71,-16,142,27,3);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#ec4899',1);ctx.beginPath();ctx.moveTo(-59+t*10,-16);ctx.lineTo(-59+t*10,16);ctx.stroke();}
}

function draw_o166(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-72,-17,144,28,4);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#b45309',1);ctx.beginPath();ctx.moveTo(-60+t*9,-17);ctx.lineTo(-60+t*9,17);ctx.stroke();}
}

function draw_o167(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-73,-18,146,29,5);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#64748b',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o168(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-67,-12,134,30,2);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o169(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-68,-13,136,31,3);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#a855f7',1);ctx.beginPath();ctx.moveTo(-56+t*10,-13);ctx.lineTo(-56+t*10,13);ctx.stroke();}
}

function draw_o170(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-69,-14,138,32,4);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-57+t*9,-14);ctx.lineTo(-57+t*9,14);ctx.stroke();}
}

function draw_o171(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-70,-15,140,24,5);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-58+t*10,-15);ctx.lineTo(-58+t*10,15);ctx.stroke();}
}

function draw_o172(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-71,-16,142,25,2);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o173(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-72,-17,144,26,3);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#ef4444',1);ctx.beginPath();ctx.moveTo(-60+t*10,-17);ctx.lineTo(-60+t*10,17);ctx.stroke();}
}

function draw_o174(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-73,-18,146,27,4);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f97316',1);ctx.beginPath();ctx.moveTo(-61+t*9,-18);ctx.lineTo(-61+t*9,18);ctx.stroke();}
}

function draw_o175(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-67,-12,134,28,5);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#eab308',1);ctx.beginPath();ctx.moveTo(-55+t*10,-12);ctx.lineTo(-55+t*10,12);ctx.stroke();}
}

function draw_o176(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-68,-13,136,29,2);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#22c55e',1);ctx.beginPath();ctx.moveTo(-56+t*9,-13);ctx.lineTo(-56+t*9,13);ctx.stroke();}
}

function draw_o177(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-69,-14,138,30,3);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#14b8a6',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o178(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-70,-15,140,31,4);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#3b82f6',1);ctx.beginPath();ctx.moveTo(-58+t*9,-15);ctx.lineTo(-58+t*9,15);ctx.stroke();}
}

function draw_o179(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-71,-16,142,32,5);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#8b5cf6',1);ctx.beginPath();ctx.moveTo(-59+t*10,-16);ctx.lineTo(-59+t*10,16);ctx.stroke();}
}

function draw_o180(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-72,-17,144,24,2);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#ec4899',1);ctx.beginPath();ctx.moveTo(-60+t*9,-17);ctx.lineTo(-60+t*9,17);ctx.stroke();}
}

function draw_o181(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-73,-18,146,25,3);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#b45309',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o182(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-67,-12,134,26,4);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#64748b',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o183(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-68,-13,136,27,5);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-56+t*10,-13);ctx.lineTo(-56+t*10,13);ctx.stroke();}
}

function draw_o184(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-69,-14,138,28,2);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#a855f7',1);ctx.beginPath();ctx.moveTo(-57+t*9,-14);ctx.lineTo(-57+t*9,14);ctx.stroke();}
}

function draw_o185(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-70,-15,140,29,3);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-58+t*10,-15);ctx.lineTo(-58+t*10,15);ctx.stroke();}
}

function draw_o186(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-71,-16,142,30,4);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o187(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-72,-17,144,31,5);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-60+t*10,-17);ctx.lineTo(-60+t*10,17);ctx.stroke();}
}

function draw_o188(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-73,-18,146,32,2);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#ef4444',1);ctx.beginPath();ctx.moveTo(-61+t*9,-18);ctx.lineTo(-61+t*9,18);ctx.stroke();}
}

function draw_o189(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-67,-12,134,24,3);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#f97316',1);ctx.beginPath();ctx.moveTo(-55+t*10,-12);ctx.lineTo(-55+t*10,12);ctx.stroke();}
}

function draw_o190(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-68,-13,136,25,4);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#eab308',1);ctx.beginPath();ctx.moveTo(-56+t*9,-13);ctx.lineTo(-56+t*9,13);ctx.stroke();}
}

function draw_o191(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-69,-14,138,26,5);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#22c55e',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o192(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-70,-15,140,27,2);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#14b8a6',1);ctx.beginPath();ctx.moveTo(-58+t*9,-15);ctx.lineTo(-58+t*9,15);ctx.stroke();}
}

function draw_o193(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-71,-16,142,28,3);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#3b82f6',1);ctx.beginPath();ctx.moveTo(-59+t*10,-16);ctx.lineTo(-59+t*10,16);ctx.stroke();}
}

function draw_o194(ctx: Ctx): void {
  fill(ctx,'#06b6d4');tri(ctx,-48,32,48,32,1,-41);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();pen(ctx,'#8b5cf6',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o195(ctx: Ctx): void {
  fill(ctx,'#ef4444');tri(ctx,-49,28,49,28,-1,-42);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();pen(ctx,'#ec4899',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o196(ctx: Ctx): void {
  fill(ctx,'#f97316');tri(ctx,-50,29,50,29,0,-36);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();pen(ctx,'#b45309',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o197(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-68,-13,136,32,3);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#64748b',1);ctx.beginPath();ctx.moveTo(-56+t*10,-13);ctx.lineTo(-56+t*10,13);ctx.stroke();}
}

function draw_o198(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-69,-14,138,24,4);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-57+t*9,-14);ctx.lineTo(-57+t*9,14);ctx.stroke();}
}

function draw_o199(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-70,-15,140,25,5);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#a855f7',1);ctx.beginPath();ctx.moveTo(-58+t*10,-15);ctx.lineTo(-58+t*10,15);ctx.stroke();}
}

function draw_o200(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-71,-16,142,26,2);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o201(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-72,-17,144,27,3);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-60+t*10,-17);ctx.lineTo(-60+t*10,17);ctx.stroke();}
}

function draw_o202(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-73,-18,146,28,4);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-61+t*9,-18);ctx.lineTo(-61+t*9,18);ctx.stroke();}
}

function draw_o203(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-67,-12,134,29,5);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#ef4444',1);ctx.beginPath();ctx.moveTo(-55+t*10,-12);ctx.lineTo(-55+t*10,12);ctx.stroke();}
}

function draw_o204(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-68,-13,136,30,2);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f97316',1);ctx.beginPath();ctx.moveTo(-56+t*9,-13);ctx.lineTo(-56+t*9,13);ctx.stroke();}
}

function draw_o205(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-69,-14,138,31,3);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#eab308',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o206(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();ctx.restore();pen(ctx,'#22c55e',2.5);ctx.beginPath();ctx.moveTo(26,-26);ctx.lineTo(49,-35);ctx.lineTo(42,-24);ctx.closePath();ctx.fillStyle='#06b6d4';ctx.fill();
}

function draw_o207(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2.5);ctx.stroke();ctx.restore();pen(ctx,'#14b8a6',2.5);ctx.beginPath();ctx.moveTo(18,-25);ctx.lineTo(50,-34);ctx.lineTo(43,-23);ctx.closePath();ctx.fillStyle='#ef4444';ctx.fill();
}

function draw_o208(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();ctx.restore();pen(ctx,'#3b82f6',2.5);ctx.beginPath();ctx.moveTo(19,-24);ctx.lineTo(51,-33);ctx.lineTo(44,-26);ctx.closePath();ctx.fillStyle='#f97316';ctx.fill();
}

function draw_o209(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-73,-18,146,26,3);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#8b5cf6',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o210(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-67,-12,134,27,4);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#ec4899',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o211(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-68,-13,136,28,5);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#b45309',1);ctx.beginPath();ctx.moveTo(-56+t*10,-13);ctx.lineTo(-56+t*10,13);ctx.stroke();}
}

function draw_o212(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-69,-14,138,29,2);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#64748b',1);ctx.beginPath();ctx.moveTo(-57+t*9,-14);ctx.lineTo(-57+t*9,14);ctx.stroke();}
}

function draw_o213(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-70,-15,140,30,3);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-58+t*10,-15);ctx.lineTo(-58+t*10,15);ctx.stroke();}
}

function draw_o214(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-71,-16,142,31,4);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#a855f7',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o215(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-72,-17,144,32,5);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-60+t*10,-17);ctx.lineTo(-60+t*10,17);ctx.stroke();}
}

function draw_o216(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-73,-18,146,24,2);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-61+t*9,-18);ctx.lineTo(-61+t*9,18);ctx.stroke();}
}

function draw_o217(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-67,-12,134,25,3);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-55+t*10,-12);ctx.lineTo(-55+t*10,12);ctx.stroke();}
}

function draw_o218(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-68,-13,136,26,4);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#ef4444',1);ctx.beginPath();ctx.moveTo(-56+t*9,-13);ctx.lineTo(-56+t*9,13);ctx.stroke();}
}

function draw_o219(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-69,-14,138,27,5);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#f97316',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o220(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-70,-15,140,28,2);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#eab308',1);ctx.beginPath();ctx.moveTo(-58+t*9,-15);ctx.lineTo(-58+t*9,15);ctx.stroke();}
}

function draw_o221(ctx: Ctx): void {
  fill(ctx,'#a855f7');tri(ctx,-51,29,51,29,1,-40);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();pen(ctx,'#22c55e',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o222(ctx: Ctx): void {
  fill(ctx,'#84cc16');tri(ctx,-46,30,46,30,-1,-41);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();pen(ctx,'#14b8a6',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o223(ctx: Ctx): void {
  fill(ctx,'#f43f5e');tri(ctx,-47,31,47,31,0,-42);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();pen(ctx,'#3b82f6',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o224(ctx: Ctx): void {
  fill(ctx,'#06b6d4');tri(ctx,-48,32,48,32,1,-36);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();pen(ctx,'#8b5cf6',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o225(ctx: Ctx): void {
  fill(ctx,'#ef4444');tri(ctx,-49,28,49,28,-1,-37);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();pen(ctx,'#ec4899',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o226(ctx: Ctx): void {
  fill(ctx,'#f97316');tri(ctx,-50,29,50,29,0,-38);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();pen(ctx,'#b45309',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o227(ctx: Ctx): void {
  fill(ctx,'#eab308');tri(ctx,-51,30,51,30,1,-39);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();pen(ctx,'#64748b',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o228(ctx: Ctx): void {
  fill(ctx,'#22c55e');tri(ctx,-46,31,46,31,-1,-40);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();pen(ctx,'#0ea5e9',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o229(ctx: Ctx): void {
  fill(ctx,'#14b8a6');tri(ctx,-47,32,47,32,0,-41);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();pen(ctx,'#a855f7',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o230(ctx: Ctx): void {
  fill(ctx,'#3b82f6');tri(ctx,-48,28,48,28,1,-42);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();pen(ctx,'#84cc16',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o231(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');tri(ctx,-49,29,49,29,-1,-36);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();pen(ctx,'#f43f5e',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o232(ctx: Ctx): void {
  fill(ctx,'#ec4899');tri(ctx,-50,30,50,30,0,-37);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();pen(ctx,'#06b6d4',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o233(ctx: Ctx): void {
  fill(ctx,'#b45309');tri(ctx,-51,31,51,31,1,-38);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();pen(ctx,'#ef4444',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o234(ctx: Ctx): void {
  fill(ctx,'#64748b');tri(ctx,-46,32,46,32,-1,-39);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();pen(ctx,'#f97316',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o235(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');tri(ctx,-47,28,47,28,0,-40);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();pen(ctx,'#eab308',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o236(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-72,-17,144,26,2);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#22c55e',1);ctx.beginPath();ctx.moveTo(-60+t*9,-17);ctx.lineTo(-60+t*9,17);ctx.stroke();}
}

function draw_o237(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-73,-18,146,27,3);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#14b8a6',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o238(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-67,-12,134,28,4);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#3b82f6',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o239(ctx: Ctx): void {
  fill(ctx,'#06b6d4');tri(ctx,-51,32,51,32,1,-37);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();pen(ctx,'#8b5cf6',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o240(ctx: Ctx): void {
  fill(ctx,'#ef4444');tri(ctx,-46,28,46,28,-1,-38);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();pen(ctx,'#ec4899',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o241(ctx: Ctx): void {
  fill(ctx,'#f97316');tri(ctx,-47,29,47,29,0,-39);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();pen(ctx,'#b45309',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o242(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-71,-16,142,32,4);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#64748b',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o243(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-72,-17,144,24,5);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#0ea5e9',1);ctx.beginPath();ctx.moveTo(-60+t*10,-17);ctx.lineTo(-60+t*10,17);ctx.stroke();}
}

function draw_o244(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-73,-18,146,25,2);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#a855f7',1);ctx.beginPath();ctx.moveTo(-61+t*9,-18);ctx.lineTo(-61+t*9,18);ctx.stroke();}
}

function draw_o245(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-67,-12,134,26,3);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-55+t*10,-12);ctx.lineTo(-55+t*10,12);ctx.stroke();}
}

function draw_o246(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-68,-13,136,27,4);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-56+t*9,-13);ctx.lineTo(-56+t*9,13);ctx.stroke();}
}

function draw_o247(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-69,-14,138,28,5);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o248(ctx: Ctx): void {
  fill(ctx,'#b45309');tri(ctx,-48,31,48,31,1,-39);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();pen(ctx,'#ef4444',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o249(ctx: Ctx): void {
  fill(ctx,'#64748b');tri(ctx,-49,32,49,32,-1,-40);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();pen(ctx,'#f97316',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o250(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');tri(ctx,-50,28,50,28,0,-41);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();pen(ctx,'#eab308',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o251(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(48,0);ctx.lineTo(0,56);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(29,0);ctx.lineTo(0,37);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o252(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(42,0);ctx.lineTo(0,48);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(30,0);ctx.lineTo(0,32);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o253(ctx: Ctx): void {
  fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(43,0);ctx.lineTo(0,49);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(31,0);ctx.lineTo(0,33);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o254(ctx: Ctx): void {
  fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(44,0);ctx.lineTo(0,50);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(32,0);ctx.lineTo(0,34);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o255(ctx: Ctx): void {
  fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(0,-51);ctx.lineTo(45,0);ctx.lineTo(0,51);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(28,0);ctx.lineTo(0,35);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o256(ctx: Ctx): void {
  fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(46,0);ctx.lineTo(0,52);ctx.lineTo(-46,0);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(29,0);ctx.lineTo(0,36);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o257(ctx: Ctx): void {
  fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(0,-53);ctx.lineTo(47,0);ctx.lineTo(0,53);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(30,0);ctx.lineTo(0,37);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o258(ctx: Ctx): void {
  fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-54);ctx.lineTo(48,0);ctx.lineTo(0,54);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(31,0);ctx.lineTo(0,32);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o259(ctx: Ctx): void {
  fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-55);ctx.lineTo(42,0);ctx.lineTo(0,55);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(32,0);ctx.lineTo(0,33);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o260(ctx: Ctx): void {
  fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(43,0);ctx.lineTo(0,56);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(28,0);ctx.lineTo(0,34);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o261(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(44,0);ctx.lineTo(0,48);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(29,0);ctx.lineTo(0,35);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o262(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(45,0);ctx.lineTo(0,49);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(30,0);ctx.lineTo(0,36);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o263(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ef4444',2.5);ctx.beginPath();ctx.moveTo(20,-23);ctx.lineTo(50,-33);ctx.lineTo(45,-23);ctx.closePath();ctx.fillStyle='#a855f7';ctx.fill();
}

function draw_o264(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2.5);ctx.stroke();ctx.restore();pen(ctx,'#f97316',2.5);ctx.beginPath();ctx.moveTo(21,-28);ctx.lineTo(51,-32);ctx.lineTo(40,-26);ctx.closePath();ctx.fillStyle='#84cc16';ctx.fill();
}

function draw_o265(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#eab308',2.5);ctx.beginPath();ctx.moveTo(22,-27);ctx.lineTo(52,-36);ctx.lineTo(41,-25);ctx.closePath();ctx.fillStyle='#f43f5e';ctx.fill();
}

function draw_o266(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();ctx.restore();pen(ctx,'#22c55e',2.5);ctx.beginPath();ctx.moveTo(23,-26);ctx.lineTo(46,-35);ctx.lineTo(42,-24);ctx.closePath();ctx.fillStyle='#06b6d4';ctx.fill();
}

function draw_o267(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2.5);ctx.stroke();ctx.restore();pen(ctx,'#14b8a6',2.5);ctx.beginPath();ctx.moveTo(24,-25);ctx.lineTo(47,-34);ctx.lineTo(43,-23);ctx.closePath();ctx.fillStyle='#ef4444';ctx.fill();
}

function draw_o268(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();ctx.restore();pen(ctx,'#3b82f6',2.5);ctx.beginPath();ctx.moveTo(25,-24);ctx.lineTo(48,-33);ctx.lineTo(44,-26);ctx.closePath();ctx.fillStyle='#f97316';ctx.fill();
}

function draw_o269(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2.5);ctx.stroke();ctx.restore();pen(ctx,'#8b5cf6',2.5);ctx.beginPath();ctx.moveTo(26,-23);ctx.lineTo(49,-32);ctx.lineTo(45,-25);ctx.closePath();ctx.fillStyle='#eab308';ctx.fill();
}

function draw_o270(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ec4899',2.5);ctx.beginPath();ctx.moveTo(18,-28);ctx.lineTo(50,-36);ctx.lineTo(40,-24);ctx.closePath();ctx.fillStyle='#22c55e';ctx.fill();
}

function draw_o271(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#b45309',2.5);ctx.beginPath();ctx.moveTo(19,-27);ctx.lineTo(51,-35);ctx.lineTo(41,-23);ctx.closePath();ctx.fillStyle='#14b8a6';ctx.fill();
}

function draw_o272(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#64748b',2.5);ctx.beginPath();ctx.moveTo(20,-26);ctx.lineTo(52,-34);ctx.lineTo(42,-26);ctx.closePath();ctx.fillStyle='#3b82f6';ctx.fill();
}

function draw_o273(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#0ea5e9',2.5);ctx.beginPath();ctx.moveTo(21,-25);ctx.lineTo(46,-33);ctx.lineTo(43,-25);ctx.closePath();ctx.fillStyle='#8b5cf6';ctx.fill();
}

function draw_o274(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2.5);ctx.stroke();ctx.restore();pen(ctx,'#a855f7',2.5);ctx.beginPath();ctx.moveTo(22,-24);ctx.lineTo(47,-32);ctx.lineTo(44,-24);ctx.closePath();ctx.fillStyle='#ec4899';ctx.fill();
}

function draw_o275(ctx: Ctx): void {
  fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(-36,-29);ctx.lineTo(36,-29);ctx.lineTo(66,29);ctx.lineTo(-66,29);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#84cc16');rect(ctx,-61,29,122,8,2);ctx.fill();
}

function draw_o276(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(-37,-30);ctx.lineTo(37,-30);ctx.lineTo(67,30);ctx.lineTo(-67,30);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#f43f5e');rect(ctx,-62,30,124,5,2);ctx.fill();
}

function draw_o277(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(-38,-31);ctx.lineTo(38,-31);ctx.lineTo(68,31);ctx.lineTo(-68,31);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');rect(ctx,-63,31,126,6,2);ctx.fill();
}

function draw_o278(ctx: Ctx): void {
  fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(-39,-32);ctx.lineTo(39,-32);ctx.lineTo(69,32);ctx.lineTo(-69,32);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#ef4444');rect(ctx,-64,32,128,7,2);ctx.fill();
}

function draw_o279(ctx: Ctx): void {
  fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(-40,-33);ctx.lineTo(40,-33);ctx.lineTo(70,33);ctx.lineTo(-70,33);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#f97316');rect(ctx,-65,33,130,8,2);ctx.fill();
}

function draw_o280(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(-41,-26);ctx.lineTo(41,-26);ctx.lineTo(71,26);ctx.lineTo(-71,26);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#eab308');rect(ctx,-66,26,132,5,2);ctx.fill();
}

function draw_o281(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-42,-27);ctx.lineTo(42,-27);ctx.lineTo(72,27);ctx.lineTo(-72,27);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');rect(ctx,-67,27,134,6,2);ctx.fill();
}

function draw_o282(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-43,-28);ctx.lineTo(43,-28);ctx.lineTo(73,28);ctx.lineTo(-73,28);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');rect(ctx,-68,28,136,7,2);ctx.fill();
}

function draw_o283(ctx: Ctx): void {
  fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-44,-29);ctx.lineTo(44,-29);ctx.lineTo(74,29);ctx.lineTo(-74,29);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-69,29,138,8,2);ctx.fill();
}

function draw_o284(ctx: Ctx): void {
  fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-45,-30);ctx.lineTo(45,-30);ctx.lineTo(75,30);ctx.lineTo(-75,30);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#8b5cf6');rect(ctx,-70,30,140,5,2);ctx.fill();
}

function draw_o285(ctx: Ctx): void {
  fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-46,-31);ctx.lineTo(46,-31);ctx.lineTo(76,31);ctx.lineTo(-76,31);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ec4899');rect(ctx,-71,31,142,6,2);ctx.fill();
}

function draw_o286(ctx: Ctx): void {
  fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-34,-32);ctx.lineTo(34,-32);ctx.lineTo(66,32);ctx.lineTo(-66,32);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#b45309');rect(ctx,-61,32,122,7,2);ctx.fill();
}

function draw_o287(ctx: Ctx): void {
  fill(ctx,'#64748b');circle(ctx,0,0,45);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#eab308');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#3b82f6');circle(ctx,14,12,11);ctx.fill();
}

function draw_o288(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');circle(ctx,0,0,46);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#22c55e',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o289(ctx: Ctx): void {
  fill(ctx,'#a855f7');circle(ctx,0,0,47);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#14b8a6');circle(ctx,2,0,8);ctx.fill();
}

function draw_o290(ctx: Ctx): void {
  fill(ctx,'#84cc16');circle(ctx,0,0,48);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();pen(ctx,'#3b82f6',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o291(ctx: Ctx): void {
  fill(ctx,'#f43f5e');circle(ctx,0,0,49);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#8b5cf6');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#64748b');circle(ctx,14,12,11);ctx.fill();
}

function draw_o292(ctx: Ctx): void {
  fill(ctx,'#06b6d4');circle(ctx,0,0,50);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#ec4899',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o293(ctx: Ctx): void {
  fill(ctx,'#ef4444');circle(ctx,0,0,51);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#b45309');circle(ctx,1,1,8);ctx.fill();
}

function draw_o294(ctx: Ctx): void {
  fill(ctx,'#f97316');circle(ctx,0,0,52);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();pen(ctx,'#64748b',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o295(ctx: Ctx): void {
  fill(ctx,'#eab308');circle(ctx,0,0,53);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#0ea5e9');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#f43f5e');circle(ctx,14,12,11);ctx.fill();
}

function draw_o296(ctx: Ctx): void {
  fill(ctx,'#22c55e');circle(ctx,0,0,54);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#a855f7',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o297(ctx: Ctx): void {
  fill(ctx,'#14b8a6');circle(ctx,0,0,44);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#84cc16');circle(ctx,0,-1,8);ctx.fill();
}

function draw_o298(ctx: Ctx): void {
  fill(ctx,'#3b82f6');circle(ctx,0,0,45);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();pen(ctx,'#f43f5e',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o299(ctx: Ctx): void {
  fill(ctx,'#06b6d4');tri(ctx,-51,32,51,32,1,-41);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();pen(ctx,'#8b5cf6',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o300(ctx: Ctx): void {
  fill(ctx,'#ef4444');tri(ctx,-46,28,46,28,-1,-42);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();pen(ctx,'#ec4899',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o301(ctx: Ctx): void {
  fill(ctx,'#f97316');tri(ctx,-47,29,47,29,0,-36);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();pen(ctx,'#b45309',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o302(ctx: Ctx): void {
  fill(ctx,'#eab308');tri(ctx,-48,30,48,30,1,-37);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();pen(ctx,'#64748b',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o303(ctx: Ctx): void {
  fill(ctx,'#22c55e');tri(ctx,-49,31,49,31,-1,-38);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();pen(ctx,'#0ea5e9',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o304(ctx: Ctx): void {
  fill(ctx,'#14b8a6');tri(ctx,-50,32,50,32,0,-39);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();pen(ctx,'#a855f7',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o305(ctx: Ctx): void {
  fill(ctx,'#3b82f6');tri(ctx,-51,28,51,28,1,-40);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();pen(ctx,'#84cc16',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o306(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');tri(ctx,-46,29,46,29,-1,-41);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();pen(ctx,'#f43f5e',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o307(ctx: Ctx): void {
  fill(ctx,'#ec4899');tri(ctx,-47,30,47,30,0,-42);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();pen(ctx,'#06b6d4',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o308(ctx: Ctx): void {
  fill(ctx,'#b45309');tri(ctx,-48,31,48,31,1,-36);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();pen(ctx,'#ef4444',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o309(ctx: Ctx): void {
  fill(ctx,'#64748b');tri(ctx,-49,32,49,32,-1,-37);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();pen(ctx,'#f97316',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o310(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');tri(ctx,-50,28,50,28,0,-38);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();pen(ctx,'#eab308',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o311(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-51,-49,101,103,4);ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();pen(ctx,'#22c55e',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#a855f7',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o312(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-52,-50,102,96,5);ctx.fill();pen(ctx,'#ef4444',1.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#14b8a6');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o313(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-53,-51,103,97,6);ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#f97316',1.5);ctx.stroke();
}

function draw_o314(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-54,-52,104,98,7);ctx.fill();pen(ctx,'#eab308',1.5);ctx.stroke();pen(ctx,'#8b5cf6',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#06b6d4',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o315(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-48,-48,96,99,3);ctx.fill();pen(ctx,'#22c55e',2.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#ec4899');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o316(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-49,-49,97,100,4);ctx.fill();pen(ctx,'#14b8a6',1.5);ctx.stroke();fill(ctx,'#b45309');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#14b8a6',1.5);ctx.stroke();
}

function draw_o317(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-50,-50,98,101,5);ctx.fill();pen(ctx,'#3b82f6',2.5);ctx.stroke();pen(ctx,'#64748b',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#eab308',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o318(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-51,-51,99,102,6);ctx.fill();pen(ctx,'#8b5cf6',1.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#0ea5e9');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o319(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-52,-52,100,103,7);ctx.fill();pen(ctx,'#ec4899',2.5);ctx.stroke();fill(ctx,'#a855f7');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#ec4899',1.5);ctx.stroke();
}

function draw_o320(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-72,-17,144,29,2);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#84cc16',1);ctx.beginPath();ctx.moveTo(-60+t*9,-17);ctx.lineTo(-60+t*9,17);ctx.stroke();}
}

function draw_o321(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-73,-18,146,30,3);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#f43f5e',1);ctx.beginPath();ctx.moveTo(-61+t*10,-18);ctx.lineTo(-61+t*10,18);ctx.stroke();}
}

function draw_o322(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-67,-12,134,31,4);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#06b6d4',1);ctx.beginPath();ctx.moveTo(-55+t*9,-12);ctx.lineTo(-55+t*9,12);ctx.stroke();}
}

function draw_o323(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-68,-13,136,32,5);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();for(let t=0;t<11;t++){pen(ctx,'#ef4444',1);ctx.beginPath();ctx.moveTo(-56+t*10,-13);ctx.lineTo(-56+t*10,13);ctx.stroke();}
}

function draw_o324(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-69,-14,138,24,2);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let t=0;t<6;t++){pen(ctx,'#f97316',1);ctx.beginPath();ctx.moveTo(-57+t*9,-14);ctx.lineTo(-57+t*9,14);ctx.stroke();}
}

function draw_o325(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-70,-15,140,25,3);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let t=0;t<7;t++){pen(ctx,'#eab308',1);ctx.beginPath();ctx.moveTo(-58+t*10,-15);ctx.lineTo(-58+t*10,15);ctx.stroke();}
}

function draw_o326(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-71,-16,142,26,4);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#22c55e',1);ctx.beginPath();ctx.moveTo(-59+t*9,-16);ctx.lineTo(-59+t*9,16);ctx.stroke();}
}

function draw_o327(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-72,-17,144,27,5);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#14b8a6',1);ctx.beginPath();ctx.moveTo(-60+t*10,-17);ctx.lineTo(-60+t*10,17);ctx.stroke();}
}

function draw_o328(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-73,-18,146,28,2);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#3b82f6',1);ctx.beginPath();ctx.moveTo(-61+t*9,-18);ctx.lineTo(-61+t*9,18);ctx.stroke();}
}

function draw_o329(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-48,-52,101,97,7);ctx.fill();pen(ctx,'#eab308',2.5);ctx.stroke();pen(ctx,'#8b5cf6',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#06b6d4',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o330(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-49,-48,102,98,3);ctx.fill();pen(ctx,'#22c55e',1.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#ec4899');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o331(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-50,-49,103,99,4);ctx.fill();pen(ctx,'#14b8a6',2.5);ctx.stroke();fill(ctx,'#b45309');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#14b8a6',1.5);ctx.stroke();
}

function draw_o332(ctx: Ctx): void {
  fill(ctx,'#eab308');rect(ctx,-51,-50,104,100,5);ctx.fill();pen(ctx,'#3b82f6',1.5);ctx.stroke();pen(ctx,'#64748b',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#eab308',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o333(ctx: Ctx): void {
  fill(ctx,'#22c55e');rect(ctx,-52,-51,96,101,6);ctx.fill();pen(ctx,'#8b5cf6',2.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#0ea5e9');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o334(ctx: Ctx): void {
  fill(ctx,'#14b8a6');rect(ctx,-53,-52,97,102,7);ctx.fill();pen(ctx,'#ec4899',1.5);ctx.stroke();fill(ctx,'#a855f7');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#ec4899',1.5);ctx.stroke();
}

function draw_o335(ctx: Ctx): void {
  fill(ctx,'#3b82f6');rect(ctx,-54,-48,98,103,3);ctx.fill();pen(ctx,'#b45309',2.5);ctx.stroke();pen(ctx,'#84cc16',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#3b82f6',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o336(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');rect(ctx,-48,-49,99,96,4);ctx.fill();pen(ctx,'#64748b',1.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#f43f5e');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o337(ctx: Ctx): void {
  fill(ctx,'#ec4899');rect(ctx,-49,-50,100,97,5);ctx.fill();pen(ctx,'#0ea5e9',2.5);ctx.stroke();fill(ctx,'#06b6d4');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#0ea5e9',1.5);ctx.stroke();
}

function draw_o338(ctx: Ctx): void {
  fill(ctx,'#b45309');rect(ctx,-50,-51,101,98,6);ctx.fill();pen(ctx,'#a855f7',1.5);ctx.stroke();pen(ctx,'#ef4444',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#b45309',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o339(ctx: Ctx): void {
  fill(ctx,'#64748b');rect(ctx,-51,-52,102,99,7);ctx.fill();pen(ctx,'#84cc16',2.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#f97316');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o340(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');rect(ctx,-52,-48,103,100,3);ctx.fill();pen(ctx,'#f43f5e',1.5);ctx.stroke();fill(ctx,'#eab308');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#f43f5e',1.5);ctx.stroke();
}

function draw_o341(ctx: Ctx): void {
  fill(ctx,'#a855f7');rect(ctx,-53,-49,104,101,4);ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();pen(ctx,'#22c55e',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'#a855f7',1);ctx.strokeRect(-18,-18,36,36);
}

function draw_o342(ctx: Ctx): void {
  fill(ctx,'#84cc16');rect(ctx,-54,-50,96,102,5);ctx.fill();pen(ctx,'#ef4444',1.5);ctx.stroke();for(let a=0;a<4;a++){fill(ctx,'#14b8a6');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}
}

function draw_o343(ctx: Ctx): void {
  fill(ctx,'#f43f5e');rect(ctx,-48,-51,97,103,6);ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'#f97316',1.5);ctx.stroke();
}

function draw_o344(ctx: Ctx): void {
  fill(ctx,'#06b6d4');rect(ctx,-68,-13,136,26,2);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();for(let t=0;t<8;t++){pen(ctx,'#8b5cf6',1);ctx.beginPath();ctx.moveTo(-56+t*9,-13);ctx.lineTo(-56+t*9,13);ctx.stroke();}
}

function draw_o345(ctx: Ctx): void {
  fill(ctx,'#ef4444');rect(ctx,-69,-14,138,27,3);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();for(let t=0;t<9;t++){pen(ctx,'#ec4899',1);ctx.beginPath();ctx.moveTo(-57+t*10,-14);ctx.lineTo(-57+t*10,14);ctx.stroke();}
}

function draw_o346(ctx: Ctx): void {
  fill(ctx,'#f97316');rect(ctx,-70,-15,140,28,4);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();for(let t=0;t<10;t++){pen(ctx,'#b45309',1);ctx.beginPath();ctx.moveTo(-58+t*9,-15);ctx.lineTo(-58+t*9,15);ctx.stroke();}
}

function draw_o347(ctx: Ctx): void {
  fill(ctx,'#eab308');tri(ctx,-51,30,51,30,1,-40);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();pen(ctx,'#64748b',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o348(ctx: Ctx): void {
  fill(ctx,'#22c55e');tri(ctx,-46,31,46,31,-1,-41);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();pen(ctx,'#0ea5e9',1.2);for(let t=0;t<2;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o349(ctx: Ctx): void {
  fill(ctx,'#14b8a6');tri(ctx,-47,32,47,32,0,-42);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();pen(ctx,'#a855f7',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o350(ctx: Ctx): void {
  fill(ctx,'#3b82f6');tri(ctx,-48,28,48,28,1,-36);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();pen(ctx,'#84cc16',1.2);for(let t=0;t<4;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o351(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');tri(ctx,-49,29,49,29,-1,-37);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();pen(ctx,'#f43f5e',1.2);for(let t=0;t<5;t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}
}

function draw_o352(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2.5);ctx.stroke();ctx.restore();pen(ctx,'#06b6d4',2.5);ctx.beginPath();ctx.moveTo(19,-24);ctx.lineTo(48,-34);ctx.lineTo(44,-26);ctx.closePath();ctx.fillStyle='#0ea5e9';ctx.fill();
}

function draw_o353(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ef4444',2.5);ctx.beginPath();ctx.moveTo(20,-23);ctx.lineTo(49,-33);ctx.lineTo(45,-25);ctx.closePath();ctx.fillStyle='#a855f7';ctx.fill();
}

function draw_o354(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2.5);ctx.stroke();ctx.restore();pen(ctx,'#f97316',2.5);ctx.beginPath();ctx.moveTo(21,-28);ctx.lineTo(50,-32);ctx.lineTo(40,-24);ctx.closePath();ctx.fillStyle='#84cc16';ctx.fill();
}

function draw_o355(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#eab308',2.5);ctx.beginPath();ctx.moveTo(22,-27);ctx.lineTo(51,-36);ctx.lineTo(41,-23);ctx.closePath();ctx.fillStyle='#f43f5e';ctx.fill();
}

function draw_o356(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();ctx.restore();pen(ctx,'#22c55e',2.5);ctx.beginPath();ctx.moveTo(23,-26);ctx.lineTo(52,-35);ctx.lineTo(42,-26);ctx.closePath();ctx.fillStyle='#06b6d4';ctx.fill();
}

function draw_o357(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2.5);ctx.stroke();ctx.restore();pen(ctx,'#14b8a6',2.5);ctx.beginPath();ctx.moveTo(24,-25);ctx.lineTo(46,-34);ctx.lineTo(43,-25);ctx.closePath();ctx.fillStyle='#ef4444';ctx.fill();
}

function draw_o358(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();ctx.restore();pen(ctx,'#3b82f6',2.5);ctx.beginPath();ctx.moveTo(25,-24);ctx.lineTo(47,-33);ctx.lineTo(44,-24);ctx.closePath();ctx.fillStyle='#f97316';ctx.fill();
}

function draw_o359(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2.5);ctx.stroke();ctx.restore();pen(ctx,'#8b5cf6',2.5);ctx.beginPath();ctx.moveTo(26,-23);ctx.lineTo(48,-32);ctx.lineTo(45,-23);ctx.closePath();ctx.fillStyle='#eab308';ctx.fill();
}

function draw_o360(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ec4899',2.5);ctx.beginPath();ctx.moveTo(18,-28);ctx.lineTo(49,-36);ctx.lineTo(40,-26);ctx.closePath();ctx.fillStyle='#22c55e';ctx.fill();
}

function draw_o361(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#b45309',2.5);ctx.beginPath();ctx.moveTo(19,-27);ctx.lineTo(50,-35);ctx.lineTo(41,-25);ctx.closePath();ctx.fillStyle='#14b8a6';ctx.fill();
}

function draw_o362(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#64748b',2.5);ctx.beginPath();ctx.moveTo(20,-26);ctx.lineTo(51,-34);ctx.lineTo(42,-24);ctx.closePath();ctx.fillStyle='#3b82f6';ctx.fill();
}

function draw_o363(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#0ea5e9',2.5);ctx.beginPath();ctx.moveTo(21,-25);ctx.lineTo(52,-33);ctx.lineTo(43,-23);ctx.closePath();ctx.fillStyle='#8b5cf6';ctx.fill();
}

function draw_o364(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2.5);ctx.stroke();ctx.restore();pen(ctx,'#a855f7',2.5);ctx.beginPath();ctx.moveTo(22,-24);ctx.lineTo(46,-32);ctx.lineTo(44,-26);ctx.closePath();ctx.fillStyle='#ec4899';ctx.fill();
}

function draw_o365(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2.5);ctx.stroke();ctx.restore();pen(ctx,'#84cc16',2.5);ctx.beginPath();ctx.moveTo(23,-23);ctx.lineTo(47,-36);ctx.lineTo(45,-25);ctx.closePath();ctx.fillStyle='#b45309';ctx.fill();
}

function draw_o366(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2.5);ctx.stroke();ctx.restore();pen(ctx,'#f43f5e',2.5);ctx.beginPath();ctx.moveTo(24,-28);ctx.lineTo(48,-35);ctx.lineTo(40,-24);ctx.closePath();ctx.fillStyle='#64748b';ctx.fill();
}

function draw_o367(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2.5);ctx.stroke();ctx.restore();pen(ctx,'#06b6d4',2.5);ctx.beginPath();ctx.moveTo(25,-27);ctx.lineTo(49,-34);ctx.lineTo(41,-23);ctx.closePath();ctx.fillStyle='#0ea5e9';ctx.fill();
}

function draw_o368(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ef4444',2.5);ctx.beginPath();ctx.moveTo(26,-26);ctx.lineTo(50,-33);ctx.lineTo(42,-26);ctx.closePath();ctx.fillStyle='#a855f7';ctx.fill();
}

function draw_o369(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2.5);ctx.stroke();ctx.restore();pen(ctx,'#f97316',2.5);ctx.beginPath();ctx.moveTo(18,-25);ctx.lineTo(51,-32);ctx.lineTo(43,-25);ctx.closePath();ctx.fillStyle='#84cc16';ctx.fill();
}

function draw_o370(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#eab308',2.5);ctx.beginPath();ctx.moveTo(19,-24);ctx.lineTo(52,-36);ctx.lineTo(44,-24);ctx.closePath();ctx.fillStyle='#f43f5e';ctx.fill();
}

function draw_o371(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();ctx.restore();pen(ctx,'#22c55e',2.5);ctx.beginPath();ctx.moveTo(20,-23);ctx.lineTo(46,-35);ctx.lineTo(45,-23);ctx.closePath();ctx.fillStyle='#06b6d4';ctx.fill();
}

function draw_o372(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2.5);ctx.stroke();ctx.restore();pen(ctx,'#14b8a6',2.5);ctx.beginPath();ctx.moveTo(21,-28);ctx.lineTo(47,-34);ctx.lineTo(40,-26);ctx.closePath();ctx.fillStyle='#ef4444';ctx.fill();
}

function draw_o373(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();ctx.restore();pen(ctx,'#3b82f6',2.5);ctx.beginPath();ctx.moveTo(22,-27);ctx.lineTo(48,-33);ctx.lineTo(41,-25);ctx.closePath();ctx.fillStyle='#f97316';ctx.fill();
}

function draw_o374(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2.5);ctx.stroke();ctx.restore();pen(ctx,'#8b5cf6',2.5);ctx.beginPath();ctx.moveTo(23,-26);ctx.lineTo(49,-32);ctx.lineTo(42,-24);ctx.closePath();ctx.fillStyle='#eab308';ctx.fill();
}

function draw_o375(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ec4899',2.5);ctx.beginPath();ctx.moveTo(24,-25);ctx.lineTo(50,-36);ctx.lineTo(43,-23);ctx.closePath();ctx.fillStyle='#22c55e';ctx.fill();
}

function draw_o376(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#b45309',2.5);ctx.beginPath();ctx.moveTo(25,-24);ctx.lineTo(51,-35);ctx.lineTo(44,-26);ctx.closePath();ctx.fillStyle='#14b8a6';ctx.fill();
}

function draw_o377(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#64748b',2.5);ctx.beginPath();ctx.moveTo(26,-23);ctx.lineTo(52,-34);ctx.lineTo(45,-25);ctx.closePath();ctx.fillStyle='#3b82f6';ctx.fill();
}

function draw_o378(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#0ea5e9',2.5);ctx.beginPath();ctx.moveTo(18,-28);ctx.lineTo(46,-33);ctx.lineTo(40,-24);ctx.closePath();ctx.fillStyle='#8b5cf6';ctx.fill();
}

function draw_o379(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2.5);ctx.stroke();ctx.restore();pen(ctx,'#a855f7',2.5);ctx.beginPath();ctx.moveTo(19,-27);ctx.lineTo(47,-32);ctx.lineTo(41,-23);ctx.closePath();ctx.fillStyle='#ec4899';ctx.fill();
}

function draw_o380(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2.5);ctx.stroke();ctx.restore();pen(ctx,'#84cc16',2.5);ctx.beginPath();ctx.moveTo(20,-26);ctx.lineTo(48,-36);ctx.lineTo(42,-26);ctx.closePath();ctx.fillStyle='#b45309';ctx.fill();
}

function draw_o381(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2.5);ctx.stroke();ctx.restore();pen(ctx,'#f43f5e',2.5);ctx.beginPath();ctx.moveTo(21,-25);ctx.lineTo(49,-35);ctx.lineTo(43,-25);ctx.closePath();ctx.fillStyle='#64748b';ctx.fill();
}

function draw_o382(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2.5);ctx.stroke();ctx.restore();pen(ctx,'#06b6d4',2.5);ctx.beginPath();ctx.moveTo(22,-24);ctx.lineTo(50,-34);ctx.lineTo(44,-24);ctx.closePath();ctx.fillStyle='#0ea5e9';ctx.fill();
}

function draw_o383(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ef4444',2.5);ctx.beginPath();ctx.moveTo(23,-23);ctx.lineTo(51,-33);ctx.lineTo(45,-23);ctx.closePath();ctx.fillStyle='#a855f7';ctx.fill();
}

function draw_o384(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2.5);ctx.stroke();ctx.restore();pen(ctx,'#f97316',2.5);ctx.beginPath();ctx.moveTo(24,-28);ctx.lineTo(52,-32);ctx.lineTo(40,-26);ctx.closePath();ctx.fillStyle='#84cc16';ctx.fill();
}

function draw_o385(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#eab308',2.5);ctx.beginPath();ctx.moveTo(25,-27);ctx.lineTo(46,-36);ctx.lineTo(41,-25);ctx.closePath();ctx.fillStyle='#f43f5e';ctx.fill();
}

function draw_o386(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2.5);ctx.stroke();ctx.restore();pen(ctx,'#22c55e',2.5);ctx.beginPath();ctx.moveTo(26,-26);ctx.lineTo(47,-35);ctx.lineTo(42,-24);ctx.closePath();ctx.fillStyle='#06b6d4';ctx.fill();
}

function draw_o387(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2.5);ctx.stroke();ctx.restore();pen(ctx,'#14b8a6',2.5);ctx.beginPath();ctx.moveTo(18,-25);ctx.lineTo(48,-34);ctx.lineTo(43,-23);ctx.closePath();ctx.fillStyle='#ef4444';ctx.fill();
}

function draw_o388(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2.5);ctx.stroke();ctx.restore();pen(ctx,'#3b82f6',2.5);ctx.beginPath();ctx.moveTo(19,-24);ctx.lineTo(49,-33);ctx.lineTo(44,-26);ctx.closePath();ctx.fillStyle='#f97316';ctx.fill();
}

function draw_o389(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2.5);ctx.stroke();ctx.restore();pen(ctx,'#8b5cf6',2.5);ctx.beginPath();ctx.moveTo(20,-23);ctx.lineTo(50,-32);ctx.lineTo(45,-25);ctx.closePath();ctx.fillStyle='#eab308';ctx.fill();
}

function draw_o390(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2.5);ctx.stroke();ctx.restore();pen(ctx,'#ec4899',2.5);ctx.beginPath();ctx.moveTo(21,-28);ctx.lineTo(51,-36);ctx.lineTo(40,-24);ctx.closePath();ctx.fillStyle='#22c55e';ctx.fill();
}

function draw_o391(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#b45309',2.5);ctx.beginPath();ctx.moveTo(22,-27);ctx.lineTo(52,-35);ctx.lineTo(41,-23);ctx.closePath();ctx.fillStyle='#14b8a6';ctx.fill();
}

function draw_o392(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.24);fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#64748b',2.5);ctx.beginPath();ctx.moveTo(23,-26);ctx.lineTo(46,-34);ctx.lineTo(42,-26);ctx.closePath();ctx.fillStyle='#3b82f6';ctx.fill();
}

function draw_o393(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.36);fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2.5);ctx.stroke();ctx.restore();pen(ctx,'#0ea5e9',2.5);ctx.beginPath();ctx.moveTo(24,-25);ctx.lineTo(47,-33);ctx.lineTo(43,-25);ctx.closePath();ctx.fillStyle='#8b5cf6';ctx.fill();
}

function draw_o394(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.48);fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2.5);ctx.stroke();ctx.restore();pen(ctx,'#a855f7',2.5);ctx.beginPath();ctx.moveTo(25,-24);ctx.lineTo(48,-32);ctx.lineTo(44,-24);ctx.closePath();ctx.fillStyle='#ec4899';ctx.fill();
}

function draw_o395(ctx: Ctx): void {
  ctx.save();ctx.rotate(0);fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2.5);ctx.stroke();ctx.restore();pen(ctx,'#84cc16',2.5);ctx.beginPath();ctx.moveTo(26,-23);ctx.lineTo(49,-36);ctx.lineTo(45,-23);ctx.closePath();ctx.fillStyle='#b45309';ctx.fill();
}

function draw_o396(ctx: Ctx): void {
  ctx.save();ctx.rotate(0.12);fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2.5);ctx.stroke();ctx.restore();pen(ctx,'#f43f5e',2.5);ctx.beginPath();ctx.moveTo(18,-28);ctx.lineTo(50,-35);ctx.lineTo(40,-26);ctx.closePath();ctx.fillStyle='#64748b';ctx.fill();
}

function draw_o397(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(47,0);ctx.lineTo(0,49);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(30,0);ctx.lineTo(0,33);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o398(ctx: Ctx): void {
  fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(48,0);ctx.lineTo(0,50);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(31,0);ctx.lineTo(0,34);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o399(ctx: Ctx): void {
  fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(0,-51);ctx.lineTo(42,0);ctx.lineTo(0,51);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(32,0);ctx.lineTo(0,35);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o400(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(43,0);ctx.lineTo(0,52);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(28,0);ctx.lineTo(0,36);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o401(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-53);ctx.lineTo(44,0);ctx.lineTo(0,53);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(29,0);ctx.lineTo(0,37);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o402(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-54);ctx.lineTo(45,0);ctx.lineTo(0,54);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(30,0);ctx.lineTo(0,32);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o403(ctx: Ctx): void {
  fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(0,-55);ctx.lineTo(46,0);ctx.lineTo(0,55);ctx.lineTo(-46,0);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(31,0);ctx.lineTo(0,33);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o404(ctx: Ctx): void {
  fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(47,0);ctx.lineTo(0,56);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(32,0);ctx.lineTo(0,34);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o405(ctx: Ctx): void {
  fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(48,0);ctx.lineTo(0,48);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(28,0);ctx.lineTo(0,35);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o406(ctx: Ctx): void {
  fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(42,0);ctx.lineTo(0,49);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(29,0);ctx.lineTo(0,36);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o407(ctx: Ctx): void {
  fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(43,0);ctx.lineTo(0,50);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(30,0);ctx.lineTo(0,37);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o408(ctx: Ctx): void {
  fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-51);ctx.lineTo(44,0);ctx.lineTo(0,51);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(31,0);ctx.lineTo(0,32);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o409(ctx: Ctx): void {
  fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(45,0);ctx.lineTo(0,52);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(32,0);ctx.lineTo(0,33);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o410(ctx: Ctx): void {
  fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(0,-53);ctx.lineTo(46,0);ctx.lineTo(0,53);ctx.lineTo(-46,0);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(28,0);ctx.lineTo(0,34);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o411(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(0,-54);ctx.lineTo(47,0);ctx.lineTo(0,54);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(29,0);ctx.lineTo(0,35);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o412(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-55);ctx.lineTo(48,0);ctx.lineTo(0,55);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(30,0);ctx.lineTo(0,36);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o413(ctx: Ctx): void {
  fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(42,0);ctx.lineTo(0,56);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(31,0);ctx.lineTo(0,37);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o414(ctx: Ctx): void {
  fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(43,0);ctx.lineTo(0,48);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(32,0);ctx.lineTo(0,32);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o415(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(44,0);ctx.lineTo(0,49);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(28,0);ctx.lineTo(0,33);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o416(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(45,0);ctx.lineTo(0,50);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(29,0);ctx.lineTo(0,34);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o417(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-51);ctx.lineTo(46,0);ctx.lineTo(0,51);ctx.lineTo(-46,0);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(30,0);ctx.lineTo(0,35);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o418(ctx: Ctx): void {
  fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(47,0);ctx.lineTo(0,52);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(31,0);ctx.lineTo(0,36);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o419(ctx: Ctx): void {
  fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-53);ctx.lineTo(48,0);ctx.lineTo(0,53);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(32,0);ctx.lineTo(0,37);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o420(ctx: Ctx): void {
  fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(0,-54);ctx.lineTo(42,0);ctx.lineTo(0,54);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(28,0);ctx.lineTo(0,32);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o421(ctx: Ctx): void {
  fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(0,-55);ctx.lineTo(43,0);ctx.lineTo(0,55);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(29,0);ctx.lineTo(0,33);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o422(ctx: Ctx): void {
  fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(44,0);ctx.lineTo(0,56);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(30,0);ctx.lineTo(0,34);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o423(ctx: Ctx): void {
  fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(45,0);ctx.lineTo(0,48);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(31,0);ctx.lineTo(0,35);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o424(ctx: Ctx): void {
  fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(46,0);ctx.lineTo(0,49);ctx.lineTo(-46,0);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(32,0);ctx.lineTo(0,36);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o425(ctx: Ctx): void {
  fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(47,0);ctx.lineTo(0,50);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(28,0);ctx.lineTo(0,37);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o426(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(0,-51);ctx.lineTo(48,0);ctx.lineTo(0,51);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(29,0);ctx.lineTo(0,32);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o427(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(42,0);ctx.lineTo(0,52);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(30,0);ctx.lineTo(0,33);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o428(ctx: Ctx): void {
  fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(0,-53);ctx.lineTo(43,0);ctx.lineTo(0,53);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(31,0);ctx.lineTo(0,34);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o429(ctx: Ctx): void {
  fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(0,-54);ctx.lineTo(44,0);ctx.lineTo(0,54);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(32,0);ctx.lineTo(0,35);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o430(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(0,-55);ctx.lineTo(45,0);ctx.lineTo(0,55);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(28,0);ctx.lineTo(0,36);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o431(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(46,0);ctx.lineTo(0,56);ctx.lineTo(-46,0);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(29,0);ctx.lineTo(0,37);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o432(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(47,0);ctx.lineTo(0,48);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(30,0);ctx.lineTo(0,32);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o433(ctx: Ctx): void {
  fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(48,0);ctx.lineTo(0,49);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(31,0);ctx.lineTo(0,33);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o434(ctx: Ctx): void {
  fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(42,0);ctx.lineTo(0,50);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(32,0);ctx.lineTo(0,34);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o435(ctx: Ctx): void {
  fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(0,-51);ctx.lineTo(43,0);ctx.lineTo(0,51);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(28,0);ctx.lineTo(0,35);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o436(ctx: Ctx): void {
  fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(44,0);ctx.lineTo(0,52);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(29,0);ctx.lineTo(0,36);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o437(ctx: Ctx): void {
  fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(0,-53);ctx.lineTo(45,0);ctx.lineTo(0,53);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(30,0);ctx.lineTo(0,37);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o438(ctx: Ctx): void {
  fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-54);ctx.lineTo(46,0);ctx.lineTo(0,54);ctx.lineTo(-46,0);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(31,0);ctx.lineTo(0,32);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o439(ctx: Ctx): void {
  fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-55);ctx.lineTo(47,0);ctx.lineTo(0,55);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(32,0);ctx.lineTo(0,33);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o440(ctx: Ctx): void {
  fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(48,0);ctx.lineTo(0,56);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(28,0);ctx.lineTo(0,34);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o441(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(42,0);ctx.lineTo(0,48);ctx.lineTo(-42,0);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(29,0);ctx.lineTo(0,35);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o442(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(43,0);ctx.lineTo(0,49);ctx.lineTo(-43,0);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(30,0);ctx.lineTo(0,36);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o443(ctx: Ctx): void {
  fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(0,-50);ctx.lineTo(44,0);ctx.lineTo(0,50);ctx.lineTo(-44,0);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(0,-37);ctx.lineTo(31,0);ctx.lineTo(0,37);ctx.lineTo(-31,0);ctx.closePath();ctx.fill();
}

function draw_o444(ctx: Ctx): void {
  fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(0,-51);ctx.lineTo(45,0);ctx.lineTo(0,51);ctx.lineTo(-45,0);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(32,0);ctx.lineTo(0,32);ctx.lineTo(-32,0);ctx.closePath();ctx.fill();
}

function draw_o445(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(46,0);ctx.lineTo(0,52);ctx.lineTo(-46,0);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(28,0);ctx.lineTo(0,33);ctx.lineTo(-28,0);ctx.closePath();ctx.fill();
}

function draw_o446(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(0,-53);ctx.lineTo(47,0);ctx.lineTo(0,53);ctx.lineTo(-47,0);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(29,0);ctx.lineTo(0,34);ctx.lineTo(-29,0);ctx.closePath();ctx.fill();
}

function draw_o447(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(0,-54);ctx.lineTo(48,0);ctx.lineTo(0,54);ctx.lineTo(-48,0);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(30,0);ctx.lineTo(0,35);ctx.lineTo(-30,0);ctx.closePath();ctx.fill();
}

function draw_o448(ctx: Ctx): void {
  fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-40,-26);ctx.lineTo(40,-26);ctx.lineTo(74,26);ctx.lineTo(-74,26);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-69,26,138,5,2);ctx.fill();
}

function draw_o449(ctx: Ctx): void {
  fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-41,-27);ctx.lineTo(41,-27);ctx.lineTo(75,27);ctx.lineTo(-75,27);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#8b5cf6');rect(ctx,-70,27,140,6,2);ctx.fill();
}

function draw_o450(ctx: Ctx): void {
  fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-42,-28);ctx.lineTo(42,-28);ctx.lineTo(76,28);ctx.lineTo(-76,28);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ec4899');rect(ctx,-71,28,142,7,2);ctx.fill();
}

function draw_o451(ctx: Ctx): void {
  fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-43,-29);ctx.lineTo(43,-29);ctx.lineTo(66,29);ctx.lineTo(-66,29);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#b45309');rect(ctx,-61,29,122,8,2);ctx.fill();
}

function draw_o452(ctx: Ctx): void {
  fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(-44,-30);ctx.lineTo(44,-30);ctx.lineTo(67,30);ctx.lineTo(-67,30);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#64748b');rect(ctx,-62,30,124,5,2);ctx.fill();
}

function draw_o453(ctx: Ctx): void {
  fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(-45,-31);ctx.lineTo(45,-31);ctx.lineTo(68,31);ctx.lineTo(-68,31);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#0ea5e9');rect(ctx,-63,31,126,6,2);ctx.fill();
}

function draw_o454(ctx: Ctx): void {
  fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(-46,-32);ctx.lineTo(46,-32);ctx.lineTo(69,32);ctx.lineTo(-69,32);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#a855f7');rect(ctx,-64,32,128,7,2);ctx.fill();
}

function draw_o455(ctx: Ctx): void {
  fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(-34,-33);ctx.lineTo(34,-33);ctx.lineTo(70,33);ctx.lineTo(-70,33);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#84cc16');rect(ctx,-65,33,130,8,2);ctx.fill();
}

function draw_o456(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(-35,-26);ctx.lineTo(35,-26);ctx.lineTo(71,26);ctx.lineTo(-71,26);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#f43f5e');rect(ctx,-66,26,132,5,2);ctx.fill();
}

function draw_o457(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(-36,-27);ctx.lineTo(36,-27);ctx.lineTo(72,27);ctx.lineTo(-72,27);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');rect(ctx,-67,27,134,6,2);ctx.fill();
}

function draw_o458(ctx: Ctx): void {
  fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(-37,-28);ctx.lineTo(37,-28);ctx.lineTo(73,28);ctx.lineTo(-73,28);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#ef4444');rect(ctx,-68,28,136,7,2);ctx.fill();
}

function draw_o459(ctx: Ctx): void {
  fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(-38,-29);ctx.lineTo(38,-29);ctx.lineTo(74,29);ctx.lineTo(-74,29);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#f97316');rect(ctx,-69,29,138,8,2);ctx.fill();
}

function draw_o460(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(-39,-30);ctx.lineTo(39,-30);ctx.lineTo(75,30);ctx.lineTo(-75,30);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#eab308');rect(ctx,-70,30,140,5,2);ctx.fill();
}

function draw_o461(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-40,-31);ctx.lineTo(40,-31);ctx.lineTo(76,31);ctx.lineTo(-76,31);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');rect(ctx,-71,31,142,6,2);ctx.fill();
}

function draw_o462(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-41,-32);ctx.lineTo(41,-32);ctx.lineTo(66,32);ctx.lineTo(-66,32);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');rect(ctx,-61,32,122,7,2);ctx.fill();
}

function draw_o463(ctx: Ctx): void {
  fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-42,-33);ctx.lineTo(42,-33);ctx.lineTo(67,33);ctx.lineTo(-67,33);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-62,33,124,8,2);ctx.fill();
}

function draw_o464(ctx: Ctx): void {
  fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-43,-26);ctx.lineTo(43,-26);ctx.lineTo(68,26);ctx.lineTo(-68,26);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#8b5cf6');rect(ctx,-63,26,126,5,2);ctx.fill();
}

function draw_o465(ctx: Ctx): void {
  fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-44,-27);ctx.lineTo(44,-27);ctx.lineTo(69,27);ctx.lineTo(-69,27);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ec4899');rect(ctx,-64,27,128,6,2);ctx.fill();
}

function draw_o466(ctx: Ctx): void {
  fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-45,-28);ctx.lineTo(45,-28);ctx.lineTo(70,28);ctx.lineTo(-70,28);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#b45309');rect(ctx,-65,28,130,7,2);ctx.fill();
}

function draw_o467(ctx: Ctx): void {
  fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(-46,-29);ctx.lineTo(46,-29);ctx.lineTo(71,29);ctx.lineTo(-71,29);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#64748b');rect(ctx,-66,29,132,8,2);ctx.fill();
}

function draw_o468(ctx: Ctx): void {
  fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(-34,-30);ctx.lineTo(34,-30);ctx.lineTo(72,30);ctx.lineTo(-72,30);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#0ea5e9');rect(ctx,-67,30,134,5,2);ctx.fill();
}

function draw_o469(ctx: Ctx): void {
  fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(-35,-31);ctx.lineTo(35,-31);ctx.lineTo(73,31);ctx.lineTo(-73,31);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#a855f7');rect(ctx,-68,31,136,6,2);ctx.fill();
}

function draw_o470(ctx: Ctx): void {
  fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(-36,-32);ctx.lineTo(36,-32);ctx.lineTo(74,32);ctx.lineTo(-74,32);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#84cc16');rect(ctx,-69,32,138,7,2);ctx.fill();
}

function draw_o471(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(-37,-33);ctx.lineTo(37,-33);ctx.lineTo(75,33);ctx.lineTo(-75,33);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#f43f5e');rect(ctx,-70,33,140,8,2);ctx.fill();
}

function draw_o472(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(-38,-26);ctx.lineTo(38,-26);ctx.lineTo(76,26);ctx.lineTo(-76,26);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');rect(ctx,-71,26,142,5,2);ctx.fill();
}

function draw_o473(ctx: Ctx): void {
  fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(-39,-27);ctx.lineTo(39,-27);ctx.lineTo(66,27);ctx.lineTo(-66,27);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#ef4444');rect(ctx,-61,27,122,6,2);ctx.fill();
}

function draw_o474(ctx: Ctx): void {
  fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(-40,-28);ctx.lineTo(40,-28);ctx.lineTo(67,28);ctx.lineTo(-67,28);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#f97316');rect(ctx,-62,28,124,7,2);ctx.fill();
}

function draw_o475(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(-41,-29);ctx.lineTo(41,-29);ctx.lineTo(68,29);ctx.lineTo(-68,29);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#eab308');rect(ctx,-63,29,126,8,2);ctx.fill();
}

function draw_o476(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-42,-30);ctx.lineTo(42,-30);ctx.lineTo(69,30);ctx.lineTo(-69,30);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');rect(ctx,-64,30,128,5,2);ctx.fill();
}

function draw_o477(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-43,-31);ctx.lineTo(43,-31);ctx.lineTo(70,31);ctx.lineTo(-70,31);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');rect(ctx,-65,31,130,6,2);ctx.fill();
}

function draw_o478(ctx: Ctx): void {
  fill(ctx,'#f43f5e');ctx.beginPath();ctx.moveTo(-44,-32);ctx.lineTo(44,-32);ctx.lineTo(71,32);ctx.lineTo(-71,32);ctx.closePath();ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#3b82f6');rect(ctx,-66,32,132,7,2);ctx.fill();
}

function draw_o479(ctx: Ctx): void {
  fill(ctx,'#06b6d4');ctx.beginPath();ctx.moveTo(-45,-33);ctx.lineTo(45,-33);ctx.lineTo(72,33);ctx.lineTo(-72,33);ctx.closePath();ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#8b5cf6');rect(ctx,-67,33,134,8,2);ctx.fill();
}

function draw_o480(ctx: Ctx): void {
  fill(ctx,'#ef4444');ctx.beginPath();ctx.moveTo(-46,-26);ctx.lineTo(46,-26);ctx.lineTo(73,26);ctx.lineTo(-73,26);ctx.closePath();ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ec4899');rect(ctx,-68,26,136,5,2);ctx.fill();
}

function draw_o481(ctx: Ctx): void {
  fill(ctx,'#f97316');ctx.beginPath();ctx.moveTo(-34,-27);ctx.lineTo(34,-27);ctx.lineTo(74,27);ctx.lineTo(-74,27);ctx.closePath();ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#b45309');rect(ctx,-69,27,138,6,2);ctx.fill();
}

function draw_o482(ctx: Ctx): void {
  fill(ctx,'#eab308');ctx.beginPath();ctx.moveTo(-35,-28);ctx.lineTo(35,-28);ctx.lineTo(75,28);ctx.lineTo(-75,28);ctx.closePath();ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#64748b');rect(ctx,-70,28,140,7,2);ctx.fill();
}

function draw_o483(ctx: Ctx): void {
  fill(ctx,'#22c55e');ctx.beginPath();ctx.moveTo(-36,-29);ctx.lineTo(36,-29);ctx.lineTo(76,29);ctx.lineTo(-76,29);ctx.closePath();ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#0ea5e9');rect(ctx,-71,29,142,8,2);ctx.fill();
}

function draw_o484(ctx: Ctx): void {
  fill(ctx,'#14b8a6');ctx.beginPath();ctx.moveTo(-37,-30);ctx.lineTo(37,-30);ctx.lineTo(66,30);ctx.lineTo(-66,30);ctx.closePath();ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#a855f7');rect(ctx,-61,30,122,5,2);ctx.fill();
}

function draw_o485(ctx: Ctx): void {
  fill(ctx,'#3b82f6');ctx.beginPath();ctx.moveTo(-38,-31);ctx.lineTo(38,-31);ctx.lineTo(67,31);ctx.lineTo(-67,31);ctx.closePath();ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#84cc16');rect(ctx,-62,31,124,6,2);ctx.fill();
}

function draw_o486(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');ctx.beginPath();ctx.moveTo(-39,-32);ctx.lineTo(39,-32);ctx.lineTo(68,32);ctx.lineTo(-68,32);ctx.closePath();ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#f43f5e');rect(ctx,-63,32,126,7,2);ctx.fill();
}

function draw_o487(ctx: Ctx): void {
  fill(ctx,'#ec4899');ctx.beginPath();ctx.moveTo(-40,-33);ctx.lineTo(40,-33);ctx.lineTo(69,33);ctx.lineTo(-69,33);ctx.closePath();ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#06b6d4');rect(ctx,-64,33,128,8,2);ctx.fill();
}

function draw_o488(ctx: Ctx): void {
  fill(ctx,'#b45309');ctx.beginPath();ctx.moveTo(-41,-26);ctx.lineTo(41,-26);ctx.lineTo(70,26);ctx.lineTo(-70,26);ctx.closePath();ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#ef4444');rect(ctx,-65,26,130,5,2);ctx.fill();
}

function draw_o489(ctx: Ctx): void {
  fill(ctx,'#64748b');ctx.beginPath();ctx.moveTo(-42,-27);ctx.lineTo(42,-27);ctx.lineTo(71,27);ctx.lineTo(-71,27);ctx.closePath();ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#f97316');rect(ctx,-66,27,132,6,2);ctx.fill();
}

function draw_o490(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');ctx.beginPath();ctx.moveTo(-43,-28);ctx.lineTo(43,-28);ctx.lineTo(72,28);ctx.lineTo(-72,28);ctx.closePath();ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#eab308');rect(ctx,-67,28,134,7,2);ctx.fill();
}

function draw_o491(ctx: Ctx): void {
  fill(ctx,'#a855f7');ctx.beginPath();ctx.moveTo(-44,-29);ctx.lineTo(44,-29);ctx.lineTo(73,29);ctx.lineTo(-73,29);ctx.closePath();ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#22c55e');rect(ctx,-68,29,136,8,2);ctx.fill();
}

function draw_o492(ctx: Ctx): void {
  fill(ctx,'#84cc16');ctx.beginPath();ctx.moveTo(-45,-30);ctx.lineTo(45,-30);ctx.lineTo(74,30);ctx.lineTo(-74,30);ctx.closePath();ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#14b8a6');rect(ctx,-69,30,138,5,2);ctx.fill();
}

function draw_o493(ctx: Ctx): void {
  fill(ctx,'#3b82f6');circle(ctx,0,0,53);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#f43f5e');circle(ctx,1,0,8);ctx.fill();
}

function draw_o494(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');circle(ctx,0,0,54);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();pen(ctx,'#06b6d4',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o495(ctx: Ctx): void {
  fill(ctx,'#ec4899');circle(ctx,0,0,44);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ef4444');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#22c55e');circle(ctx,14,12,11);ctx.fill();
}

function draw_o496(ctx: Ctx): void {
  fill(ctx,'#b45309');circle(ctx,0,0,45);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#f97316',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o497(ctx: Ctx): void {
  fill(ctx,'#64748b');circle(ctx,0,0,46);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#eab308');circle(ctx,0,1,8);ctx.fill();
}

function draw_o498(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');circle(ctx,0,0,47);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();pen(ctx,'#22c55e',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o499(ctx: Ctx): void {
  fill(ctx,'#a855f7');circle(ctx,0,0,48);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#14b8a6');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#ec4899');circle(ctx,14,12,11);ctx.fill();
}

function draw_o500(ctx: Ctx): void {
  fill(ctx,'#84cc16');circle(ctx,0,0,49);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#3b82f6',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o501(ctx: Ctx): void {
  fill(ctx,'#f43f5e');circle(ctx,0,0,50);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#8b5cf6');circle(ctx,-1,-1,8);ctx.fill();
}

function draw_o502(ctx: Ctx): void {
  fill(ctx,'#06b6d4');circle(ctx,0,0,51);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();pen(ctx,'#ec4899',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o503(ctx: Ctx): void {
  fill(ctx,'#ef4444');circle(ctx,0,0,52);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#b45309');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#a855f7');circle(ctx,14,12,11);ctx.fill();
}

function draw_o504(ctx: Ctx): void {
  fill(ctx,'#f97316');circle(ctx,0,0,53);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#64748b',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o505(ctx: Ctx): void {
  fill(ctx,'#eab308');circle(ctx,0,0,54);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#0ea5e9');circle(ctx,-2,0,8);ctx.fill();
}

function draw_o506(ctx: Ctx): void {
  fill(ctx,'#22c55e');circle(ctx,0,0,44);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();pen(ctx,'#a855f7',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o507(ctx: Ctx): void {
  fill(ctx,'#14b8a6');circle(ctx,0,0,45);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#84cc16');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#ef4444');circle(ctx,14,12,11);ctx.fill();
}

function draw_o508(ctx: Ctx): void {
  fill(ctx,'#3b82f6');circle(ctx,0,0,46);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#f43f5e',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o509(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');circle(ctx,0,0,47);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();fill(ctx,'#06b6d4');circle(ctx,2,1,8);ctx.fill();
}

function draw_o510(ctx: Ctx): void {
  fill(ctx,'#ec4899');circle(ctx,0,0,48);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();pen(ctx,'#ef4444',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o511(ctx: Ctx): void {
  fill(ctx,'#b45309');circle(ctx,0,0,49);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();fill(ctx,'#f97316');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#14b8a6');circle(ctx,14,12,11);ctx.fill();
}

function draw_o512(ctx: Ctx): void {
  fill(ctx,'#64748b');circle(ctx,0,0,50);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#eab308',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o513(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');circle(ctx,0,0,51);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();fill(ctx,'#22c55e');circle(ctx,1,-1,8);ctx.fill();
}

function draw_o514(ctx: Ctx): void {
  fill(ctx,'#a855f7');circle(ctx,0,0,52);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();pen(ctx,'#14b8a6',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o515(ctx: Ctx): void {
  fill(ctx,'#84cc16');circle(ctx,0,0,53);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();fill(ctx,'#3b82f6');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#b45309');circle(ctx,14,12,11);ctx.fill();
}

function draw_o516(ctx: Ctx): void {
  fill(ctx,'#f43f5e');circle(ctx,0,0,54);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#8b5cf6',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o517(ctx: Ctx): void {
  fill(ctx,'#06b6d4');circle(ctx,0,0,44);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();fill(ctx,'#ec4899');circle(ctx,0,0,8);ctx.fill();
}

function draw_o518(ctx: Ctx): void {
  fill(ctx,'#ef4444');circle(ctx,0,0,45);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();pen(ctx,'#b45309',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o519(ctx: Ctx): void {
  fill(ctx,'#f97316');circle(ctx,0,0,46);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();fill(ctx,'#64748b');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#84cc16');circle(ctx,14,12,11);ctx.fill();
}

function draw_o520(ctx: Ctx): void {
  fill(ctx,'#eab308');circle(ctx,0,0,47);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#0ea5e9',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o521(ctx: Ctx): void {
  fill(ctx,'#22c55e');circle(ctx,0,0,48);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();fill(ctx,'#a855f7');circle(ctx,-1,1,8);ctx.fill();
}

function draw_o522(ctx: Ctx): void {
  fill(ctx,'#14b8a6');circle(ctx,0,0,49);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();pen(ctx,'#84cc16',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o523(ctx: Ctx): void {
  fill(ctx,'#3b82f6');circle(ctx,0,0,50);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();fill(ctx,'#f43f5e');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#f97316');circle(ctx,14,12,11);ctx.fill();
}

function draw_o524(ctx: Ctx): void {
  fill(ctx,'#8b5cf6');circle(ctx,0,0,51);ctx.fill();pen(ctx,'#eab308',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#06b6d4',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o525(ctx: Ctx): void {
  fill(ctx,'#ec4899');circle(ctx,0,0,52);ctx.fill();pen(ctx,'#22c55e',2);ctx.stroke();fill(ctx,'#ef4444');circle(ctx,-2,-1,8);ctx.fill();
}

function draw_o526(ctx: Ctx): void {
  fill(ctx,'#b45309');circle(ctx,0,0,53);ctx.fill();pen(ctx,'#14b8a6',2);ctx.stroke();pen(ctx,'#f97316',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o527(ctx: Ctx): void {
  fill(ctx,'#64748b');circle(ctx,0,0,54);ctx.fill();pen(ctx,'#3b82f6',2);ctx.stroke();fill(ctx,'#eab308');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#3b82f6');circle(ctx,14,12,11);ctx.fill();
}

function draw_o528(ctx: Ctx): void {
  fill(ctx,'#0ea5e9');circle(ctx,0,0,44);ctx.fill();pen(ctx,'#8b5cf6',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#22c55e',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o529(ctx: Ctx): void {
  fill(ctx,'#a855f7');circle(ctx,0,0,45);ctx.fill();pen(ctx,'#ec4899',2);ctx.stroke();fill(ctx,'#14b8a6');circle(ctx,2,0,8);ctx.fill();
}

function draw_o530(ctx: Ctx): void {
  fill(ctx,'#84cc16');circle(ctx,0,0,46);ctx.fill();pen(ctx,'#b45309',2);ctx.stroke();pen(ctx,'#3b82f6',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o531(ctx: Ctx): void {
  fill(ctx,'#f43f5e');circle(ctx,0,0,47);ctx.fill();pen(ctx,'#64748b',2);ctx.stroke();fill(ctx,'#8b5cf6');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#64748b');circle(ctx,14,12,11);ctx.fill();
}

function draw_o532(ctx: Ctx): void {
  fill(ctx,'#06b6d4');circle(ctx,0,0,48);ctx.fill();pen(ctx,'#0ea5e9',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#ec4899',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o533(ctx: Ctx): void {
  fill(ctx,'#ef4444');circle(ctx,0,0,49);ctx.fill();pen(ctx,'#a855f7',2);ctx.stroke();fill(ctx,'#b45309');circle(ctx,1,1,8);ctx.fill();
}

function draw_o534(ctx: Ctx): void {
  fill(ctx,'#f97316');circle(ctx,0,0,50);ctx.fill();pen(ctx,'#84cc16',2);ctx.stroke();pen(ctx,'#64748b',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

function draw_o535(ctx: Ctx): void {
  fill(ctx,'#eab308');circle(ctx,0,0,51);ctx.fill();pen(ctx,'#f43f5e',2);ctx.stroke();fill(ctx,'#0ea5e9');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'#f43f5e');circle(ctx,14,12,11);ctx.fill();
}

function draw_o536(ctx: Ctx): void {
  fill(ctx,'#22c55e');circle(ctx,0,0,52);ctx.fill();pen(ctx,'#06b6d4',2);ctx.stroke();for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'#a855f7',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}
}

function draw_o537(ctx: Ctx): void {
  fill(ctx,'#14b8a6');circle(ctx,0,0,53);ctx.fill();pen(ctx,'#ef4444',2);ctx.stroke();fill(ctx,'#84cc16');circle(ctx,0,-1,8);ctx.fill();
}

function draw_o538(ctx: Ctx): void {
  fill(ctx,'#3b82f6');circle(ctx,0,0,54);ctx.fill();pen(ctx,'#f97316',2);ctx.stroke();pen(ctx,'#f43f5e',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();
}

export const BUILDER_DRAW_EXTRA: Record<string, DrawFn> = {
  o101: draw_o101,
  o102: draw_o102,
  o103: draw_o103,
  o104: draw_o104,
  o105: draw_o105,
  o106: draw_o106,
  o107: draw_o107,
  o108: draw_o108,
  o109: draw_o109,
  o110: draw_o110,
  o111: draw_o111,
  o112: draw_o112,
  o113: draw_o113,
  o114: draw_o114,
  o115: draw_o115,
  o116: draw_o116,
  o117: draw_o117,
  o118: draw_o118,
  o119: draw_o119,
  o120: draw_o120,
  o121: draw_o121,
  o122: draw_o122,
  o123: draw_o123,
  o124: draw_o124,
  o125: draw_o125,
  o126: draw_o126,
  o127: draw_o127,
  o128: draw_o128,
  o129: draw_o129,
  o130: draw_o130,
  o131: draw_o131,
  o132: draw_o132,
  o133: draw_o133,
  o134: draw_o134,
  o135: draw_o135,
  o136: draw_o136,
  o137: draw_o137,
  o138: draw_o138,
  o139: draw_o139,
  o140: draw_o140,
  o141: draw_o141,
  o142: draw_o142,
  o143: draw_o143,
  o144: draw_o144,
  o145: draw_o145,
  o146: draw_o146,
  o147: draw_o147,
  o148: draw_o148,
  o149: draw_o149,
  o150: draw_o150,
  o151: draw_o151,
  o152: draw_o152,
  o153: draw_o153,
  o154: draw_o154,
  o155: draw_o155,
  o156: draw_o156,
  o157: draw_o157,
  o158: draw_o158,
  o159: draw_o159,
  o160: draw_o160,
  o161: draw_o161,
  o162: draw_o162,
  o163: draw_o163,
  o164: draw_o164,
  o165: draw_o165,
  o166: draw_o166,
  o167: draw_o167,
  o168: draw_o168,
  o169: draw_o169,
  o170: draw_o170,
  o171: draw_o171,
  o172: draw_o172,
  o173: draw_o173,
  o174: draw_o174,
  o175: draw_o175,
  o176: draw_o176,
  o177: draw_o177,
  o178: draw_o178,
  o179: draw_o179,
  o180: draw_o180,
  o181: draw_o181,
  o182: draw_o182,
  o183: draw_o183,
  o184: draw_o184,
  o185: draw_o185,
  o186: draw_o186,
  o187: draw_o187,
  o188: draw_o188,
  o189: draw_o189,
  o190: draw_o190,
  o191: draw_o191,
  o192: draw_o192,
  o193: draw_o193,
  o194: draw_o194,
  o195: draw_o195,
  o196: draw_o196,
  o197: draw_o197,
  o198: draw_o198,
  o199: draw_o199,
  o200: draw_o200,
  o201: draw_o201,
  o202: draw_o202,
  o203: draw_o203,
  o204: draw_o204,
  o205: draw_o205,
  o206: draw_o206,
  o207: draw_o207,
  o208: draw_o208,
  o209: draw_o209,
  o210: draw_o210,
  o211: draw_o211,
  o212: draw_o212,
  o213: draw_o213,
  o214: draw_o214,
  o215: draw_o215,
  o216: draw_o216,
  o217: draw_o217,
  o218: draw_o218,
  o219: draw_o219,
  o220: draw_o220,
  o221: draw_o221,
  o222: draw_o222,
  o223: draw_o223,
  o224: draw_o224,
  o225: draw_o225,
  o226: draw_o226,
  o227: draw_o227,
  o228: draw_o228,
  o229: draw_o229,
  o230: draw_o230,
  o231: draw_o231,
  o232: draw_o232,
  o233: draw_o233,
  o234: draw_o234,
  o235: draw_o235,
  o236: draw_o236,
  o237: draw_o237,
  o238: draw_o238,
  o239: draw_o239,
  o240: draw_o240,
  o241: draw_o241,
  o242: draw_o242,
  o243: draw_o243,
  o244: draw_o244,
  o245: draw_o245,
  o246: draw_o246,
  o247: draw_o247,
  o248: draw_o248,
  o249: draw_o249,
  o250: draw_o250,
  o251: draw_o251,
  o252: draw_o252,
  o253: draw_o253,
  o254: draw_o254,
  o255: draw_o255,
  o256: draw_o256,
  o257: draw_o257,
  o258: draw_o258,
  o259: draw_o259,
  o260: draw_o260,
  o261: draw_o261,
  o262: draw_o262,
  o263: draw_o263,
  o264: draw_o264,
  o265: draw_o265,
  o266: draw_o266,
  o267: draw_o267,
  o268: draw_o268,
  o269: draw_o269,
  o270: draw_o270,
  o271: draw_o271,
  o272: draw_o272,
  o273: draw_o273,
  o274: draw_o274,
  o275: draw_o275,
  o276: draw_o276,
  o277: draw_o277,
  o278: draw_o278,
  o279: draw_o279,
  o280: draw_o280,
  o281: draw_o281,
  o282: draw_o282,
  o283: draw_o283,
  o284: draw_o284,
  o285: draw_o285,
  o286: draw_o286,
  o287: draw_o287,
  o288: draw_o288,
  o289: draw_o289,
  o290: draw_o290,
  o291: draw_o291,
  o292: draw_o292,
  o293: draw_o293,
  o294: draw_o294,
  o295: draw_o295,
  o296: draw_o296,
  o297: draw_o297,
  o298: draw_o298,
  o299: draw_o299,
  o300: draw_o300,
  o301: draw_o301,
  o302: draw_o302,
  o303: draw_o303,
  o304: draw_o304,
  o305: draw_o305,
  o306: draw_o306,
  o307: draw_o307,
  o308: draw_o308,
  o309: draw_o309,
  o310: draw_o310,
  o311: draw_o311,
  o312: draw_o312,
  o313: draw_o313,
  o314: draw_o314,
  o315: draw_o315,
  o316: draw_o316,
  o317: draw_o317,
  o318: draw_o318,
  o319: draw_o319,
  o320: draw_o320,
  o321: draw_o321,
  o322: draw_o322,
  o323: draw_o323,
  o324: draw_o324,
  o325: draw_o325,
  o326: draw_o326,
  o327: draw_o327,
  o328: draw_o328,
  o329: draw_o329,
  o330: draw_o330,
  o331: draw_o331,
  o332: draw_o332,
  o333: draw_o333,
  o334: draw_o334,
  o335: draw_o335,
  o336: draw_o336,
  o337: draw_o337,
  o338: draw_o338,
  o339: draw_o339,
  o340: draw_o340,
  o341: draw_o341,
  o342: draw_o342,
  o343: draw_o343,
  o344: draw_o344,
  o345: draw_o345,
  o346: draw_o346,
  o347: draw_o347,
  o348: draw_o348,
  o349: draw_o349,
  o350: draw_o350,
  o351: draw_o351,
  o352: draw_o352,
  o353: draw_o353,
  o354: draw_o354,
  o355: draw_o355,
  o356: draw_o356,
  o357: draw_o357,
  o358: draw_o358,
  o359: draw_o359,
  o360: draw_o360,
  o361: draw_o361,
  o362: draw_o362,
  o363: draw_o363,
  o364: draw_o364,
  o365: draw_o365,
  o366: draw_o366,
  o367: draw_o367,
  o368: draw_o368,
  o369: draw_o369,
  o370: draw_o370,
  o371: draw_o371,
  o372: draw_o372,
  o373: draw_o373,
  o374: draw_o374,
  o375: draw_o375,
  o376: draw_o376,
  o377: draw_o377,
  o378: draw_o378,
  o379: draw_o379,
  o380: draw_o380,
  o381: draw_o381,
  o382: draw_o382,
  o383: draw_o383,
  o384: draw_o384,
  o385: draw_o385,
  o386: draw_o386,
  o387: draw_o387,
  o388: draw_o388,
  o389: draw_o389,
  o390: draw_o390,
  o391: draw_o391,
  o392: draw_o392,
  o393: draw_o393,
  o394: draw_o394,
  o395: draw_o395,
  o396: draw_o396,
  o397: draw_o397,
  o398: draw_o398,
  o399: draw_o399,
  o400: draw_o400,
  o401: draw_o401,
  o402: draw_o402,
  o403: draw_o403,
  o404: draw_o404,
  o405: draw_o405,
  o406: draw_o406,
  o407: draw_o407,
  o408: draw_o408,
  o409: draw_o409,
  o410: draw_o410,
  o411: draw_o411,
  o412: draw_o412,
  o413: draw_o413,
  o414: draw_o414,
  o415: draw_o415,
  o416: draw_o416,
  o417: draw_o417,
  o418: draw_o418,
  o419: draw_o419,
  o420: draw_o420,
  o421: draw_o421,
  o422: draw_o422,
  o423: draw_o423,
  o424: draw_o424,
  o425: draw_o425,
  o426: draw_o426,
  o427: draw_o427,
  o428: draw_o428,
  o429: draw_o429,
  o430: draw_o430,
  o431: draw_o431,
  o432: draw_o432,
  o433: draw_o433,
  o434: draw_o434,
  o435: draw_o435,
  o436: draw_o436,
  o437: draw_o437,
  o438: draw_o438,
  o439: draw_o439,
  o440: draw_o440,
  o441: draw_o441,
  o442: draw_o442,
  o443: draw_o443,
  o444: draw_o444,
  o445: draw_o445,
  o446: draw_o446,
  o447: draw_o447,
  o448: draw_o448,
  o449: draw_o449,
  o450: draw_o450,
  o451: draw_o451,
  o452: draw_o452,
  o453: draw_o453,
  o454: draw_o454,
  o455: draw_o455,
  o456: draw_o456,
  o457: draw_o457,
  o458: draw_o458,
  o459: draw_o459,
  o460: draw_o460,
  o461: draw_o461,
  o462: draw_o462,
  o463: draw_o463,
  o464: draw_o464,
  o465: draw_o465,
  o466: draw_o466,
  o467: draw_o467,
  o468: draw_o468,
  o469: draw_o469,
  o470: draw_o470,
  o471: draw_o471,
  o472: draw_o472,
  o473: draw_o473,
  o474: draw_o474,
  o475: draw_o475,
  o476: draw_o476,
  o477: draw_o477,
  o478: draw_o478,
  o479: draw_o479,
  o480: draw_o480,
  o481: draw_o481,
  o482: draw_o482,
  o483: draw_o483,
  o484: draw_o484,
  o485: draw_o485,
  o486: draw_o486,
  o487: draw_o487,
  o488: draw_o488,
  o489: draw_o489,
  o490: draw_o490,
  o491: draw_o491,
  o492: draw_o492,
  o493: draw_o493,
  o494: draw_o494,
  o495: draw_o495,
  o496: draw_o496,
  o497: draw_o497,
  o498: draw_o498,
  o499: draw_o499,
  o500: draw_o500,
  o501: draw_o501,
  o502: draw_o502,
  o503: draw_o503,
  o504: draw_o504,
  o505: draw_o505,
  o506: draw_o506,
  o507: draw_o507,
  o508: draw_o508,
  o509: draw_o509,
  o510: draw_o510,
  o511: draw_o511,
  o512: draw_o512,
  o513: draw_o513,
  o514: draw_o514,
  o515: draw_o515,
  o516: draw_o516,
  o517: draw_o517,
  o518: draw_o518,
  o519: draw_o519,
  o520: draw_o520,
  o521: draw_o521,
  o522: draw_o522,
  o523: draw_o523,
  o524: draw_o524,
  o525: draw_o525,
  o526: draw_o526,
  o527: draw_o527,
  o528: draw_o528,
  o529: draw_o529,
  o530: draw_o530,
  o531: draw_o531,
  o532: draw_o532,
  o533: draw_o533,
  o534: draw_o534,
  o535: draw_o535,
  o536: draw_o536,
  o537: draw_o537,
  o538: draw_o538,
};
