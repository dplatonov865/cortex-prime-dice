// Порядок рангов для атрибутов и ролей (без 0)
export const ATTRIBUTE_RANK_ORDER = ['0', 'd6', 'd8', 'd10', 'd12'];

// Порядок рангов для осложнений
export const COMPLICATION_RANK_ORDER = ['0', 'd6', 'd8', 'd10', 'd12'];

// Получение следующего ранга для атрибутов/ролей
export const getNextRank = (currentRank) => {
  const currentIndex = ATTRIBUTE_RANK_ORDER.indexOf(currentRank);
  return currentIndex < ATTRIBUTE_RANK_ORDER.length - 1 ? ATTRIBUTE_RANK_ORDER[currentIndex + 1] : currentRank;
};

// Получение предыдущего ранга для атрибутов/ролей
export const getPreviousRank = (currentRank) => {
  const currentIndex = ATTRIBUTE_RANK_ORDER.indexOf(currentRank);
  return currentIndex > 0 ? ATTRIBUTE_RANK_ORDER[currentIndex - 1] : currentRank;
};

// Получение следующего ранга для осложнений
export const getNextComplicationRank = (currentRank) => {
  const currentIndex = COMPLICATION_RANK_ORDER.indexOf(currentRank);
  return currentIndex < COMPLICATION_RANK_ORDER.length - 1 ? COMPLICATION_RANK_ORDER[currentIndex + 1] : currentRank;
};

// Получение предыдущего ранга для осложнений
export const getPreviousComplicationRank = (currentRank) => {
  const currentIndex = COMPLICATION_RANK_ORDER.indexOf(currentRank);
  return currentIndex > 0 ? COMPLICATION_RANK_ORDER[currentIndex - 1] : currentRank;
};

// Вычисление куба эффекта
export const calculateEffectDie = (results, selectedIds, setEffectDice) => {
  // Доступные кубы: не выбранные для результата, не единицы и не нули
  const availableDice = results.filter(dice =>
    !selectedIds.includes(dice.id) &&
    !dice.isOne &&
    dice.rolledValue !== 0
  );

  if (availableDice.length === 0) {
    // Если нет доступных кубов, устанавливаем d4 как куб эффекта
    setEffectDice([{
      id: 'default-d4',
      type: 'd4',
      name: 'Куб эффекта по умолчанию'
    }]);
    return;
  }

  // Находим максимальный номинал среди доступных кубов
  const maxDieValue = availableDice.reduce((max, dice) => {
    const diceValue = parseInt(dice.type.replace('d', ''));
    return diceValue > max ? diceValue : max;
  }, 0);

  // Находим ПЕРВЫЙ куб с максимальным номиналом
  const effectDie = availableDice.find(dice => {
    const diceValue = parseInt(dice.type.replace('d', ''));
    return diceValue === maxDieValue;
  });

  // Устанавливаем только ОСНОВНОЙ куб эффекта (первый)
  setEffectDice([{
    id: effectDie.id,
    type: effectDie.type,
    name: effectDie.name
  }]);
};