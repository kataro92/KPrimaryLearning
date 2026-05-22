import type { PlayResult } from '@/features/gameplay/types';

export type ResultTier = 'excellent' | 'good' | 'pass' | 'low';

export function getResultTier(score: number): ResultTier {
  if (score >= 9) return 'excellent';
  if (score >= 7) return 'good';
  if (score >= 5) return 'pass';
  return 'low';
}

export interface ResultPresentation {
  tier: ResultTier;
  title: string;
  emoji: string;
  message: string;
  cardClass: string;
}

export function buildResultPresentation(result: PlayResult, celebration: boolean): ResultPresentation {
  const tier = getResultTier(result.score);

  if (result.unlocked && result.newAchievementName) {
    return {
      tier: tier === 'low' ? 'good' : tier,
      title: 'Danh hiệu mới!',
      emoji: '🏆',
      message: `Chúc mừng! Con đã mở: ${result.newAchievementName}`,
      cardClass: 'result-card result-card--unlock',
    };
  }

  if (celebration || tier === 'excellent') {
    return {
      tier: 'excellent',
      title: 'Xuất sắc!',
      emoji: '🎉',
      message: 'Con làm thật giỏi! Thật đáng tự hào!',
      cardClass: 'result-card result-card--excellent',
    };
  }

  if (tier === 'good') {
    return {
      tier: 'good',
      title: 'Giỏi lắm!',
      emoji: '✨',
      message: 'Cố thêm chút nữa là lên danh hiệu mới nhé!',
      cardClass: 'result-card result-card--good',
    };
  }

  if (tier === 'pass') {
    return {
      tier: 'pass',
      title: 'Đã đạt!',
      emoji: '👍',
      message: 'Chơi thêm một lượt, con sẽ tiến bộ nhanh hơn!',
      cardClass: 'result-card result-card--pass',
    };
  }

  return {
    tier: 'low',
    title: 'Cố lên nhé!',
    emoji: '💪',
    message: 'Không sao, luyện thêm một lượt con sẽ giỏi hơn!',
    cardClass: 'result-card result-card--low',
  };
}
