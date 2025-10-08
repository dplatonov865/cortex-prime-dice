import React from 'react';
import DiceIcon from './DiceIcon';
import { RANK_ORDER, getNextRank, getPreviousRank } from '../utils/diceLogic';

const AttributeBlock = ({ attributes, onAttributeClick, onAttributeChange }) => {
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
    onAttributeClick(attributeName, diceType);
  };

  return (
    <div className="block attributes-block">
      <h3>Атрибуты</h3>
      <div className="attributes-list">
        {Object.entries(attributes).map(([name, diceType]) => (
          <div 
            key={name} 
            className="attribute-row"
            onClick={() => handleAttributeClick(name, diceType)}
            title="Клик чтобы добавить куб в пул"
          >
            <span className="attribute-name">{name}</span>
            
            <div className="attribute-controls">
              <DiceIcon 
                type={diceType} 
                value={diceType.replace('d', '')}
                clickable={false}
              />
              
              <div className="rank-buttons-vertical">
                <button
                  className="rank-button increase-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrease(name, diceType);
                  }}
                  disabled={diceType === 'd12'}
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
                  disabled={diceType === 'd4'}
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
        💡 Кликайте по атрибутам чтобы добавить кубы в пул
      </div>
    </div>
  );
};

export default AttributeBlock;