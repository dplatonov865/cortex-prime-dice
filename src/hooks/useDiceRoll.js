import { useState } from 'react';
import { calculateEffectDie } from '../utils/diceLogic';

export const useDiceRoll = () => {
  const [rollResults, setRollResults] = useState([]);
  const [selectedDice, setSelectedDice] = useState([]);
  const [result, setResult] = useState(0);
  const [effectDice, setEffectDice] = useState([]);
  const [rollHistory, setRollHistory] = useState([]);

  const MAX_SELECTED_DICE = 2;

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

    setRollResults(results);
    setSelectedDice([]);
    setResult(0);
    setEffectDice([]); // ← СБРАСЫВАЕМ МАССИВ

    // Автоматически вычисляем первый куб эффекта
    calculateEffectDie(results, [], setEffectDice);

    setRollHistory(prev => [
      {
        id: Date.now(),
        results: results,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 4)
    ]);

    setDicePool([]);
    if (clearUsedCategories) {
      clearUsedCategories();
    }
  };

  // Обработчик кликов по результатам броска
  const handleResultDiceClick = (diceId) => {
    const dice = rollResults.find(d => d.id === diceId);
    if (!dice || dice.isOne || dice.rolledValue === 0) return;

    const isAtLimit = selectedDice.length >= MAX_SELECTED_DICE;
    const isAlreadySelected = selectedDice.includes(diceId);

    if (isAlreadySelected) {
      // Удаляем из выбранных
      const newSelected = selectedDice.filter(id => id !== diceId);
      setSelectedDice(newSelected);
      updateResultAndEffect(newSelected);
    } else if (!isAtLimit) {
      // Добавляем в выбранные
      const newSelected = [...selectedDice, diceId];
      setSelectedDice(newSelected);
      updateResultAndEffect(newSelected);
    }
  };

  // Проверка, можно ли выбрать куб
  const canSelectDice = (diceId) => {
    const dice = rollResults.find(d => d.id === diceId);
    if (!dice || dice.isOne || dice.rolledValue === 0) return false;

    const isAlreadySelected = selectedDice.includes(diceId);
    const isAtLimit = selectedDice.length >= MAX_SELECTED_DICE;

    return isAlreadySelected || !isAtLimit;
  };

  // Обновление результата и куба эффекта
  const updateResultAndEffect = (selectedIds) => {
    const sum = selectedIds.reduce((total, diceId) => {
      const dice = rollResults.find(d => d.id === diceId);
      return total + (dice ? dice.rolledValue : 0);
    }, 0);

    setResult(sum);

    // Пересчитываем куб эффекта с учетом выбранных кубов
    calculateEffectDie(rollResults, selectedIds, setEffectDice);
  };


  return {
    rollResults,
    selectedDice,
    result,
    effectDice,
    rollHistory,
    rollDicePool,
    handleResultDiceClick,
    canSelectDice,
    maxSelectedDice: MAX_SELECTED_DICE,
    setRollResults,
    setSelectedDice,
    setResult,
    setEffectDice // ← УБЕДИТЕСЬ ЧТО ЭТО ЕСТЬ
  };
};