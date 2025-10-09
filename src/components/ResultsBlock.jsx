import React from 'react';
import DiceIcon from './DiceIcon';

const ResultsBlock = ({ 
  rollResults, 
  selectedDice, 
  result, 
  effectDie, 
  rollHistory, 
  onResultDiceClick,
  canSelectDice,
  maxSelectedDice
}) => {
  return (
    <div className="bottom-block results-block">
      <h3>Результаты броска</h3>
      
      {rollResults.length === 0 ? (
        <p className="no-results-message">Здесь будут отображаться результаты бросков</p>
      ) : (
        <div className="current-results">
          {/* Строки с результатом и кубом эффекта */}
          <ResultStats 
            result={result} 
            effectDie={effectDie} 
            selectedCount={selectedDice.length}
            maxSelected={maxSelectedDice}
          />
          
          {/* Выпавшие кубы */}
          <ResultsSection 
            rollResults={rollResults}
            selectedDice={selectedDice}
            onResultDiceClick={onResultDiceClick}
            canSelectDice={canSelectDice}
            maxSelectedDice={maxSelectedDice}
          />

          {/* Подсказка */}
          <div className="results-hint">
            💡 Можно выбрать до {maxSelectedDice} кубов для подсчёта суммы. Кликайте по кубам чтобы добавить/убрать их из результата.
            {selectedDice.length >= maxSelectedDice && (
              <div className="limit-warning">
                ⚠️ Достигнут лимит в {maxSelectedDice} куба
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* История бросков */}
      <RollHistory rollHistory={rollHistory} />
    </div>
  );
};

// Подкомпонент для статистики результатов
const ResultStats = ({ result, effectDie, selectedCount, maxSelected }) => (
  <div className="result-stats">
    <div className="result-stat">
      <div className="result-stat-header">
        <strong>Результат:</strong>
        <span className="selection-counter">
          {selectedCount}/{maxSelected}
        </span>
      </div>
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
const ResultsSection = ({ 
  rollResults, 
  selectedDice, 
  onResultDiceClick, 
  canSelectDice,
  maxSelectedDice 
}) => (
  <div className="results-section">
    <h4>Выпавшие значения:</h4>
    <div className="results-dice">
      {rollResults.map(dice => (
        <ResultDiceItem
          key={dice.id}
          dice={dice}
          isSelected={selectedDice.includes(dice.id)}
          canSelect={canSelectDice ? canSelectDice(dice.id) : true}
          isLimitReached={selectedDice.length >= maxSelectedDice}
          onClick={() => onResultDiceClick(dice.id)}
        />
      ))}
    </div>
  </div>
);

// Подкомпонент для отдельного куба результата
const ResultDiceItem = ({ dice, isSelected, canSelect, isLimitReached, onClick }) => {
  const isInactive = dice.isOne || dice.rolledValue === 0;
  const isDisabled = !isInactive && !canSelect;
  
  return (
    <div 
      className={`result-dice-item ${isSelected ? 'selected' : ''} ${isInactive ? 'inactive' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={onClick}
      title={getDiceTitle(isInactive, isSelected, isDisabled, isLimitReached)}
    >
      <DiceIcon 
        type={dice.type} 
        value={dice.rolledValue}
        clickable={!isInactive && !isDisabled}
      />
      <div className="dice-info">
        <div className="dice-category-small">
          {getCategoryLabel(dice.category)}
        </div>
        <div className="dice-name">{dice.name}</div>
        <div className="dice-roll">{dice.rolledValue}</div>
        {isSelected && <div className="selected-indicator">✓ В результате</div>}
        {isInactive && <div className="inactive-indicator">✗ Неактивен</div>}
        {isDisabled && !isSelected && <div className="disabled-indicator">🔒 Лимит</div>}
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
    case 'specialty': return 'Специальность';
    default: 
      if (category.startsWith('distinction:')) {
        return 'Отличие';
      }
      return category;
  }
};

const getDiceTitle = (isInactive, isSelected, isDisabled, isLimitReached) => {
  if (isInactive) return 'Выпала 1 или ранг 0 - нельзя выбрать';
  if (isSelected) return 'Клик чтобы убрать из результата';
  if (isDisabled) return `Достигнут лимит в 2 куба. Уберите один из выбранных чтобы выбрать этот.`;
  return 'Клик чтобы добавить в результат';
};

export default ResultsBlock;