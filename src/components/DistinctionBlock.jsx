import React from 'react';
import DiceIcon from './DiceIcon';
import { DISTINCTION_GROUPS, getDistinctionGroup } from '../constants/distinctions';

const DistinctionBlock = ({
  distinctions,
  onTraitClick,
  onDistinctionChange,
  getUsageCount,
  isUsageLimitReached,
  usedDistinctionGroups,
  additionalDieEffect = false
}) => {
  const handleDistinctionClick = (distinctionId, distinctionName) => {
    if (isUsageLimitReached && isUsageLimitReached('distinctions', distinctionName) && !additionalDieEffect) {
      return;
    }
    onTraitClick(distinctionId, distinctionName, 'd8', 'distinctions');
  };

  const handleNameChange = (distinctionId, newName) => {
    onDistinctionChange(distinctionId, { name: newName });
  };

  // Функция для получения доступных опций для отличия
  const getAvailableOptions = (currentDistinctionId, currentValue) => {
    const allOptions = Object.values(DISTINCTION_GROUPS).flatMap(group => group.options);

    // Если это режим дополнительного куба, показываем все опции
    if (additionalDieEffect) {
      return allOptions;
    }

    // Собираем все выбранные отличия из других слотов
    const otherDistinctions = Object.entries(distinctions)
      .filter(([distinctionId]) => distinctionId !== currentDistinctionId)
      .map(([_, distinction]) => distinction.name)
      .filter(name => name && name !== '');

    // Определяем какие группы уже используются другими отличиями
    const usedGroups = new Set();
    otherDistinctions.forEach(distinctionName => {
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

  // Функция для получения заголовка отличия по ID
  const getDistinctionTitle = (distinctionId) => {
    const titles = {
      '1': 'Первое отличие',
      '2': 'Второе отличие',
      '3': 'Третье отличие'
    };
    return titles[distinctionId] || `Отличие ${distinctionId}`;
  };

  return (
    <div className={`block distinctions-block ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Отличия</h3>
      <div className="distinctions-list">
        {Object.entries(distinctions).map(([distinctionId, distinction]) => {
          const usageCount = getUsageCount ? getUsageCount('distinctions', distinction.name) : 0;
          const isLimitReached = isUsageLimitReached && isUsageLimitReached('distinctions', distinction.name);
          const isClickable = !isLimitReached || additionalDieEffect;

          const availableOptions = getAvailableOptions(distinctionId, distinction.name);

          return (
            <div key={distinctionId} className="distinction-row">
              <h4 className="distinction-title">{getDistinctionTitle(distinctionId)}</h4>

              <div className="distinction-controls">
                <select
                  className="distinction-select"
                  value={distinction.name}
                  // onChange={(e) => handleNameChange(distinctionId, e.target.value)}
                  onChange={(e) => onDistinctionChange(distinctionId, { name: e.target.value })}
                >
                  <option value="">Выберите отличие...</option>
                  {availableOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div
                  className={`distinction-dice ${!isClickable ? 'dice-disabled' : ''}`}
                  onClick={() => handleDistinctionClick(distinctionId, distinction.name)}
                  title={
                    !distinction.name
                      ? 'Сначала выберите отличие'
                      : !isClickable
                        ? 'Достигнут лимит в 3 использования'
                        : additionalDieEffect
                          ? 'Эффект дополнительного куба: можно добавить в пул'
                          : `Клик чтобы добавить d8 в пул (использовано: ${usageCount}/3)`
                  }
                >
                  <DiceIcon
                    type="d8"
                    value="8"
                    clickable={isClickable && !!distinction.name}
                  />
                  {usageCount > 0 && (
                    <span className="usage-counter-small"> x {usageCount}</span>
                  )}
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

export default DistinctionBlock;