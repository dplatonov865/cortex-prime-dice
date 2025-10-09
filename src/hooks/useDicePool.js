import { useState } from 'react';

export const useDicePool = () => {
  const [dicePool, setDicePool] = useState([]);
  const [usedCategories, setUsedCategories] = useState(new Set());
  const [additionalDieEffect, setAdditionalDieEffect] = useState(false);

  // Добавление куба в пул
  const addToDicePool = (name, diceType, category) => {
    // В режиме дополнительного куба игнорируем проверки использованных категорий
    if (!additionalDieEffect) {
      const mainCategory = getMainCategory(category);
      
      if (usedCategories.has(mainCategory)) {
        return;
      }

      if (category === 'complication' && diceType !== 'd4') {
        return;
      }
      
      if (diceType === '0') return;
    }
    
    const newDice = {
      id: Date.now() + Math.random(),
      name: name,
      type: diceType,
      value: diceType === '0' ? '0' : parseInt(diceType.replace('d', '')),
      category: category,
      mainCategory: getMainCategory(category),
      isBonus: additionalDieEffect
    };
    
    setDicePool(prev => [...prev, newDice]);
    
    if (!additionalDieEffect) {
      setUsedCategories(prev => new Set([...prev, getMainCategory(category)]));
    }
  };

  // Удаление куба из пула
  const removeFromDicePool = (diceId) => {
    const diceToRemove = dicePool.find(dice => dice.id === diceId);
    if (diceToRemove) {
      setDicePool(prev => prev.filter(dice => dice.id !== diceId));
      if (!diceToRemove.isBonus) {
        setUsedCategories(prev => {
          const newUsed = new Set(prev);
          newUsed.delete(diceToRemove.mainCategory);
          return newUsed;
        });
      }
    }
  };

  // Очистка пула
  const clearDicePool = () => {
    setDicePool([]);
    setUsedCategories(new Set());
    setAdditionalDieEffect(false);
  };

  // Сброс использованных категорий
  const clearUsedCategories = () => {
    setUsedCategories(new Set());
    setAdditionalDieEffect(false);
  };

  // Получение основной категории
  const getMainCategory = (category) => {
    if (category.startsWith('distinction:')) {
      return 'distinction';
    }
    return category;
  };

  // Проверка доступности категории
  const isCategoryAvailable = (category) => {
    if (additionalDieEffect) return true;
    
    const mainCategory = getMainCategory(category);
    return !usedCategories.has(mainCategory);
  };

  // Активация режима дополнительного куба
  const activateAdditionalDie = () => {
    setAdditionalDieEffect(true);
  };

  // Деактивация режима дополнительного куба
  const deactivateAdditionalDie = () => {
    setAdditionalDieEffect(false);
  };

  return {
    dicePool,
    usedCategories,
    additionalDieEffect,
    addToDicePool,
    removeFromDicePool,
    clearDicePool,
    clearUsedCategories,
    isCategoryAvailable,
    activateAdditionalDie,
    deactivateAdditionalDie,
    setDicePool
  };
};