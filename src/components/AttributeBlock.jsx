import React from 'react';
import DiceIcon from './DiceIcon';
import { getNextRank, getPreviousRank } from '../utils/diceLogic';

const AttributeBlock = ({ attributes, onAttributeClick, onAttributeChange, isCategoryAvailable }) => {
  const handleIncrease = (attributeName, currentRank) => {
    const newRank = getNextRank(currentRank);
    if (newRank !== currentRank && onAttributeChange) {
      onAttributeChange(attributeName, newRank);
    }
  };

  const handleDecrease = (attributeName, currentRank) => {
    const newRank = getPreviousRank(currentRank);
    if (newRank !== currentRank && onAttributeChange) {
      onAttributeChange(attributeName, newRank);
    }
  };

  const handleAttributeClick = (attributeName, diceType) => {
    if (isCategoryAvailable && !isCategoryAvailable('attribute')) {
      return;
    }
    onAttributeClick(attributeName, diceType);
  };

  const isBlockAvailable = isCategoryAvailable ? isCategoryAvailable('attribute') : true;

  return (
    <div className={`block attributes-block ${!isBlockAvailable ? 'category-used' : ''}`}>
      <h3>Атрибуты</h3>
      <div className="attributes-list">
        {Object.entries(attributes).map(([name, diceType]) => (
          <div 
            key={name} 
            className={`attribute-row ${!isBlockAvailable ? 'row-disabled' : ''}`}
            onClick={() => handleAttributeClick(name, diceType)}
            title={
              !isBlockAvailable 
                ? 'Уже используется атрибут из этого набора' 
                : 'Клик чтобы добавить куб в пул'
            }
          >
            <span className="attribute-name">{name}</span>
            
            <div className="attribute-controls">
              <DiceIcon 
                type={diceType} 
                value={diceType.replace('d', '')}
                clickable={isBlockAvailable}
              />
              
              <div className="rank-buttons-vertical">
                <button
                  className="rank-button increase-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrease(name, diceType);
                  }}
                  disabled={diceType === 'd12' || !isBlockAvailable}
                  title="Повысить ранг"
                >
                  ▲
                </button>
                
                <button
                  className="rank-button decrease-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecrease(name, diceType);
                  }}
                  disabled={diceType === 'd4' || !isBlockAvailable}
                  title="Понизить ранг"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="attribute-hint">
        {!isBlockAvailable 
          ? '⚡ Атрибут уже используется в пуле' 
          : '💡 Кликайте по атрибутам чтобы добавить кубы в пул'
        }
      </div>
    </div>
  );
};

export default AttributeBlock;