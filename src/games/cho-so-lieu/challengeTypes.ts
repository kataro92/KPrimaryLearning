/** Câu thống kê / xác suất — SGK Toán 4 */
export type CoinFace = 'S' | 'N';

export interface StatsMcqChallenge {
  kind?: 'mcq';
  prompt: string;
  choices: string[];
  correctIndex: number;
  sgkRef: string;
  chartHtml?: string;
}

export type CoinFlipAsk = 'count-s' | 'count-n' | 'which-more';

export interface CoinFlipChallenge {
  kind: 'coin-flip';
  instruction: string;
  flipCount: number;
  ask: CoinFlipAsk;
  sgkRef: string;
}

export type StatsRound = StatsMcqChallenge | CoinFlipChallenge;

export function isCoinFlipRound(r: StatsRound): r is CoinFlipChallenge {
  return r.kind === 'coin-flip';
}
