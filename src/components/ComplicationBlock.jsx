import React from 'react';
import DiceIcon from './DiceIcon';
import { getNextComplicationRank, getPreviousComplicationRank } from '../utils/diceLogic';

const ComplicationBlock = ({ complications, onComplicationClick, onComplicationChange, getUsageCount, isUsageLimitReached }) => {
  const handleIncrease = (complicationName, currentRank) => {
    const newRank = getNextComplicationRank(currentRank);
    if (newRank !== currentRank) {
      onComplicationChange(complicationName, newRank);
    }
  };

  const handleDecrease = (complicationName, currentRank) => {
    const newRank = getPreviousComplicationRank(currentRank);
    if (newRank !== currentRank) {
      onComplicationChange(complicationName, newRank);
    }
  };

  const handleComplicationClick = (complicationName, diceType) => {
    // Разрешаем добавление в пул только если ранг d4
    if (diceType === 'd4') {
      if (isUsageLimitReached && isUsageLimitReached('complication', complicationName)) {
        return;
      }
      onComplicationClick(complicationName, diceType);
    }
  };

  return (
    <div className="block complications-block">
      <h3>Стресс</h3>
      <div className="complications-list">
        {Object.entries(complications).map(([name, diceType]) => {
          const usageCount = getUsageCount ? getUsageCount('complication', name) : 0;
          const isLimitReached = isUsageLimitReached && isUsageLimitReached('complication', name);
          const isClickable = diceType === 'd4' && !isLimitReached;

          return (
            <div
              key={name}
              className={`complication-row ${!isClickable ? 'complication-disabled' : ''}`}
              onClick={() => handleComplicationClick(name, diceType)}
              title={
                diceType === '0'
                  ? 'Осложнение отсутствует'
                  : diceType !== 'd4'
                    ? 'Осложнение слишком сильное - нельзя добавить в пул'
                    : !isClickable
                      ? 'Достигнут лимит в 3 использования'
                      : `Клик чтобы добавить куб в пул (использовано: ${usageCount}/3)`
              }
            >
              <div className="complication-name-container">
                <span className="complication-name">{name}</span>
                {usageCount > 0 && (
                  <span className="usage-counter"> X{usageCount}</span>
                )}
              </div>

              <div className="complication-controls">
                <DiceIcon
                  type={diceType}
                  value={diceType === '0' ? '0' : diceType.replace('d', '')}
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
                    disabled={diceType === '0'}
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
      <div className="complication-hint">
        '💡 В пул можно добавлять только осложнения с рангом d4 (макс. 3 раза)'
      </div>
    </div>
  );
};

export default ComplicationBlock;