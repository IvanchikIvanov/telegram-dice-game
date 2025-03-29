export interface GameState {
  balance: number;
  virtualBalance: number;
  currentBet: number;
  diceValues: number[];
  round: 1 | 2;
  isRolling: boolean;
  canContinue: boolean;
  jackpotAmount: number;
  lastWin: number;
}

export interface GameStore extends GameState {
  setBalance: (balance: number) => void;
  setBet: (bet: number) => void;
  rollDice: () => void;
  continueToNextRound: () => void;
  cashOut: () => void;
  reset: () => void;
}

export type DiceResult = {
  sum: number;
  isWin: boolean;
  multiplier: number;
}; 