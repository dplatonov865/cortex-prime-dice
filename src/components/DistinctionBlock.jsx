import React from 'react';
import DiceIcon from './DiceIcon';
import { DISTINCTION_GROUPS, getDistinctionGroup } from '../constants/distinctions';

const DistinctionBlock = ({
  distinctions,
  onDistinctionClick,
  onDistinctionChange,
  getUsageCount,
  isUsageLimitReached,
  usedDistinctionGroups,
  additionalDieEffect = false
}) => {
  const handleDistinctionClick = (distinctionName, diceType, category) => {
    if (isUsageLimitReached && isUsageLimitReached('distinction', `${category}:${distinctionName}`) && !additionalDieEffect) {
      return;
    }
    onDistinctionClick(distinctionName, diceType, category);
  };

  const handleNameChange = (category, newName) => {
    onDistinctionChange(category, newName);
  };

  // Функция для получения доступных опций для категории
  const getAvailableOptions = (currentCategory, currentValue) => {
    const allOptions = Object.values(DISTINCTION_GROUPS).flatMap(group => group.options);

    // Если это режим дополнительного куба, показываем все опции
    if (additionalDieEffect) {
      return allOptions;
    }

    // Собираем все выбранные отличия из других категорий
    const otherCategories = Object.entries(distinctions)
      .filter(([categoryKey]) => categoryKey !== currentCategory)
      .map(([_, distinction]) => distinction.name)
      .filter(name => name && name !== '');

    // Определяем какие группы уже используются другими отличиями
    const usedGroups = new Set();
    otherCategories.forEach(distinctionName => {
      const group = getDistinctionGroup(distinctionName);
      if (group) {
        usedGroups.add(group);
      }
    });

    // Добавляем группы из usedDistinctionGroups
    if (usedDistinctionGroups) {
      usedDistinctionGroups.forEach(group => usedGroups.add(group));
    }

    // Фильтруем опции: показываем только из неиспользованных групп + текущее значение
    const availableOptions = allOptions.filter(option => {
      const optionGroup = getDistinctionGroup(option.value);
      // Показываем опцию если:
      // 1. Это текущее выбранное значение
      // 2. Группа опции не используется другими отличиями
      // 3. Группа опции не заблокирована через usedDistinctionGroups
      return option.value === currentValue || !usedGroups.has(optionGroup);
    });

    return availableOptions;
  };

  return (
    <div className={`block distinctions-block ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Отличия</h3>
      <div className="distinctions-list">
        {Object.entries(distinctions).map(([category, distinction]) => {
          const usageCountD8 = getUsageCount ? getUsageCount('distinction', `${getCategoryTitle(category)} (d8):${distinction.name}`) : 0;
          const usageCountD4 = getUsageCount ? getUsageCount('distinction', `${getCategoryTitle(category)} (d4):${distinction.name}`) : 0;

          const isLimitReachedD8 = isUsageLimitReached && isUsageLimitReached('distinction', `${getCategoryTitle(category)} (d8):${distinction.name}`);
          const isLimitReachedD4 = isUsageLimitReached && isUsageLimitReached('distinction', `${getCategoryTitle(category)} (d4):${distinction.name}`);

          const isClickableD8 = !isLimitReachedD8 || additionalDieEffect;
          const isClickableD4 = !isLimitReachedD4 || additionalDieEffect;

          const availableOptions = getAvailableOptions(category, distinction.name);

          return (
            <div key={category} className="distinction-category">
              <h4 className="distinction-title">{getCategoryTitle(category)}</h4>
              <div className="distinction-row">
                <select
                  className="distinction-select"
                  value={distinction.name}
                  onChange={(e) => handleNameChange(category, e.target.value)}
                >
                  <option value="">Выберите {getCategoryTitle(category).toLowerCase()}...</option>
                  {availableOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="distinction-dice">
                  <div
                    className={`distinction-dice-item ${!isClickableD8 ? 'dice-disabled' : ''}`}
                    onClick={() => handleDistinctionClick(
                      distinction.name,
                      'd8',
                      `${getCategoryTitle(category)} (d8)`
                    )}
                    title={
                      !isClickableD8
                        ? 'Достигнут лимит в 3 использования'
                        : additionalDieEffect
                          ? 'Эффект дополнительного куба: можно добавить в пул'
                          : `Клик чтобы добавить d8 в пул (использовано: ${usageCountD8}/3)`
                    }
                  >
                    <DiceIcon
                      type="d8"
                      value="8"
                      clickable={isClickableD8}
                    />
                    {usageCountD8 > 0 && (
                      <span className="usage-counter-small">X{usageCountD8}</span>
                    )}
                  </div>

                  <div
                    className={`distinction-dice-item ${!isClickableD4 ? 'dice-disabled' : ''}`}
                    onClick={() => handleDistinctionClick(
                      distinction.name,
                      'd4',
                      `${getCategoryTitle(category)} (d4)`
                    )}
                    title={
                      !isClickableD4
                        ? 'Достигнут лимит в 3 использования'
                        : additionalDieEffect
                          ? 'Эффект дополнительного куба: можно добавить в пул'
                          : `Клик чтобы добавить d4 в пул (использовано: ${usageCountD4}/3)`
                    }
                  >
                    <DiceIcon
                      type="d4"
                      value="4"
                      clickable={isClickableD4}
                    />
                    {usageCountD4 > 0 && (
                      <span className="usage-counter-small">X{usageCountD4}</span>
                    )}
                  </div>
                </div>
              </div>
              {availableOptions.length === 1 && distinction.name && (
                <div className="distinction-warning">
                  ⚠️ Все группы отличий уже используются
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="distinction-hint">
        {additionalDieEffect
          ? '🎯 Эффект дополнительного куба: можно добавить любое отличие'
          : '💡 Выберите отличительные черты из разных групп. При выборе отличия из группы, другие отличия из этой группы становятся недоступны.'
        }
      </div>
    </div>
  );
};

// Функция для получения заголовка категории
const getCategoryTitle = (category) => {
  const titles = {
    'past': 'Первое отличие',
    'trait': 'Второе отличие',
    'value': 'Третье отличие'
  };
  return titles[category] || category;
};

export default DistinctionBlock;