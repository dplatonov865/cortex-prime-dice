import React from 'react';
import DiceIcon from './DiceIcon';

const DistinctionBlock = ({ distinctions, onDistinctionClick, onDistinctionChange, isCategoryAvailable, additionalDieEffect = false }) => {
  const handleDistinctionClick = (distinctionName, diceType, category) => {
    if (isCategoryAvailable && !isCategoryAvailable('distinction') && !additionalDieEffect) {
      return;
    }
    onDistinctionClick(distinctionName, diceType, category);
  };

  const handleNameChange = (category, newName) => {
    onDistinctionChange(category, newName);
  };

  const isBlockAvailable = isCategoryAvailable ? isCategoryAvailable('distinction') : true;
  const finalAvailability = isBlockAvailable || additionalDieEffect;

  return (
    <div className={`block distinctions-block ${!finalAvailability ? 'category-used' : ''} ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Природа</h3>
      <div className="distinctions-list">
        {Object.entries(distinctions).map(([category, distinction]) => (
          <div key={category} className="distinction-category">
            <h4 className="distinction-title">{getCategoryTitle(category)}</h4>
            <div className={`distinction-row ${!finalAvailability ? 'row-disabled' : ''}`}>
              <select
                className="distinction-select"
                value={distinction.name}
                onChange={(e) => handleNameChange(category, e.target.value)}
                disabled={!finalAvailability}
              >
                <option value="">Выберите {getCategoryTitle(category).toLowerCase()}...</option>
                {getCategoryOptions(category).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="distinction-dice">
                <div
                  className={`distinction-dice-item ${!finalAvailability ? 'dice-disabled' : ''}`}
                  onClick={() => handleDistinctionClick(
                    distinction.name,
                    'd8',
                    `${getCategoryTitle(category)} (d8)`
                  )}
                  title={
                    !finalAvailability
                      ? 'Уже используется отличие из этого набора'
                      : additionalDieEffect
                        ? 'Эффект дополнительного куба: можно добавить в пул'
                        : 'Клик чтобы добавить d8 в пул'
                  }
                >
                  <DiceIcon
                    type="d8"
                    value="8"
                    clickable={finalAvailability}
                  />
                </div>

                <div
                  className={`distinction-dice-item ${!finalAvailability ? 'dice-disabled' : ''}`}
                  onClick={() => handleDistinctionClick(
                    distinction.name,
                    'd4',
                    `${getCategoryTitle(category)} (d4)`
                  )}
                  title={
                    !finalAvailability
                      ? 'Уже используется отличие из этого набора'
                      : additionalDieEffect
                        ? 'Эффект дополнительного куба: можно добавить в пул'
                        : 'Клик чтобы добавить d4 в пул'
                  }
                >
                  <DiceIcon
                    type="d4"
                    value="4"
                    clickable={finalAvailability}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="distinction-hint">
        {additionalDieEffect
          ? '🎯 Эффект дополнительного куба: можно добавить любое отличие'
          : !isBlockAvailable
            ? '⚡ Отличие уже используется в пуле'
            : '💡 Выберите отличительные черты из списка и добавляйте кубы в пул'
        }
      </div>
    </div>
  );
};

// Функция для получения заголовка категории
const getCategoryTitle = (category) => {
  const titles = {
    'past': 'Темперамент',
    'trait': 'Амбиция',
    'value': 'Ценность'
  };
  return titles[category] || category;
};

// Функция для получения вариантов выбора для каждой категории
const getCategoryOptions = (category) => {
  const options = {
    'past': [
      { value: 'Вспыльчивый', label: 'Вспыльчивый' },
      { value: 'Спокойный', label: 'Спокойный' },
      { value: 'Импульсивный', label: 'Импульсивный' },
      { value: 'Осторожный', label: 'Осторожный' },
      { value: 'Энергичный', label: 'Энергичный' },
      { value: 'Флегматичный', label: 'Флегматичный' },
      { value: 'Оптимистичный', label: 'Оптимистичный' },
      { value: 'Пессимистичный', label: 'Пессимистичный' }
    ],
    'trait': [
      { value: 'Власть', label: 'Власть' },
      { value: 'Знания', label: 'Знания' },
      { value: 'Слава', label: 'Слава' },
      { value: 'Богатство', label: 'Богатство' },
      { value: 'Справедливость', label: 'Справедливость' },
      { value: 'Свобода', label: 'Свобода' },
      { value: 'Защита слабых', label: 'Защита слабых' },
      { value: 'Самосовершенствование', label: 'Самосовершенствование' }
    ],
    'value': [
      { value: 'Семья', label: 'Семья' },
      { value: 'Дружба', label: 'Дружба' },
      { value: 'Честь', label: 'Честь' },
      { value: 'Верность', label: 'Верность' },
      { value: 'Истина', label: 'Истина' },
      { value: 'Милосердие', label: 'Милосердие' },
      { value: 'Равенство', label: 'Равенство' },
      { value: 'Традиции', label: 'Традиции' }
    ]
  };

  return options[category] || [];
};

export default DistinctionBlock;