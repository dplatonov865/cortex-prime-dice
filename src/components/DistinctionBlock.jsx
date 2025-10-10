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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
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
              <input
                type="text"
                className="distinction-input"
                value={distinction.name}
                onChange={(e) => handleNameChange(category, e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите отличительную черту..."
                maxLength={30}
                disabled={!finalAvailability}
              />
              
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
            : '💡 Кликайте по кубам чтобы добавить их в пул. Текст можно редактировать.'
        }
      </div>
    </div>
  );
};

// Функция для получения заголовка категории
const getCategoryTitle = (category) => {
  const titles = {
    'past': 'Прошлое',
    'trait': 'Характеристика',
    'value': 'Ценность'
  };
  return titles[category] || category;
};

export default DistinctionBlock;