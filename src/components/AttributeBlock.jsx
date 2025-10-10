import React from 'react';
import DiceIcon from './DiceIcon';
import { getNextRank, getPreviousRank } from '../utils/diceLogic';

const AttributeBlock = ({ attributes, onAttributeClick, onAttributeChange, isCategoryAvailable, additionalDieEffect = false }) => {
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
    if (isCategoryAvailable && !isCategoryAvailable('attribute') && !additionalDieEffect) {
      return;
    }
    onAttributeClick(attributeName, diceType);
  };

  const isBlockAvailable = isCategoryAvailable ? isCategoryAvailable('attribute') : true;
  const finalAvailability = isBlockAvailable || additionalDieEffect;

  return (
    <div className={`block attributes-block ${!finalAvailability ? 'category-used' : ''} ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Атрибуты</h3>
      <div className="attributes-list">
        {Object.entries(attributes).map(([name, diceType]) => (
          <div 
            key={name} 
            className={`attribute-row ${!finalAvailability ? 'row-disabled' : ''}`}
            onClick={() => handleAttributeClick(name, diceType)}
            title={
              !finalAvailability 
                ? 'Уже используется атрибут из этого набора' 
                : additionalDieEffect
                ? 'Эффект дополнительного куба: можно добавить в пул'
                : 'Клик чтобы добавить куб в пул'
            }
          >
            <span className="attribute-name">{name}</span>
            
            <div className="attribute-controls">
              <DiceIcon 
                type={diceType} 
                value={diceType.replace('d', '')}
                clickable={finalAvailability}
              />
              
              <div className="rank-buttons-vertical">
                <button
                  className="rank-button increase-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrease(name, diceType);
                  }}
                  disabled={diceType === 'd12' || !finalAvailability}
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
                  disabled={diceType === 'd4' || !finalAvailability}
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
        {additionalDieEffect 
          ? '🎯 Эффект дополнительного куба: можно добавить любой атрибут' 
          : !isBlockAvailable 
            ? '⚡ Атрибут уже используется в пуле' 
            : '💡 Кликайте по атрибутам чтобы добавить кубы в пул'
        }
      </div>
    </div>
  );
};

export default AttributeBlock;