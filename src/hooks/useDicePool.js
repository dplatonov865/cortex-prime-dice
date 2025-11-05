import { useState } from 'react';
import { getDistinctionGroup } from '../constants/distinctions';

export const useDicePool = () => {
  const [dicePool, setDicePool] = useState([]);
  const [usedCategories, setUsedCategories] = useState(new Set());
  const [usedDistinctionGroups, setUsedDistinctionGroups] = useState(new Set());
  const [additionalDieEffect, setAdditionalDieEffect] = useState(false);

  // Добавление куба в пул
  const addToDicePool = (traitId, traitName, diceType, category) => {
    if (diceType === '0') return;

    // Проверяем, использовалась ли уже эта категория
    if (usedCategories.has(category) && !additionalDieEffect) {
      return;
    }

    const newDice = {
      id: Date.now() + Math.random(),
      name: traitName,
      type: diceType,
      value: diceType === '0' ? '0' : parseInt(diceType.replace('d', '')),
      category: category,
      traitId: traitId,
      isBonus: additionalDieEffect
    };

    setDicePool(prev => [...prev, newDice]);

    // Добавляем категорию в использованные (если не в режиме бонуса)
    if (!additionalDieEffect) {
      setUsedCategories(prev => new Set([...prev, category]));

      // Если это отличие, добавляем группу в использованные
      if (category === 'distinctions') {
        const distinctionGroup = getDistinctionGroup(traitName);
        if (distinctionGroup) {
          setUsedDistinctionGroups(prev => new Set([...prev, distinctionGroup]));
        }
      }
    }
  };

  const addQuickDie = (diceType) => {
    const newDice = {
      id: Date.now() + Math.random(),
      name: `Быстрый ${diceType}`,
      type: diceType,
      value: parseInt(diceType.replace('d', '')),
      category: 'quick',
      isBonus: false
    };

    setDicePool(prev => [...prev, newDice]);
  };

  // Удаление куба из пула
  const removeFromDicePool = (diceId) => {
    const diceToRemove = dicePool.find(dice => dice.id === diceId);
    if (diceToRemove && !diceToRemove.isBonus) {
      const category = diceToRemove.category;

      // Удаляем категорию из использованных, если больше нет кубов этой категории
      setUsedCategories(prev => {
        const newUsed = new Set(prev);
        const hasOtherDiceFromSameCategory = dicePool.some(dice =>
          dice.id !== diceId &&
          !dice.isBonus &&
          dice.category === category
        );

        if (!hasOtherDiceFromSameCategory) {
          newUsed.delete(category);
        }
        return newUsed;
      });

      // Если это отличие, проверяем нужно ли удалить группу из использованных
      if (diceToRemove.category === 'distinctions') {
        setUsedDistinctionGroups(prev => {
          const newUsed = new Set(prev);
          // Удаляем группу только если больше нет кубов с этой группой в пуле
          const hasOtherDiceFromSameGroup = dicePool.some(dice =>
            dice.id !== diceId &&
            !dice.isBonus &&
            dice.category === 'distinctions' &&
            getDistinctionGroup(dice.name) === getDistinctionGroup(diceToRemove.name)
          );

          if (!hasOtherDiceFromSameGroup) {
            newUsed.delete(getDistinctionGroup(diceToRemove.name));
          }
          return newUsed;
        });
      }
    }

    setDicePool(prev => prev.filter(dice => dice.id !== diceId));
  };

  // Очистка пула
  const clearDicePool = () => {
    setDicePool([]);
    setUsedCategories(new Set());
    setUsedDistinctionGroups(new Set());
    setAdditionalDieEffect(false);
  };

  // Сброс счетчиков использования
  const clearUsageCounters = () => {
    setUsedCategories(new Set());
    setUsedDistinctionGroups(new Set());
    setAdditionalDieEffect(false);
  };

  // Получение счетчика использования для конкретной характеристики
  const getUsageCount = (category, name) => {
    return usedCategories.has(category) ? 1 : 0;
  };

  // Проверка достигнут ли лимит для характеристики
  const isUsageLimitReached = (category, name) => {
    return usedCategories.has(category) && !additionalDieEffect;
  };

  // Активация режима дополнительного куба
  const activateAdditionalDie = () => {
    setAdditionalDieEffect(true);
  };

  // Деактивация режима дополнительного куба
  const deactivateAdditionalDie = () => {
    setAdditionalDieEffect(false);
  };
  const removeFromUsedCategories = (category) => {
    setUsedCategories(prev => {
      const newUsed = new Set(prev);
      newUsed.delete(category);
      console.log(`Removed ${category} from usedCategories:`, newUsed); // для отладки
      return newUsed;
    });
  };

  return {
    dicePool,
    usageCounters: usedCategories, // Для обратной совместимости
    usedDistinctionGroups,
    additionalDieEffect,
    usedCategories, // ← ДОБАВИТЬ
    removeFromUsedCategories, // ← ДОБАВИТЬ
    addToDicePool,
    removeFromDicePool,
    clearDicePool,
    clearUsageCounters,
    getUsageCount,
    isUsageLimitReached,
    activateAdditionalDie,
    deactivateAdditionalDie,
    setDicePool,
    addQuickDie
  };
};