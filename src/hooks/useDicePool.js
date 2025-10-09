import { useState } from 'react';

export const useDicePool = () => {
  const [dicePool, setDicePool] = useState([]);
  const [usedCategories, setUsedCategories] = useState(new Set());
  const [additionalDieEffect, setBonusMode] = useState(false);

  // Добавление куба в пул
  const addToDicePool = (name, diceType, category) => {
    // В бонусном режиме игнорируем проверки использованных категорий
    if (!additionalDieEffect) {
      const mainCategory = getMainCategory(category);
      
      // Проверяем, не использована ли уже эта категория
      if (usedCategories.has(mainCategory)) {
        return;
      }

      // Не добавляем осложнения с рангом "0" или не d4
      if (category === 'complication' && diceType !== 'd4') {
        return;
      }
      
      // Для остальных категорий проверяем только 0
      if (diceType === '0') return;
    }
    
    const newDice = {
      id: Date.now() + Math.random(),
      name: name,
      type: diceType,
      value: diceType === '0' ? '0' : parseInt(diceType.replace('d', '')),
      category: category,
      mainCategory: getMainCategory(category),
      isBonus: additionalDieEffect // помечаем бонусные кубы
    };
    
    setDicePool(prev => [...prev, newDice]);
    
    // В обычном режиме добавляем категорию в использованные
    if (!additionalDieEffect) {
      setUsedCategories(prev => new Set([...prev, getMainCategory(category)]));
    }
  };

  // Удаление куба из пула
  const removeFromDicePool = (diceId) => {
    const diceToRemove = dicePool.find(dice => dice.id === diceId);
    if (diceToRemove) {
      setDicePool(prev => prev.filter(dice => dice.id !== diceId));
      // Удаляем категорию из использованных только если это не бонусный куб
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
    setBonusMode(false);
  };

  // Сброс использованных категорий (после броска)
  const clearUsedCategories = () => {
    setUsedCategories(new Set());
    setBonusMode(false);
  };

  // Получение основной категории
  const getMainCategory = (category) => {
    if (category.startsWith('distinction:')) {
      return 'distinction';
    }
    return category;
  };

  // Проверка, доступна ли категория для добавления
  const isCategoryAvailable = (category) => {
    // В бонусном режиме все категории доступны (кроме осложнений с неправильным рангом)
    if (additionalDieEffect) return true;
    
    const mainCategory = getMainCategory(category);
    return !usedCategories.has(mainCategory);
  };

  // Активация бонусного режима
  const activateAdditionalDie = () => {
    setBonusMode(true);
  };

  // Деактивация бонусного режима
  const deactivateAdditionalDie = () => {
    setBonusMode(false);
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