import React from 'react';
import DiceIcon from './DiceIcon';

const ResultsBlock = ({
  rollResults,
  selectedDice,
  result,
  effectDice,
  // rollHistory,
  onResultDiceClick,
  onBoostResultSelection,
  onRerollDice, // ← НОВЫЙ ПРОПС
  canSelectDice,
  maxSelectedDice,
  activeEffect,
  rerollMode // ← НОВЫЙ ПРОПС
}) => {

  const handleDiceClick = (diceId) => {
    if (rerollMode) {
      onRerollDice(diceId);
    } else if (activeEffect === 'boost_result') {
      onBoostResultSelection(diceId);
    } else {
      onResultDiceClick(diceId);
    }
  };
  const isRerollModeActive = rerollMode;

  const isBoostResultActive = activeEffect === 'boost_result';

  return (
    <div className={`bottom-block results-block ${isRerollModeActive ? 'reroll-mode-active' :
      activeEffect === 'boost_result' ? 'boost-result-active' : ''
      }`}>
      <h3>Результаты броска {isRerollModeActive && '↻'}</h3>

      {rollResults.length === 0 ? (
        <p className="empty-pool-message">Здесь будут отображаться результаты бросков</p>
      ) : (
        <div className="current-results">
          <ResultStats
            result={result}
            effectDice={effectDice}
            selectedCount={selectedDice.length}
            maxSelected={maxSelectedDice}
            isBoostResultActive={isBoostResultActive}
            isRerollModeActive={isRerollModeActive}
          />

          <ResultsSection
            rollResults={rollResults}
            selectedDice={selectedDice}
            onDiceClick={handleDiceClick}
            canSelectDice={canSelectDice}
            maxSelectedDice={maxSelectedDice}
            activeEffect={activeEffect}
            rerollMode={rerollMode}
            effectDice={effectDice}
          />

          <div className="results-hint">
            {getResultsHint(activeEffect, rerollMode, selectedDice.length, maxSelectedDice)}
          </div>
        </div>
      )}

      {/* <RollHistory rollHistory={rollHistory} /> */}
    </div>
  );
};

const ResultStats = ({ result, effectDice, selectedCount, maxSelected, isBoostResultActive, isRerollModeActive }) => (
  <div className="result-stats">
    <div className="result-stat">
      <div className="result-stat-header">
        <strong>Результат:</strong>
        {!isBoostResultActive && !isRerollModeActive && (
          <span className="selection-counter">
            {selectedCount}/{maxSelected}
          </span>
        )}
      </div>
      <span className={`result-value ${isBoostResultActive ? 'boost-highlight' :
        isRerollModeActive ? 'reroll-highlight' : ''
        }`}>
        {result}
        {isBoostResultActive && ' ⚡'}
        {isRerollModeActive && ' ↻'}
      </span>
    </div>

    {isRerollModeActive && (
      <div className="reroll-notice">
        🎯 Выберите куб для переброса
      </div>
    )}
    {/* <div className="result-stat">
      <strong>Кубы эффекта:</strong>
      <div className="effect-dice-container">
        {effectDice && effectDice.map((effectDie, index) => (
          <DiceIcon
            key={effectDie.id}
            type={effectDie.type}
            value={effectDie.type.replace('d', '')}
            clickable={false}
          />
        ))}
      </div>
    </div> */}

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
  effectDice
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
              effectDice={effectDice}
              onClick={() => onDiceClick(dice.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ResultDiceItem = ({ dice, isSelected, canSelect, isLimitReached, activeEffect, rerollMode, effectDice, onClick }) => {
  const isInactive = dice.isOne || dice.rolledValue === 0;
  const isBoostResultActive = activeEffect === 'boost_result';
  const isRerollModeActive = rerollMode;

  const isRerollSelectable = isRerollModeActive;
  const isBoostResultSelectable = isBoostResultActive && !isInactive && !isSelected;
  const isDisabled = !isBoostResultActive && !isRerollModeActive && !isInactive && !canSelect;

  const isCurrentEffect = effectDice && effectDice.some(effect => effect.id === dice.id);

  return (
    <div
      className={`pool-dice-item ${isSelected ? 'selected' : ''} ${isInactive ? 'inactive' : ''} ${isDisabled ? 'disabled' : ''} ${isBoostResultSelectable ? 'boost-selectable' : ''} ${isRerollModeActive ? 'reroll-selectable' : ''} ${dice.wasRerolled ? 'was-rerolled' : ''}
      `}
      onClick={onClick}
      title={getDiceTitle(isInactive, isSelected, isDisabled, isLimitReached, activeEffect, rerollMode, isCurrentEffect)}
    >
      <DiceIcon
        type={dice.type}
        value={dice.rolledValue}
        clickable={!isInactive && (!isDisabled || isBoostResultSelectable || isRerollSelectable)}
      />
      <div className="dice-info-small">
        <span className="dice-category">
          {getCategoryLabel(dice.category)}
        </span>
        <span className="dice-name">{dice.name}</span>
        {isCurrentEffect && <span className="current-effect-indicator">🎯</span>}
        {dice.wasRerolled && <span className="rerolled-indicator">↻</span>}
      </div>
      {isSelected && <div className="selected-indicator">✓</div>}
      {isInactive && <div className="inactive-indicator">✗</div>}
      {isDisabled && !isSelected && !isBoostResultActive && !isRerollModeActive && <div className="disabled-indicator">🔒</div>}
      {isBoostResultSelectable && <div className="boost-indicator">📊</div>}
      {isRerollModeActive && <div className="reroll-indicator">↻</div>}
    </div>
  );
};

// const RollHistory = ({ rollHistory }) => {
//   if (rollHistory.length === 0) return null;

//   return (
//     <div className="roll-history-section">
//       <h4>История бросков</h4>
//       <div className="history-list">
//         {rollHistory.map(roll => (
//           <div key={roll.id} className="history-item">
//             <span className="history-time">{roll.timestamp}</span>
//             <div className="history-dice">
//               {roll.results.map((dice, index) => (
//                 <DiceIcon
//                   key={index}
//                   type={dice.type}
//                   value={dice.rolledValue}
//                   clickable={false}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// Вспомогательная функция для получения метки категории
const getCategoryLabel = (category) => {
  switch (category) {
    case 'attributes':
      return 'Атрибут';
    case 'roles':
      return 'Навык';
    case 'complications':
      return 'Осложнение';
    case 'distinctions':
      return 'Черта';
    case 'specialties':
      return 'Специальность';
    case 'resources':
      return 'Ресурс';
    case 'quick':
      return 'Быстрый куб';
    default:
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

const getResultsHint = (activeEffect, rerollMode, selectedCount, maxSelectedDice) => {
  if (rerollMode) {
    return '💡 Выберите один куб для переброса. Он будет заменен на новое случайное значение.';
  }

  if (activeEffect === 'boost_result') {
    return '💡 Выберите любой куб (кроме 1) чтобы увеличить результат. Можно выбрать дополнительный куб сверх лимита.';
  }

  return `💡 Можно выбрать до 2 кубов для подсчёта суммы`;
};
export default ResultsBlock;