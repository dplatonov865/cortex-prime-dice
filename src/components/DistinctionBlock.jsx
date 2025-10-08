import React from 'react';
import DiceIcon from './DiceIcon';

const DistinctionBlock = ({ distinctions, onDistinctionClick }) => {
  const handleDistinctionClick = (distinctionName, diceType, category) => {
    onDistinctionClick(distinctionName, diceType, category);
  };

  return (
    <div className="block distinctions-block">
      <h3>Отличия</h3>
      <div className="distinctions-list">
        {Object.entries(distinctions).map(([category, distinction]) => (
          <div key={category} className="distinction-category">
            <h4 className="distinction-title">{category}</h4>
            <div className="distinction-row">
              <span className="distinction-name">{distinction.name}</span>
              
              <div className="distinction-dice">
                <div 
                  className="distinction-dice-item"
                  onClick={() => handleDistinctionClick(
                    distinction.name, 
                    'd8', 
                    `${category} (d8)`
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
                    `${category} (d4)`
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
        💡 Кликайте по кубам чтобы добавить их в пул
      </div>
    </div>
  );
};

export default DistinctionBlock;