import React from 'react';
import DiceIcon from './DiceIcon';
import { RANK_ORDER, getNextRank, getPreviousRank } from '../utils/diceLogic';

const ComplicationBlock = ({ complications, onComplicationClick, onComplicationChange }) => {
  const handleIncrease = (complicationName, currentRank) => {
    const newRank = getNextRank(currentRank);
    if (newRank !== currentRank) {
      onComplicationChange(complicationName, newRank);
    }
  };

  const handleDecrease = (complicationName, currentRank) => {
    const newRank = getPreviousRank(currentRank);
    if (newRank !== currentRank) {
      onComplicationChange(complicationName, newRank);
    }
  };

  const handleComplicationClick = (complicationName, diceType) => {
    onComplicationClick(complicationName, diceType);
  };

  return (
    <div className="block complications-block">
      <h3>Осложнения</h3>
      <div className="complications-list">
        {Object.entries(complications).map(([name, diceType]) => (
          <div 
            key={name} 
            className="complication-row"
            onClick={() => handleComplicationClick(name, diceType)}
            title={diceType === '0' ? 'Осложнение отсутствует' : 'Клик чтобы добавить куб в пул'}
          >
            <span className="complication-name">{name}</span>
            
            <div className="complication-controls-right">
              <DiceIcon 
                type={diceType} 
                value={diceType === '0' ? '0' : diceType.replace('d', '')}
                clickable={false}
              />
              
              <div className="rank-buttons-horizontal">
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
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="complication-hint">
        💡 Кликайте по осложнениям чтобы добавить кубы в пул (кроме ранга 0)
      </div>
    </div>
  );
};

export default ComplicationBlock;