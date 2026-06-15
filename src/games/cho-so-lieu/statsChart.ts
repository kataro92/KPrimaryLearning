/** Vẽ biểu đồ cột đơn giản cho câu hỏi thống kê */
export function barChartHtml(
  title: string,
  bars: { label: string; value: number; color?: string }[]
): string {
  const max = Math.max(...bars.map((b) => b.value), 1);
  const rows = bars
    .map((b) => {
      const pct = Math.round((b.value / max) * 100);
      const color = b.color ?? '#3b82f6';
      return `
        <div class="cho-chart__row">
          <span class="cho-chart__label">${b.label}</span>
          <div class="cho-chart__track">
            <div class="cho-chart__bar" style="width:${pct}%;background:${color}"></div>
          </div>
          <span class="cho-chart__val">${b.value}</span>
        </div>`;
    })
    .join('');
  return `<div class="cho-chart" role="img" aria-label="${title}"><p class="cho-chart__title">${title}</p>${rows}</div>`;
}
