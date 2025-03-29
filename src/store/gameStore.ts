'use client';

import { create } from 'zustand';
import { GameState, GameStore } from '../types/game';

const INITIAL_STATE: GameState = {
  balance: 1000,
  virtualBalance: 0,
  currentBet: 10,
  diceValues: [1, 1, 1],
  round: 1,
  isRolling: false,
  canContinue: false,
  jackpotAmount: 10000,
  lastWin: 0,
};

const checkWinCondition = (sum: number, round: 1 | 2): { isWin: boolean; multiplier: number } => {
  if (round === 1) {
    if (sum === 9 || sum === 13) {
      return { isWin: true, multiplier: 1 };
    }
    if ([2, 3, 10, 12].includes(sum)) {
      return { isWin: false, multiplier: 0 };
    }
  } else {
    if (sum === 13) {
      return { isWin: true, multiplier: 2 };
    }
    if (sum === 9) {
      return { isWin: false, multiplier: 0 };
    }
  }
  return { isWin: false, multiplier: 0 };
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  setBalance: (balance) => set({ balance }),
  
  setBet: (bet) => {
    if (bet > 0 && bet <= 10) {
      set({ currentBet: bet });
    }
  },

  rollDice: () => {
    const state = get();
    if (state.isRolling || state.balance < state.currentBet) return;

    set({ isRolling: true });

    // Имитация броска костей
    setTimeout(() => {
      const diceValues = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
      const sum = diceValues.reduce((a, b) => a + b, 0);
      const { isWin, multiplier } = checkWinCondition(sum, state.round);

      const winAmount = isWin ? state.currentBet * multiplier : 0;
      const newBalance = state.balance - state.currentBet + winAmount;

      set({
        diceValues,
        balance: newBalance,
        lastWin: winAmount,
        isRolling: false,
        canContinue: isWin && state.round === 1,
      });
    }, 1000);
  },

  continueToNextRound: () => {
    const state = get();
    if (state.round === 1 && state.canContinue) {
      set({ round: 2, canContinue: false });
    }
  },

  cashOut: () => {
    const state = get();
    if (state.canContinue) {
      set({ 
        balance: state.balance + state.lastWin,
        canContinue: false,
        round: 1,
      });
    }
  },

  reset: () => set({ ...INITIAL_STATE, balance: get().balance }),
})); 