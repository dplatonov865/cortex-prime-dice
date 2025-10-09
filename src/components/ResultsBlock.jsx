import React from 'react';
import DiceIcon from './DiceIcon';

const ResultsBlock = ({
  rollResults,
  selectedDice,
  result,
  effectDice,
  rollHistory,
  onResultDiceClick,
  onBoostResultSelection,
  canSelectDice,
  maxSelectedDice,
  activeEffect
}) => {

  const handleDiceClick = (diceId) => {
    if (activeEffect === 'boost_result') {
      onBoostResultSelection(diceId);
    } else {
      onResultDiceClick(diceId); // boost_effect больше не требует ручного выбора
    }
  };

  const isBoostResultActive = activeEffect === 'boost_result';

  return (
    <div className={`bottom-block results-block ${isBoostResultActive ? 'boost-result-active' : ''}`}>
      <h3>Результаты броска {isBoostResultActive && '⚡'}</h3>

      {rollResults.length === 0 ? (
        <p className="empty-pool-message">Здесь будут отображаться результаты бросков</p>
      ) : (
        <div className="current-results">
          <ResultStats
            result={result}
            effectDice={effectDice} // ← ПЕРЕДАТЬ effectDice
            selectedCount={selectedDice.length}
            maxSelected={maxSelectedDice}
            isBoostResultActive={isBoostResultActive}
          />

          <ResultsSection
            rollResults={rollResults}
            selectedDice={selectedDice}
            onDiceClick={handleDiceClick}
            canSelectDice={canSelectDice}
            maxSelectedDice={maxSelectedDice}
            activeEffect={activeEffect}
            effectDice={effectDice} // ← ПЕРЕДАТЬ effectDice
          />

          <div className="results-hint">
            {getResultsHint(activeEffect, selectedDice.length, maxSelectedDice)}
          </div>
        </div>
      )}

      <RollHistory rollHistory={rollHistory} />
    </div>
  );
};

const ResultStats = ({ result, effectDice, selectedCount, maxSelected, isBoostResultActive }) => (
  <div className="result-stats">
    <div className="result-stat">
      <div className="result-stat-header">
        <strong>Результат:</strong>
        {!isBoostResultActive && (
          <span className="selection-counter">
            {selectedCount}/{maxSelected}
          </span>
        )}
      </div>
      <span className={`result-value ${isBoostResultActive ? 'boost-highlight' : ''}`}>
        {result}
        {isBoostResultActive && ' ⚡'}
      </span>
    </div>
    <div className="result-stat">
      <strong>Кубы эффекта:</strong>
      <div className="effect-dice-container">
        {effectDice && effectDice.map((effectDie, index) => ( // ← ДОБАВИТЬ ПРОВЕРКУ effectDice
          <DiceIcon
            key={index}
            type={effectDie}
            value={effectDie.replace('d', '')}
            clickable={false}
          />
        ))}
      </div>
    </div>

    {isBoostResultActive && (
      <div className="boost-result-notice">
        🎯 Выберите куб для увеличения результата
      </div>
    )}
  </div>
);

const ResultsSection = ({
  rollResults,
  selectedDice,
  onDiceClick,
  canSelectDice,
  maxSelectedDice,
  activeEffect,
  effectDice // ← ДОБАВИТЬ effectDice
}) => {
  const isBoostResultActive = activeEffect === 'boost_result';

  return (
    <div className="results-section">
      <h4>Выпавшие значения:</h4>
      <div className="dice-pool">
        <div className="dice-pool-list">
          {rollResults.map(dice => (
            <ResultDiceItem
              key={dice.id}
              dice={dice}
              isSelected={selectedDice.includes(dice.id)}
              canSelect={canSelectDice ? canSelectDice(dice.id) : true}
              isLimitReached={selectedDice.length >= maxSelectedDice}
              activeEffect={activeEffect}
              effectDice={effectDice} // ← ПЕРЕДАТЬ effectDice
              onClick={() => onDiceClick(dice.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


const ResultDiceItem = ({ dice, isSelected, canSelect, isLimitReached, activeEffect, effectDice, onClick }) => {
  const isInactive = dice.isOne || dice.rolledValue === 0;
  const isBoostResultActive = activeEffect === 'boost_result';

  // В режиме boost_result ВСЕ активные кубы доступны (игнорируем лимит)
  const isBoostResultSelectable = isBoostResultActive && !isInactive && !isSelected;

  // В обычном режиме используем стандартную логику
  const isDisabled = !isBoostResultActive && !isInactive && !canSelect;

  // Проверяем, является ли куб уже эффектом
  const isCurrentEffect = effectDice && effectDice.includes(dice.type);

  return (
    <div
      className={`pool-dice-item ${isSelected ? 'selected' : ''} ${isInactive ? 'inactive' : ''} ${isDisabled ? 'disabled' : ''} ${isBoostResultSelectable ? 'boost-selectable' : ''}`}
      onClick={onClick}
      title={getDiceTitle(isInactive, isSelected, isDisabled, isLimitReached, activeEffect, isCurrentEffect)}
    >
      <DiceIcon
        type={dice.type}
        value={dice.rolledValue}
        clickable={!isInactive && (!isDisabled || isBoostResultSelectable)}
      />
      <div className="dice-info-small">
        <span className="dice-category">
          {getCategoryLabel(dice.category)}
        </span>
        <span className="dice-name">{dice.name}</span>
        {isCurrentEffect && <span className="current-effect-indicator">🎯</span>}
      </div>
      {isSelected && <div className="selected-indicator">✓</div>}
      {isInactive && <div className="inactive-indicator">✗</div>}
      {isDisabled && !isSelected && !isBoostResultActive && <div className="disabled-indicator">🔒</div>}
      {isBoostResultSelectable && <div className="boost-indicator">📊</div>}
    </div>
  );
};


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

const getDiceTitle = (isInactive, isSelected, isDisabled, isLimitReached, activeEffect, isCurrentEffect) => {
  if (activeEffect === 'boost_result') {
    if (isInactive) return 'Выпала 1 или ранг 0 - нельзя выбрать';
    if (isSelected) return 'Уже выбран в результате';
    return 'Клик чтобы увеличить результат на это значение';
  }
  
  if (isInactive) return 'Выпала 1 или ранг 0 - нельзя выбрать';
  if (isSelected) return 'Клик чтобы убрать из результата';
  if (isCurrentEffect) return 'Уже используется как куб эффекта';
  if (isDisabled) return `Достигнут лимит в 2 куба. Уберите один из выбранных чтобы выбрать этот.`;
  return 'Клик чтобы добавить в результат';
};

const getResultsHint = (activeEffect, selectedCount, maxSelectedDice) => {
  if (activeEffect === 'boost_result') {
    return '💡 Выберите любой куб (кроме 1) чтобы увеличить результат. Можно выбрать дополнительный куб сверх лимита.';
  }

  if (activeEffect === 'boost_effect') {
    return '💡 Выберите куб для повышения эффекта. Нельзя выбрать кубы из результата или текущий куб эффекта.';
  }

  return `💡 Можно выбрать до ${maxSelectedDice} кубов для подсчёта суммы. Кликайте по кубам чтобы добавить/убрать их из результата.${selectedCount >= maxSelectedDice ? '\n⚠️ Достигнут лимит в 2 куба' : ''
    }`;
};

export default ResultsBlock;