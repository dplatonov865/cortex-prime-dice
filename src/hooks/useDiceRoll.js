import { useState } from 'react';
import { calculateEffectDie } from '../utils/diceLogic';

export const useDiceRoll = () => {
  const [rollResults, setRollResults] = useState([]);
  const [selectedDice, setSelectedDice] = useState([]);
  const [result, setResult] = useState(0);
  const [effectDie, setEffectDie] = useState('d4');
  const [rollHistory, setRollHistory] = useState([]);

  // Бросок всех кубов в пуле
  const rollDicePool = (dicePool, setDicePool, clearUsedCategories) => {
    if (dicePool.length === 0) return;

    const results = dicePool.map(dice => {
      const diceValue = dice.type === '0' ? 0 : parseInt(dice.type.replace('d', ''));
      const rolledValue = diceValue === 0 ? 0 : Math.floor(Math.random() * diceValue) + 1;
      
      return {
        ...dice,
        id: Date.now() + Math.random(),
        rolledValue: rolledValue,
        isOne: rolledValue === 1,
        isSelected: false,
        timestamp: new Date().toLocaleTimeString()
      };
    });

    // Сбрасываем выбранные кубы и результаты
    setRollResults(results);
    setSelectedDice([]);
    setResult(0);
    setEffectDie('d4');
    
    // Автоматически вычисляем эффект после броска
    calculateEffectDie(results, [], setEffectDie);

    // Добавляем в историю
    setRollHistory(prev => [
      {
        id: Date.now(),
        results: results,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 4)
    ]);

    // Очищаем пул и сбрасываем использованные категории
    setDicePool([]);
    if (clearUsedCategories) {
      clearUsedCategories();
    }
  };

  // Обработчик кликов по результатам броска
  const handleResultDiceClick = (diceId) => {
    const dice = rollResults.find(d => d.id === diceId);
    if (!dice || dice.isOne || dice.rolledValue === 0) return;

    if (selectedDice.includes(diceId)) {
      // Удаляем из выбранных
      const newSelected = selectedDice.filter(id => id !== diceId);
      setSelectedDice(newSelected);
      updateResultAndEffect(newSelected);
    } else {
      // Добавляем в выбранные
      const newSelected = [...selectedDice, diceId];
      setSelectedDice(newSelected);
      updateResultAndEffect(newSelected);
    }
  };

  // Обновление результата и куба эффекта
  const updateResultAndEffect = (selectedIds) => {
    // Вычисляем сумму выбранных кубов
    const sum = selectedIds.reduce((total, diceId) => {
      const dice = rollResults.find(d => d.id === diceId);
      return total + (dice ? dice.rolledValue : 0);
    }, 0);
    
    setResult(sum);
    
    // Вычисляем куб эффекта
    calculateEffectDie(rollResults, selectedIds, setEffectDie);
  };

  return {
    rollResults,
    selectedDice,
    result,
    effectDie,
    rollHistory,
    rollDicePool,
    handleResultDiceClick,
    setRollResults,
    setSelectedDice,
    setResult,
    setEffectDie
  };
};