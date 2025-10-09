import React from 'react';
import DiceIcon from './DiceIcon';

const DicePoolBlock = ({ 
  dicePool, 
  onRemoveFromPool, 
  onRollDice, 
  onClearPool 
}) => {
  return (
    <div className="horizontal-block dice-pool-block">
      <div className="block-header">
        <h3>Текущий пул кубов</h3>
        <div className="pool-controls">
          <button 
            onClick={onRollDice} 
            className="roll-button"
            disabled={dicePool.length === 0}
          >
            Бросок ({dicePool.length})
          </button>
          <button 
            onClick={onClearPool} 
            className="clear-button"
            disabled={dicePool.length === 0}
          >
            Очистить
          </button>
        </div>
      </div>
      
      <div className="dice-pool">
        {dicePool.length === 0 ? (
          <p className="empty-pool-message">
            Кликайте по атрибутам, ролям или осложнениям чтобы добавить кубы в пул
          </p>
        ) : (
          <div className="dice-pool-list">
            {dicePool.map(dice => (
              <div 
                key={dice.id} 
                className="pool-dice-item"
                onClick={() => onRemoveFromPool(dice.id)}
                title={`Клик чтобы удалить: ${dice.name} (${dice.type})`}
              >
                <div className="pool-dice-content">
                  <DiceIcon 
                    type={dice.type} 
                    value={dice.value}
                    clickable={false}
                  />
                  <span className="pool-dice-name">{dice.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DicePoolBlock;