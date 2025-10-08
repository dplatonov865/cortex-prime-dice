import React from 'react';
import DiceIcon from './DiceIcon';

const DistinctionBlock = ({ distinctions, onDistinctionClick, onDistinctionChange, isCategoryAvailable }) => {
  const handleDistinctionClick = (distinctionName, diceType, category) => {
    if (isCategoryAvailable && !isCategoryAvailable('distinction')) {
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

  return (
    <div className={`block distinctions-block ${!isBlockAvailable ? 'category-used' : ''}`}>
      <h3>Отличия</h3>
      <div className="distinctions-list">
        {Object.entries(distinctions).map(([category, distinction]) => (
          <div key={category} className="distinction-category">
            <h4 className="distinction-title">{getCategoryTitle(category)}</h4>
            <div className={`distinction-row ${!isBlockAvailable ? 'row-disabled' : ''}`}>
              <input
                type="text"
                className="distinction-input"
                value={distinction.name}
                onChange={(e) => handleNameChange(category, e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите отличительную черту..."
                maxLength={30}
                disabled={!isBlockAvailable}
              />
              
              <div className="distinction-dice">
                <div 
                  className={`distinction-dice-item ${!isBlockAvailable ? 'dice-disabled' : ''}`}
                  onClick={() => handleDistinctionClick(
                    distinction.name, 
                    'd8', 
                    `${getCategoryTitle(category)} (d8)`
                  )}
                  title={
                    !isBlockAvailable 
                      ? 'Уже используется отличие из этого набора'
                      : 'Клик чтобы добавить d8 в пул'
                  }
                >
                  <DiceIcon 
                    type="d8" 
                    value="8"
                    clickable={isBlockAvailable}
                  />
                </div>
                
                <div 
                  className={`distinction-dice-item ${!isBlockAvailable ? 'dice-disabled' : ''}`}
                  onClick={() => handleDistinctionClick(
                    distinction.name, 
                    'd4', 
                    `${getCategoryTitle(category)} (d4)`
                  )}
                  title={
                    !isBlockAvailable 
                      ? 'Уже используется отличие из этого набора'
                      : 'Клик чтобы добавить d4 в пул'
                  }
                >
                  <DiceIcon 
                    type="d4" 
                    value="4"
                    clickable={isBlockAvailable}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="distinction-hint">
        {!isBlockAvailable 
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