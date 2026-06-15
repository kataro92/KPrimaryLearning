export interface FractionVisualSpec {
  shape: 'circle' | 'rect';
  parts: number;
  shaded: number;
  cols?: number;
}

/** SVG/CSS hình tô phần — hỗ trợ nhận biết phân số trực quan */
export function fractionShapeHtml(spec: FractionVisualSpec): string {
  if (spec.shape === 'circle') {
    const step = 360 / spec.parts;
    const shadedDeg = step * spec.shaded;
    return `
      <div class="frac-visual" aria-hidden="true">
        <div class="frac-visual__circle" style="background:conic-gradient(#f59e0b 0deg ${shadedDeg}deg,#fef9c3 ${shadedDeg}deg 360deg)"></div>
      </div>`;
  }
  const cols = spec.cols ?? (spec.parts <= 4 ? spec.parts : 4);
  const cells = Array.from({ length: spec.parts }, (_, i) => {
    const on = i < spec.shaded ? ' frac-visual__cell--on' : '';
    return `<span class="frac-visual__cell${on}"></span>`;
  }).join('');
  return `
    <div class="frac-visual frac-visual--rect" style="--cols:${cols}" aria-hidden="true">
      ${cells}
    </div>`;
}
