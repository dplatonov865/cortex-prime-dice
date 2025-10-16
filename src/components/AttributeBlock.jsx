import React from 'react';
import DiceIcon from './DiceIcon';
import { getNextRank, getPreviousRank } from '../utils/diceLogic';

const AttributeBlock = ({ attributes, onAttributeClick, onAttributeChange, getUsageCount, isUsageLimitReached, additionalDieEffect = false }) => {
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
    if (isUsageLimitReached && isUsageLimitReached('attribute', attributeName) && !additionalDieEffect) {
      return;
    }
    onAttributeClick(attributeName, diceType);
  };

  return (
    <div className={`block attributes-block ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Атрибуты</h3>
      <div className="attributes-list">
        {Object.entries(attributes).map(([name, diceType]) => {
          const usageCount = getUsageCount ? getUsageCount('attribute', name) : 0;
          const isLimitReached = isUsageLimitReached && isUsageLimitReached('attribute', name);
          const isClickable = !isLimitReached || additionalDieEffect;

          return (
            <div
              key={name}
              className={`attribute-row ${!isClickable ? 'row-disabled' : ''}`}
              onClick={() => handleAttributeClick(name, diceType)}
              title={
                !isClickable
                  ? 'Достигнут лимит в 3 использования'
                  : additionalDieEffect
                    ? 'Эффект дополнительного куба: можно добавить в пул'
                    : `Клик чтобы добавить куб в пул (использовано: ${usageCount}/3)`
              }
            >
              <div className="attribute-name-container">
                <span className="attribute-name">{name}</span>
                {usageCount > 0 && (
                  <span className="usage-counter"> X{usageCount}</span>
                )}
              </div>

              <div className="attribute-controls">
                <DiceIcon
                  type={diceType}
                  value={diceType.replace('d', '')}
                  clickable={isClickable}
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
          );
        })}
      </div>
      <div className="attribute-hint">
        {additionalDieEffect
          ? '🎯 Эффект дополнительного куба: можно добавить любой атрибут'
          : '💡 Кликайте по атрибутам чтобы добавить кубы в пул'
        }
      </div>
    </div>
  );
};

export default AttributeBlock;