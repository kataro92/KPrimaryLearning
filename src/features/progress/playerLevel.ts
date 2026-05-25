/** Cấp nhân vật đơn giản — tổng hợp từ lượt chơi, điểm và mốc game. */

export const PLAYER_LEVEL_TITLES = [
  'Tập sĩ mới',
  'Học trò chăm',
  'Ngôi sao nhỏ',
  'Nhà khám phá',
  'Hiệp sĩ áo xanh',
  'Trạng Nguyên nhí',
  'Anh hùng lớp 4',
  'Bậc thầy',
  'Huyền thoại',
  'Vua học đường',
] as const;

/** Ngưỡng XP tích lũy để lên cấp (cấp 1 = 0). */
const LEVEL_XP_THRESHOLDS = [0, 45, 110, 200, 310, 440, 590, 760, 950, 1180, 1480];

export interface PlayerLevelInput {
  totalSessions: number;
  avgScore: number;
  unlockedTier3: number;
  totalQuestions: number;
}

export interface PlayerLevelSnapshot {
  level: number;
  title: string;
  nextTitle: string | null;
  xp: number;
  xpCurrentLevel: number;
  xpNextLevel: number;
  progressPct: number;
  maxLevel: number;
}

export function computePlayerXp(input: PlayerLevelInput): number {
  const { totalSessions, avgScore, unlockedTier3, totalQuestions } = input;
  return Math.round(
    totalSessions * 10 +
      avgScore * 14 +
      unlockedTier3 * 45 +
      Math.min(totalQuestions, 400) * 0.4
  );
}

export function getPlayerLevelSnapshot(input: PlayerLevelInput): PlayerLevelSnapshot {
  const xp = computePlayerXp(input);
  const maxLevel = PLAYER_LEVEL_TITLES.length;
  let level = 1;
  for (let i = maxLevel - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP_THRESHOLDS[i]!) {
      level = i + 1;
      break;
    }
  }
  const floor = LEVEL_XP_THRESHOLDS[level - 1] ?? 0;
  const ceiling =
    level < maxLevel ? LEVEL_XP_THRESHOLDS[level]! : LEVEL_XP_THRESHOLDS[maxLevel]!;
  const span = Math.max(1, ceiling - floor);
  const xpCurrentLevel = xp - floor;
  const progressPct =
    level >= maxLevel ? 100 : Math.min(100, Math.round((xpCurrentLevel / span) * 100));

  return {
    level,
    title: PLAYER_LEVEL_TITLES[level - 1] ?? PLAYER_LEVEL_TITLES[0],
    nextTitle: level < maxLevel ? PLAYER_LEVEL_TITLES[level]! : null,
    xp,
    xpCurrentLevel,
    xpNextLevel: level < maxLevel ? ceiling - xp : 0,
    progressPct,
    maxLevel,
  };
}

export function renderPlayerLevelLadder(snapshot: PlayerLevelSnapshot): string {
  const steps = snapshot.maxLevel;
  const dots = Array.from({ length: steps }, (_, i) => {
    const n = i + 1;
    let cls = 'player-level__step';
    if (n < snapshot.level) cls += ' player-level__step--done';
    if (n === snapshot.level) cls += ' player-level__step--current';
    return `<span class="${cls}" title="Cấp ${n}"></span>`;
  }).join('');

  const nextLine =
    snapshot.nextTitle != null
      ? `<p class="player-level__next">Còn <strong>${snapshot.xpNextLevel}</strong> điểm kinh nghiệm → <strong>${escapeHtml(snapshot.nextTitle)}</strong></p>`
      : `<p class="player-level__next">Bạn đã đạt cấp cao nhất. Giỏi lắm!</p>`;

  return `
    <section class="player-level clay-card" aria-label="Cấp độ nhân vật">
      <div class="player-level__head">
        <span class="player-level__badge">Cấp ${snapshot.level}</span>
        <h3 class="player-level__title">${escapeHtml(snapshot.title)}</h3>
      </div>
      <div class="player-level__track" role="progressbar" aria-valuenow="${snapshot.progressPct}" aria-valuemin="0" aria-valuemax="100">
        <span class="player-level__fill" style="width:${snapshot.progressPct}%"></span>
      </div>
      <div class="player-level__steps" aria-hidden="true">${dots}</div>
      ${nextLine}
      <p class="player-level__xp">Điểm kinh nghiệm: <strong>${snapshot.xp}</strong></p>
    </section>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
