import { useState } from 'react';

export const useDicePool = () => {
  const [dicePool, setDicePool] = useState([]);
  const [usedCategories, setUsedCategories] = useState(new Set());
  const [plotTokenActive, setPlotTokenActive] = useState(false); // Новое состояние

  // Добавление куба в пул
  const addToDicePool = (name, diceType, category) => {
    // Определяем основную категорию (для блоков)
    const mainCategory = getMainCategory(category);
    
    // Проверяем, не использована ли уже эта категория
    if (usedCategories.has(mainCategory) && !plotTokenActive) {
      return;
    }

    // Не добавляем осложнения с рангом "0" или не d4
    if (category === 'complication' && diceType !== 'd4') {
      return;
    }
    
    // Для остальных категорий проверяем только 0
    if (diceType === '0') return;
    
    const newDice = {
      id: Date.now() + Math.random(),
      name: name,
      type: diceType,
      value: diceType === '0' ? '0' : parseInt(diceType.replace('d', '')),
      category: category,
      mainCategory: mainCategory
    };
    
    setDicePool(prev => [...prev, newDice]);
    
    // ЕСЛИ АКТИВЕН ЖЕТОН СЮЖЕТА - БЛОКИРУЕМ ВСЕ КАТЕГОРИИ
    if (plotTokenActive) {
      const allCategories = ['attribute', 'role', 'complication', 'distinction', 'specialty'];
      setUsedCategories(new Set(allCategories));
      setPlotTokenActive(false); // Сбрасываем режим жетона
    } else {
      // Обычная логика - блокируем только одну категорию
      setUsedCategories(prev => new Set([...prev, mainCategory]));
    }
  };

  // Удаление куба из пула
  const removeFromDicePool = (diceId) => {
    const diceToRemove = dicePool.find(dice => dice.id === diceId);
    if (diceToRemove) {
      setDicePool(prev => prev.filter(dice => dice.id !== diceId));
      setUsedCategories(prev => {
        const newUsed = new Set(prev);
        newUsed.delete(diceToRemove.mainCategory);
        return newUsed;
      });
    }
  };

  // Очистка пула
  const clearDicePool = () => {
    setDicePool([]);
    setUsedCategories(new Set());
    setPlotTokenActive(false); // Сбрасываем режим жетона при очистке
  };

  // Сброс использованных категорий (после броска)
  const clearUsedCategories = () => {
    setUsedCategories(new Set());
    setPlotTokenActive(false);
  };

  // АКТИВАЦИЯ РЕЖИМА ЖЕТОНА СЮЖЕТА
  const activatePlotTokenMode = () => {
    setPlotTokenActive(true);
    setUsedCategories(new Set()); // Разблокируем все категории
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
    // В режиме жетона сюжета все категории доступны
    if (plotTokenActive) return true;
    
    const mainCategory = getMainCategory(category);
    return !usedCategories.has(mainCategory);
  };

  return {
    dicePool,
    usedCategories,
    plotTokenActive, // Экспортируем для отладки/индикации
    addToDicePool,
    removeFromDicePool,
    clearDicePool,
    clearUsedCategories,
    activatePlotTokenMode, // Заменяем unlockAllCategories
    isCategoryAvailable,
    setDicePool
  };
};