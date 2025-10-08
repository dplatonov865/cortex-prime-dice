import React from 'react';
import DiceIcon from './DiceIcon';

const ComplicationBlock = ({ complications, onComplicationClick, onComplicationChange }) => {
  const rankOrder = ['0', 'd4', 'd6', 'd8', 'd10', 'd12'];
  
  const handleIncrease = (complicationName, currentRank) => {
    const currentIndex = rankOrder.indexOf(currentRank);
    if (currentIndex < rankOrder.length - 1) {
      const newRank = rankOrder[currentIndex + 1];
      onComplicationChange(complicationName, newRank);
    }
  };

  const handleDecrease = (complicationName, currentRank) => {
    const currentIndex = rankOrder.indexOf(currentRank);
    if (currentIndex > 0) {
      const newRank = rankOrder[currentIndex - 1];
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
            
            <div className="complication-controls">
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
              
              <div className="complication-dice">
                <DiceIcon 
                  type={diceType} 
                  value={diceType === '0' ? '0' : diceType.replace('d', '')}
                  clickable={false}
                />
              </div>
              
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
        ))}
      </div>
      <div className="complication-hint">
        💡 Кликайте по осложнениям чтобы добавить кубы в пул (кроме ранга 0)
      </div>
    </div>
  );
};

export default ComplicationBlock;