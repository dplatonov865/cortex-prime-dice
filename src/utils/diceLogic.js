// Вычисление куба эффекта
export const calculateEffectDie = (results, selectedIds, setEffectDie) => {
  // Доступные кубы: не выбранные и не единицы и не нули
  const availableDice = results.filter(dice => 
    !selectedIds.includes(dice.id) && !dice.isOne && dice.rolledValue !== 0
  );

  if (availableDice.length === 0) {
    setEffectDie('d4');
    return;
  }

  // Находим куб с наибольшим номиналом
  const maxDie = availableDice.reduce((max, dice) => {
    const diceValue = parseInt(dice.type.replace('d', ''));
    const maxValue = parseInt(max.type.replace('d', ''));
    return diceValue > maxValue ? dice : max;
  }, availableDice[0]);

  setEffectDie(maxDie.type);
};

// Порядок рангов для осложнений
export const RANK_ORDER = ['0', 'd4', 'd6', 'd8', 'd10', 'd12'];

// Получение следующего ранга
export const getNextRank = (currentRank) => {
  const currentIndex = RANK_ORDER.indexOf(currentRank);
  return currentIndex < RANK_ORDER.length - 1 ? RANK_ORDER[currentIndex + 1] : currentRank;
};

// Получение предыдущего ранга
export const getPreviousRank = (currentRank) => {
  const currentIndex = RANK_ORDER.indexOf(currentRank);
  return currentIndex > 0 ? RANK_ORDER[currentIndex - 1] : currentRank;
};