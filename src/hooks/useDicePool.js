import { useState } from 'react';
import { getDistinctionGroup } from '../constants/distinctions';

export const useDicePool = () => {
  const [dicePool, setDicePool] = useState([]);
  const [usageCounters, setUsageCounters] = useState({});
  const [usedDistinctionGroups, setUsedDistinctionGroups] = useState(new Set());
  const [additionalDieEffect, setAdditionalDieEffect] = useState(false);

  // Добавление куба в пул
  const addToDicePool = (traitId, traitName, diceType, category) => {
    if (diceType === '0') return;

    const counterKey = `${category}:${traitName}`;
    const currentCount = usageCounters[counterKey] || 0;

    // Проверяем лимит в 3 использования
    if (currentCount >= 3 && !additionalDieEffect) {
      return;
    }

    const newDice = {
      id: Date.now() + Math.random(),
      name: traitName,
      type: diceType,
      value: diceType === '0' ? '0' : parseInt(diceType.replace('d', '')),
      category: category,
      traitId: traitId, // Сохраняем ID трейта для возможного использования
      isBonus: additionalDieEffect
    };

    setDicePool(prev => [...prev, newDice]);

    // Обновляем счетчик использования
    if (!additionalDieEffect) {
      setUsageCounters(prev => ({
        ...prev,
        [counterKey]: currentCount + 1
      }));

      // Если это отличие, добавляем группу в использованные
      if (category === 'distinctions') {
        const distinctionGroup = getDistinctionGroup(traitName);
        if (distinctionGroup) {
          setUsedDistinctionGroups(prev => new Set([...prev, distinctionGroup]));
        }
      }
    }
  };

  // Удаление куба из пула
  const removeFromDicePool = (diceId) => {
    const diceToRemove = dicePool.find(dice => dice.id === diceId);
    if (diceToRemove && !diceToRemove.isBonus) {
      const counterKey = `${diceToRemove.category}:${diceToRemove.name}`;

      setUsageCounters(prev => {
        const currentCount = prev[counterKey] || 0;
        if (currentCount > 0) {
          return {
            ...prev,
            [counterKey]: currentCount - 1
          };
        }
        return prev;
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
    setUsageCounters({});
    setUsedDistinctionGroups(new Set());
    setAdditionalDieEffect(false);
  };

  // Сброс счетчиков использования
  const clearUsageCounters = () => {
    setUsageCounters({});
    setUsedDistinctionGroups(new Set());
    setAdditionalDieEffect(false);
  };

  // Получение счетчика использования для конкретной характеристики
  const getUsageCount = (category, name) => {
    const counterKey = `${category}:${name}`;
    return usageCounters[counterKey] || 0;
  };

  // Проверка достигнут ли лимит для характеристики
  const isUsageLimitReached = (category, name) => {
    const counterKey = `${category}:${name}`;
    return (usageCounters[counterKey] || 0) >= 3;
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
    usageCounters,
    usedDistinctionGroups,
    additionalDieEffect,
    addToDicePool,
    removeFromDicePool,
    clearDicePool,
    clearUsageCounters,
    getUsageCount,
    isUsageLimitReached,
    activateAdditionalDie,
    deactivateAdditionalDie,
    setDicePool
  };
};