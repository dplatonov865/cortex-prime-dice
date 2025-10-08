import { useState } from 'react';

export const useDicePool = () => {
  const [dicePool, setDicePool] = useState([]);

  // Добавление куба в пул
  const addToDicePool = (name, diceType, category) => {
    // Не добавляем осложнения с рангом "0"
    if (diceType === '0') return;
    
    const newDice = {
      id: Date.now() + Math.random(),
      name: name,
      type: diceType,
      value: diceType === '0' ? '0' : parseInt(diceType.replace('d', '')),
      category: category // 'attribute', 'role', 'complication', или 'distinction: [категория]'
    };
    
    setDicePool(prev => [...prev, newDice]);
  };

  // Удаление куба из пула
  const removeFromDicePool = (diceId) => {
    setDicePool(prev => prev.filter(dice => dice.id !== diceId));
  };

  // Очистка пула
  const clearDicePool = () => {
    setDicePool([]);
  };

  return {
    dicePool,
    addToDicePool,
    removeFromDicePool,
    clearDicePool,
    setDicePool // Для использования в других хуках
  };
};