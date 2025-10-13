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
      <h3>Отличия</h3>
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
    'past': 'Первое отличие',
    'trait': 'Второе отличие',
    'value': 'Третье отличие'
  };
  return titles[category] || category;
};

// Функция для получения вариантов выбора для каждой категории
const getCategoryOptions = (category) => {
  const options = {
    'past': [
      { 'value': 'Искатель приключений', 'label': 'Искатель приключений' },
      { 'value': 'Одержимый искатель', 'label': 'Одержимый искатель' },
      { 'value': 'Убеждённый скептик', 'label': 'Убеждённый скептик' },
      { 'value': 'Сыщик-любитель', 'label': 'Сыщик-любитель' },
      { 'value': 'Отважный исследователь', 'label': 'Отважный исследователь' },
      { 'value': 'Прожжёный циник', 'label': 'Прожжёный циник' },
      { 'value': 'Дилетант', 'label': 'Дилетант' },
      { 'value': 'Книжный червь', 'label': 'Книжный червь' },
      { 'value': 'Охотник за сокровищами', 'label': 'Охотник за сокровищами' },
      { 'value': 'Правильный', 'label': 'Правильный' },
      { 'value': 'Бунтарь', 'label': 'Бунтарь' },
      { 'value': 'Здоровяк', 'label': 'Здоровяк' },
      { 'value': 'Везунчик', 'label': 'Везунчик' },
      { 'value': 'Прирождённый артист', 'label': 'Прирождённый артист' },
      { 'value': 'Крестоносец', 'label': 'Крестоносец' },
      { 'value': 'Сорвиголова', 'label': 'Сорвиголова' },
      { 'value': 'Аналитик', 'label': 'Аналитик' },
      { 'value': 'Рассеянный профессор', 'label': 'Рассеянный профессор' },
      { 'value': 'Мечтатель', 'label': 'Мечтатель' },
      { 'value': 'Шестое чувство', 'label': 'Шестое чувство' },
      { 'value': 'Атлет от природы', 'label': 'Атлет от природы' },
      { 'value': 'Изгой', 'label': 'Изгой' },
      { 'value': 'Наивный идеалист', 'label': 'Наивный идеалист' },
      { 'value': 'Видящий духов', 'label': 'Видящий духов' },
      { 'value': 'Тень', 'label': 'Тень' },
      { 'value': 'Планировщик', 'label': 'Планировщик' },
      { 'value': 'Наставник', 'label': 'Наставник' },
      { 'value': 'Просто наёмник', 'label': 'Просто наёмник' },
      { 'value': 'Душа компании', 'label': 'Душа компании' },
      { 'value': 'Искупляющий вину', 'label': 'Искупляющий вину' }

    ],
    'trait': [
      { 'value': 'Искатель приключений', 'label': 'Искатель приключений' },
      { 'value': 'Одержимый искатель', 'label': 'Одержимый искатель' },
      { 'value': 'Убеждённый скептик', 'label': 'Убеждённый скептик' },
      { 'value': 'Сыщик-любитель', 'label': 'Сыщик-любитель' },
      { 'value': 'Отважный исследователь', 'label': 'Отважный исследователь' },
      { 'value': 'Прожжёный циник', 'label': 'Прожжёный циник' },
      { 'value': 'Дилетант', 'label': 'Дилетант' },
      { 'value': 'Книжный червь', 'label': 'Книжный червь' },
      { 'value': 'Охотник за сокровищами', 'label': 'Охотник за сокровищами' },
      { 'value': 'Правильный', 'label': 'Правильный' },
      { 'value': 'Бунтарь', 'label': 'Бунтарь' },
      { 'value': 'Здоровяк', 'label': 'Здоровяк' },
      { 'value': 'Везунчик', 'label': 'Везунчик' },
      { 'value': 'Прирождённый артист', 'label': 'Прирождённый артист' },
      { 'value': 'Крестоносец', 'label': 'Крестоносец' },
      { 'value': 'Сорвиголова', 'label': 'Сорвиголова' },
      { 'value': 'Аналитик', 'label': 'Аналитик' },
      { 'value': 'Рассеянный профессор', 'label': 'Рассеянный профессор' },
      { 'value': 'Мечтатель', 'label': 'Мечтатель' },
      { 'value': 'Шестое чувство', 'label': 'Шестое чувство' },
      { 'value': 'Атлет от природы', 'label': 'Атлет от природы' },
      { 'value': 'Изгой', 'label': 'Изгой' },
      { 'value': 'Наивный идеалист', 'label': 'Наивный идеалист' },
      { 'value': 'Видящий духов', 'label': 'Видящий духов' },
      { 'value': 'Тень', 'label': 'Тень' },
      { 'value': 'Планировщик', 'label': 'Планировщик' },
      { 'value': 'Наставник', 'label': 'Наставник' },
      { 'value': 'Просто наёмник', 'label': 'Просто наёмник' },
      { 'value': 'Душа компании', 'label': 'Душа компании' },
      { 'value': 'Искупляющий вину', 'label': 'Искупляющий вину' }
    ],
    'value': [
      { 'value': 'Искатель приключений', 'label': 'Искатель приключений' },
      { 'value': 'Одержимый искатель', 'label': 'Одержимый искатель' },
      { 'value': 'Убеждённый скептик', 'label': 'Убеждённый скептик' },
      { 'value': 'Сыщик-любитель', 'label': 'Сыщик-любитель' },
      { 'value': 'Отважный исследователь', 'label': 'Отважный исследователь' },
      { 'value': 'Прожжёный циник', 'label': 'Прожжёный циник' },
      { 'value': 'Дилетант', 'label': 'Дилетант' },
      { 'value': 'Книжный червь', 'label': 'Книжный червь' },
      { 'value': 'Охотник за сокровищами', 'label': 'Охотник за сокровищами' },
      { 'value': 'Правильный', 'label': 'Правильный' },
      { 'value': 'Бунтарь', 'label': 'Бунтарь' },
      { 'value': 'Здоровяк', 'label': 'Здоровяк' },
      { 'value': 'Везунчик', 'label': 'Везунчик' },
      { 'value': 'Прирождённый артист', 'label': 'Прирождённый артист' },
      { 'value': 'Крестоносец', 'label': 'Крестоносец' },
      { 'value': 'Сорвиголова', 'label': 'Сорвиголова' },
      { 'value': 'Аналитик', 'label': 'Аналитик' },
      { 'value': 'Рассеянный профессор', 'label': 'Рассеянный профессор' },
      { 'value': 'Мечтатель', 'label': 'Мечтатель' },
      { 'value': 'Шестое чувство', 'label': 'Шестое чувство' },
      { 'value': 'Атлет от природы', 'label': 'Атлет от природы' },
      { 'value': 'Изгой', 'label': 'Изгой' },
      { 'value': 'Наивный идеалист', 'label': 'Наивный идеалист' },
      { 'value': 'Видящий духов', 'label': 'Видящий духов' },
      { 'value': 'Тень', 'label': 'Тень' },
      { 'value': 'Планировщик', 'label': 'Планировщик' },
      { 'value': 'Наставник', 'label': 'Наставник' },
      { 'value': 'Просто наёмник', 'label': 'Просто наёмник' },
      { 'value': 'Душа компании', 'label': 'Душа компании' },
      { 'value': 'Искупляющий вину', 'label': 'Искупляющий вину' }
    ]
  };

  return options[category] || [];
};

export default DistinctionBlock;