import React from 'react';
import DiceIcon from './DiceIcon';

const DistinctionBlock = ({ distinctions, onDistinctionClick, onDistinctionChange }) => {
  const handleDistinctionClick = (distinctionName, diceType, category) => {
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

  return (
    <div className="block distinctions-block">
      <h3>Отличия</h3>
      <div className="distinctions-list">
        {Object.entries(distinctions).map(([category, distinction]) => (
          <div key={category} className="distinction-category">
            <h4 className="distinction-title">{getCategoryTitle(category)}</h4>
            <div className="distinction-row">
              <input
                type="text"
                className="distinction-input"
                value={distinction.name}
                onChange={(e) => handleNameChange(category, e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите отличительную черту..."
                maxLength={30}
              />
              
              <div className="distinction-dice">
                <div 
                  className="distinction-dice-item"
                  onClick={() => handleDistinctionClick(
                    distinction.name, 
                    'd8', 
                    `${getCategoryTitle(category)} (d8)`
                  )}
                  title="Клик чтобы добавить d8 в пул"
                >
                  <DiceIcon 
                    type="d8" 
                    value="8"
                    clickable={true}
                  />
                </div>
                
                <div 
                  className="distinction-dice-item"
                  onClick={() => handleDistinctionClick(
                    distinction.name, 
                    'd4', 
                    `${getCategoryTitle(category)} (d4)`
                  )}
                  title="Клик чтобы добавить d4 в пул"
                >
                  <DiceIcon 
                    type="d4" 
                    value="4"
                    clickable={true}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="distinction-hint">
        💡 Кликайте по кубам чтобы добавить их в пул. Текст можно редактировать.
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