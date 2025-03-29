'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  MainButton: {
    setParams: (params: { text: string; color: string }) => void;
  };
}

interface WindowWithTelegram extends Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}

const DiceGame: React.FC = () => {
  const {
    balance,
    currentBet,
    diceValues,
    round,
    isRolling,
    canContinue,
    lastWin,
    setBet,
    rollDice,
    continueToNextRound,
    cashOut,
    reset,
  } = useGameStore();

  useEffect(() => {
    // Инициализация Telegram Mini App
    if (typeof window !== 'undefined') {
      const telegram = (window as unknown as WindowWithTelegram).Telegram;
      const WebApp = telegram?.WebApp;
      
      if (WebApp) {
        WebApp.ready();
        WebApp.expand();

        // Настройка основного цвета в соответствии с темой Telegram
        WebApp.MainButton.setParams({
          text: 'Играть',
          color: '#2ea6ff',
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold mb-2">Игра в кости</h1>
          <p className="text-lg">Баланс: {balance} коинов</p>
          {lastWin > 0 && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-400 mt-2"
            >
              Выигрыш: {lastWin} коинов!
            </motion.p>
          )}
        </div>

        <div className="flex justify-center gap-3 mb-4">
          {diceValues.map((value: number, index: number) => (
            <motion.div
              key={index}
              className="w-14 h-14 bg-white text-black rounded-lg flex items-center justify-center text-xl font-bold"
              animate={{
                rotate: isRolling ? [0, 360] : 0,
                scale: isRolling ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 mb-4">
          <button
            className="flex-1 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            onClick={() => setBet(Math.max(1, currentBet - 1))}
            disabled={isRolling}
          >
            -
          </button>
          <span className="flex-1 text-center text-lg py-1">
            Ставка: {currentBet}
          </span>
          <button
            className="flex-1 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            onClick={() => setBet(Math.min(10, currentBet + 1))}
            disabled={isRolling}
          >
            +
          </button>
        </div>

        <div className="space-y-3">
          <button
            className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            onClick={rollDice}
            disabled={isRolling || balance < currentBet}
          >
            {isRolling ? 'Бросаем...' : 'Бросить кости'}
          </button>

          {canContinue && (
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700 text-sm"
                onClick={continueToNextRound}
              >
                Продолжить
              </button>
              <button
                className="flex-1 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 text-sm"
                onClick={cashOut}
              >
                Забрать
              </button>
            </div>
          )}

          <button
            className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 text-sm"
            onClick={reset}
            disabled={isRolling}
          >
            Новая игра
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Раунд {round} • Сумма для выигрыша: {round === 1 ? '9 или 13' : '13'}
        </div>
      </div>
    </div>
  );
};

export default DiceGame; 