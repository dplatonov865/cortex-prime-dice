import React from 'react';
import DiceIcon from './DiceIcon';

const ResultsBlock = ({ 
  rollResults, 
  selectedDice, 
  result, 
  effectDie, 
  rollHistory, 
  onResultDiceClick 
}) => {
  return (
    <div className="bottom-block results-block">
      <h3>Результаты броска</h3>
      
      {rollResults.length === 0 ? (
        <p className="no-results-message">Здесь будут отображаться результаты бросков</p>
      ) : (
        <div className="current-results">
          {/* Строки с результатом и кубом эффекта */}
          <ResultStats result={result} effectDie={effectDie} />
          
          {/* Выпавшие кубы */}
          <ResultsSection 
            rollResults={rollResults}
            selectedDice={selectedDice}
            onResultDiceClick={onResultDiceClick}
          />

          {/* Подсказка */}
          <div className="results-hint">
            💡 Кликайте по кубам чтобы добавить/убрать их из результата
          </div>
        </div>
      )}
      
      {/* История бросков */}
      <RollHistory rollHistory={rollHistory} />
    </div>
  );
};

// Подкомпонент для статистики результатов
const ResultStats = ({ result, effectDie }) => (
  <div className="result-stats">
    <div className="result-stat">
      <strong>Результат:</strong>
      <span className="result-value">{result}</span>
    </div>
    <div className="result-stat">
      <strong>Куб эффекта:</strong>
      <DiceIcon 
        type={effectDie} 
        value={effectDie.replace('d', '')}
        clickable={false}
      />
    </div>
  </div>
);

// Подкомпонент для секции с результатами
const ResultsSection = ({ rollResults, selectedDice, onResultDiceClick }) => (
  <div className="results-section">
    <h4>Выпавшие значения:</h4>
    <div className="results-dice">
      {rollResults.map(dice => (
        <ResultDiceItem
          key={dice.id}
          dice={dice}
          isSelected={selectedDice.includes(dice.id)}
          onClick={() => onResultDiceClick(dice.id)}
        />
      ))}
    </div>
  </div>
);

// Подкомпонент для отдельного куба результата
const ResultDiceItem = ({ dice, isSelected, onClick }) => {
  const isInactive = dice.isOne || dice.rolledValue === 0;
  
  return (
    <div 
      className={`result-dice-item ${isSelected ? 'selected' : ''} ${isInactive ? 'inactive' : ''}`}
      onClick={onClick}
      title={getDiceTitle(isInactive, isSelected)}
    >
      <DiceIcon 
        type={dice.type} 
        value={dice.rolledValue}
        clickable={!isInactive}
      />
      <div className="dice-info">
        <div className="dice-category-small">
          {getCategoryLabel(dice.category)}
        </div>
        <div className="dice-name">{dice.name}</div>
        <div className="dice-roll">{dice.rolledValue}</div>
        {isSelected && <div className="selected-indicator">✓ В результате</div>}
        {isInactive && <div className="inactive-indicator">
          {dice.rolledValue === 0 ? '✗ Ранг 0' : '✗ Неактивен'}
        </div>}
      </div>
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
            <div className="history-dice">
              {roll.results.map((dice, index) => (
                <DiceIcon 
                  key={index}
                  type={dice.type} 
                  value={dice.rolledValue}
                  clickable={false}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Вспомогательные функции
const getCategoryLabel = (category) => {
  switch (category) {
    case 'attribute': return 'Атрибут';
    case 'role': return 'Роль';
    case 'complication': return 'Осложнение';
    default: return category;
  }
};

const getDiceTitle = (isInactive, isSelected) => {
  if (isInactive) return 'Выпала 1 или ранг 0 - нельзя выбрать';
  return `Клик для ${isSelected ? 'исключения из' : 'добавления в'} результат`;
};

export default ResultsBlock;