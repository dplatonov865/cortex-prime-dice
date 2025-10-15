import { useState } from 'react';

export const useDicePool = () => {
  const [dicePool, setDicePool] = useState([]);
  const [usageCounters, setUsageCounters] = useState({});
  const [additionalDieEffect, setAdditionalDieEffect] = useState(false);

  // Добавление куба в пул
  const addToDicePool = (name, diceType, category) => {
    if (diceType === '0') return;

    const counterKey = `${category}:${name}`;
    const currentCount = usageCounters[counterKey] || 0;

    // Проверяем лимит в 3 использования
    if (currentCount >= 3 && !additionalDieEffect) {
      return;
    }

    const newDice = {
      id: Date.now() + Math.random(),
      name: name,
      type: diceType,
      value: diceType === '0' ? '0' : parseInt(diceType.replace('d', '')),
      category: category,
      isBonus: additionalDieEffect
    };

    setDicePool(prev => [...prev, newDice]);

    // Обновляем счетчик использования
    if (!additionalDieEffect) {
      setUsageCounters(prev => ({
        ...prev,
        [counterKey]: currentCount + 1
      }));
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
    }

    setDicePool(prev => prev.filter(dice => dice.id !== diceId));
  };

  // Очистка пула
  const clearDicePool = () => {
    setDicePool([]);
    setUsageCounters({});
    setAdditionalDieEffect(false);
  };

  // Сброс счетчиков использования
  const clearUsageCounters = () => {
    setUsageCounters({});
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