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
  usedCategories,
  unlockedCategories, // ← НОВЫЙ ПРОПС
  additionalDieEffect = false
}) => {
  // const handleDistinctionClick = (distinctionId, distinctionName) => {
  //   if (isUsageLimitReached && isUsageLimitReached('distinctions', distinctionName) && !additionalDieEffect) {
  //     return;
  //   }
  //   onTraitClick(distinctionId, distinctionName, 'd8', 'distinctions');
  // };

  const handleDistinctionClick = (distinctionId, distinctionName, diceType = 'd8') => {
    // ПРОВЕРЯЕМ РАЗБЛОКИРОВКУ ТОЛЬКО ДЛЯ КУБОВ
    const isUnlocked = unlockedCategories.has('distinctions') || additionalDieEffect;

    if (!isUnlocked) {
      return; // Блокируем клик на кубе если не разблокировано
    }

    if (isUsageLimitReached && isUsageLimitReached('distinctions', distinctionName) && !additionalDieEffect) {
      return;
    }

    const actualDiceType = distinctionId === 'd4_fallback' ? 'd4' : diceType;
    onTraitClick(distinctionId, distinctionName, actualDiceType, 'distinctions');
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
      '1': 'Первая черта',
      '2': 'Вторая черта',
      '3': 'Третья черта'
    };
    return titles[distinctionId] || `Черта ${distinctionId}`;
  };

  return (
    <div className={`block distinctions-block ${additionalDieEffect ? 'bonus-mode' :
        !unlockedCategories.has('distinctions') ? 'locked-mode' : ''
      }`}>
      <h3>
        Черты
        {!unlockedCategories.has('distinctions') && !additionalDieEffect && ' 🔒'}
        {unlockedCategories.has('distinctions') && ' ✅'}
      </h3>

      <div className="distinctions-list">
        {Object.entries(distinctions).map(([distinctionId, distinction]) => {
          const usageCount = getUsageCount ? getUsageCount('distinctions', distinction.name) : 0;
          const isLimitReached = isUsageLimitReached && isUsageLimitReached('distinctions', distinction.name);
          const isUnlocked = unlockedCategories.has('distinctions') || additionalDieEffect;
          const isClickable = isUnlocked && (!isLimitReached || additionalDieEffect);

          return (
            <div key={distinctionId} className="distinction-row">
              <h4 className="distinction-title">{getDistinctionTitle(distinctionId)}</h4>

              <div className="distinction-controls">
                {/* INPUT ВСЕГДА РЕДАКТИРУЕМЫЙ */}
                <input
                  type="text"
                  className="distinction-input"
                  value={distinction.name}
                  onChange={(e) => onDistinctionChange(distinctionId, { name: e.target.value })}
                  placeholder="Введите название черты..."
                  maxLength={30}
                // УБИРАЕМ disabled - input всегда активен
                />

                <div
                  className={`distinction-dice ${!isClickable ? 'dice-disabled' : ''
                    } ${!isUnlocked ? 'dice-locked' : ''}`}
                  onClick={() => handleDistinctionClick(distinctionId, distinction.name)}
                  title={
                    !isUnlocked
                      ? 'Используйте жетон сюжета чтобы разблокировать черту'
                      : !distinction.name
                        ? 'Сначала введите название черты'
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
                    clickable={isClickable && !!distinction.name && isUnlocked} // ← ВАЖНО: проверяем isUnlocked
                  />
                  {usageCount > 0 && (
                    <span className="usage-counter-small"> x {usageCount}</span>
                  )}
                  {!isUnlocked && <span className="lock-indicator">🔒</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="distinction-d4-row">
        <div className="distinction-d4-info">
          <span className="d4-label">Если ни одна из ценностей не подходит:</span>
        </div>

        <div className="distinction-d4-controls">
          <div
            className={`distinction-d4-dice ${(usedCategories.has('distinctions') && !additionalDieEffect) || !unlockedCategories.has('distinctions') ? 'dice-disabled' : ''
              }`}
            onClick={() => handleDistinctionClick('d4_fallback', 'Без ценности', 'd4')}
            title={
              !unlockedCategories.has('distinctions')
                ? 'Используйте жетон сюжета чтобы разблокировать отличия'
                : usedCategories.has('distinctions') && !additionalDieEffect
                  ? 'Отличия уже использованы'
                  : additionalDieEffect
                    ? 'Эффект дополнительного куба: можно добавить в пул'
                    : 'Добавить d4 в пул (блокирует отличия)'
            }
          >
            <DiceIcon
              type="d4"
              value="4"
              clickable={unlockedCategories.has('distinctions') && (!usedCategories.has('distinctions') || additionalDieEffect)}
            />
            <span className="d4-description">добавить d4</span>
            {!unlockedCategories.has('distinctions') && <span className="lock-indicator">🔒</span>}
          </div>
        </div>
      </div> */}

      <div className="distinction-hint">
        {!unlockedCategories.has('distinctions') && !additionalDieEffect
          ? '🔒 Вводите названия черт, затем используйте жетон сюжета чтобы разблокировать их использование'
          : additionalDieEffect
            ? '🎯 Эффект дополнительного куба: можно добавить любое отличие'
            : '💡 Выберите отличия из разных групп. При выборе отличия из группы, другие отличия из этой группы становятся недоступны.'
        }
      </div>
    </div>
  );
};

export default DistinctionBlock;