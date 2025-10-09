// В ResultsBlock.jsx убедимся что используем ТОЛЬКО классы из blocks.css

// Подкомпонент для отдельного куба результата
const ResultDiceItem = ({ dice, isSelected, canSelect, isLimitReached, onClick }) => {
  const isInactive = dice.isOne || dice.rolledValue === 0;
  const isDisabled = !isInactive && !canSelect;
  
  return (
    <div 
      className={`pool-dice-item ${isSelected ? 'selected' : ''} ${isInactive ? 'inactive' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={onClick}
      title={getDiceTitle(isInactive, isSelected, isDisabled, isLimitReached, dice)}
    >
      <DiceIcon 
        type={dice.type} 
        value={dice.rolledValue}
        clickable={!isInactive && !isDisabled}
      />
      <div className="dice-info-small">
        <span className="dice-name">{dice.name}</span>
      </div>
      
      {/* Индикаторы статуса */}
      {isSelected && <div className="selected-indicator">✓</div>}
      {isInactive && <div className="inactive-indicator">✗</div>}
      {isDisabled && !isSelected && <div className="disabled-indicator">🔒</div>}
    </div>
  );
};

// Подкомпонент для истории бросков
const RollHistory = ({ rollHistory }) => {
  if (rollHistory.length === 0) return null;

  return (
    <div className="roll-history-section">
      <h4>История бросков</h4>
      <div className="history-list">
        {rollHistory.map(roll => (
          <div key={roll.id} className="history-item">
            <span className="history-time">{roll.timestamp}</span>
            <div className="dice-pool">
              <div className="dice-pool-list">
                {roll.results.map((dice, index) => (
                  <div key={index} className="pool-dice-item">
                    <DiceIcon 
                      type={dice.type} 
                      value={dice.rolledValue}
                      clickable={false}
                    />
                    <div className="dice-info-small">
                      <span className="dice-name">{dice.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};