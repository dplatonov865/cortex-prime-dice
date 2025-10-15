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
      { 'value': 'Здоровяк', 'label': 'Здоровяк' },
      { 'value': 'Многоборец', 'label': 'Многоборец' },
      { 'value': 'Проныра', 'label': 'Проныра' },
      { 'value': 'Сорвиголова', 'label': 'Сорвиголова' },
      { 'value': 'Золотые руки', 'label': 'Золотые руки' },
      { 'value': 'Наивный идеалист', 'label': 'Наивный идеалист' },
      { 'value': 'Прожжённый циник', 'label': 'Прожжённый циник' },
      { 'value': 'Крестоносец', 'label': 'Крестоносец' },
      { 'value': 'Истинно верующий', 'label': 'Истинно верующий' },
      { 'value': 'Искатель приключений', 'label': 'Искатель приключений' },
      { 'value': 'Убеждённый скептик', 'label': 'Убеждённый скептик' },
      { 'value': 'Сыщик-любитель', 'label': 'Сыщик-любитель' },
      { 'value': 'Дилетант', 'label': 'Дилетант' },
      { 'value': 'Рассеянный профессор', 'label': 'Рассеянный профессор' },
      { 'value': 'Планировщик', 'label': 'Планировщик' },
      { 'value': 'Душа компании', 'label': 'Душа компании' },
      { 'value': 'Прирождённый артист', 'label': 'Прирождённый артист' },
      { 'value': 'Кукловод', 'label': 'Кукловод' },
      { 'value': 'Наставник', 'label': 'Наставник' },
      { 'value': 'Брутальный', 'label': 'Брутальный' },
      { 'value': 'Видящий духов', 'label': 'Видящий духов' },
      { 'value': 'Дьявольски везучий', 'label': 'Дьявольски везучий' },
      { 'value': 'Провидец', 'label': 'Провидец' },
      { 'value': 'Сновидец', 'label': 'Сновидец' },
      { 'value': 'Отмеченный судьбой', 'label': 'Отмеченный судьбой' }
    ],
    'trait': [
      { 'value': 'Здоровяк', 'label': 'Здоровяк' },
      { 'value': 'Многоборец', 'label': 'Многоборец' },
      { 'value': 'Проныра', 'label': 'Проныра' },
      { 'value': 'Сорвиголова', 'label': 'Сорвиголова' },
      { 'value': 'Золотые руки', 'label': 'Золотые руки' },
      { 'value': 'Наивный идеалист', 'label': 'Наивный идеалист' },
      { 'value': 'Прожжённый циник', 'label': 'Прожжённый циник' },
      { 'value': 'Крестоносец', 'label': 'Крестоносец' },
      { 'value': 'Истинно верующий', 'label': 'Истинно верующий' },
      { 'value': 'Искатель приключений', 'label': 'Искатель приключений' },
      { 'value': 'Убеждённый скептик', 'label': 'Убеждённый скептик' },
      { 'value': 'Сыщик-любитель', 'label': 'Сыщик-любитель' },
      { 'value': 'Дилетант', 'label': 'Дилетант' },
      { 'value': 'Рассеянный профессор', 'label': 'Рассеянный профессор' },
      { 'value': 'Планировщик', 'label': 'Планировщик' },
      { 'value': 'Душа компании', 'label': 'Душа компании' },
      { 'value': 'Прирождённый артист', 'label': 'Прирождённый артист' },
      { 'value': 'Кукловод', 'label': 'Кукловод' },
      { 'value': 'Наставник', 'label': 'Наставник' },
      { 'value': 'Брутальный', 'label': 'Брутальный' },
      { 'value': 'Видящий духов', 'label': 'Видящий духов' },
      { 'value': 'Дьявольски везучий', 'label': 'Дьявольски везучий' },
      { 'value': 'Провидец', 'label': 'Провидец' },
      { 'value': 'Сновидец', 'label': 'Сновидец' },
      { 'value': 'Отмеченный судьбой', 'label': 'Отмеченный судьбой' }
    ],
    'value': [
      { 'value': 'Здоровяк', 'label': 'Здоровяк' },
      { 'value': 'Многоборец', 'label': 'Многоборец' },
      { 'value': 'Проныра', 'label': 'Проныра' },
      { 'value': 'Сорвиголова', 'label': 'Сорвиголова' },
      { 'value': 'Золотые руки', 'label': 'Золотые руки' },
      { 'value': 'Наивный идеалист', 'label': 'Наивный идеалист' },
      { 'value': 'Прожжённый циник', 'label': 'Прожжённый циник' },
      { 'value': 'Крестоносец', 'label': 'Крестоносец' },
      { 'value': 'Истинно верующий', 'label': 'Истинно верующий' },
      { 'value': 'Искатель приключений', 'label': 'Искатель приключений' },
      { 'value': 'Убеждённый скептик', 'label': 'Убеждённый скептик' },
      { 'value': 'Сыщик-любитель', 'label': 'Сыщик-любитель' },
      { 'value': 'Дилетант', 'label': 'Дилетант' },
      { 'value': 'Рассеянный профессор', 'label': 'Рассеянный профессор' },
      { 'value': 'Планировщик', 'label': 'Планировщик' },
      { 'value': 'Душа компании', 'label': 'Душа компании' },
      { 'value': 'Прирождённый артист', 'label': 'Прирождённый артист' },
      { 'value': 'Кукловод', 'label': 'Кукловод' },
      { 'value': 'Наставник', 'label': 'Наставник' },
      { 'value': 'Брутальный', 'label': 'Брутальный' },
      { 'value': 'Видящий духов', 'label': 'Видящий духов' },
      { 'value': 'Дьявольски везучий', 'label': 'Дьявольски везучий' },
      { 'value': 'Провидец', 'label': 'Провидец' },
      { 'value': 'Сновидец', 'label': 'Сновидец' },
      { 'value': 'Отмеченный судьбой', 'label': 'Отмеченный судьбой' }
    ]
  };

  return options[category] || [];
};

export default DistinctionBlock;