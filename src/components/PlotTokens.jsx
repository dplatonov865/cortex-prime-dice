import React from 'react';

const PlotTokens = ({
  tokens,
  onAddToken,
  onSpendToken,
  onActivateAdditionalDie,
  onActivateBoostResult,
  onActivateBoostEffect,
  activeEffect
}) => {
  const isEffectActive = activeEffect !== null;

  const handleAddCubeToPool = () => {
    if (tokens > 0 && !isEffectActive) {
      onSpendToken('add_to_pool');
      onActivateAdditionalDie();
    }
  };

  const handleBoostResult = () => {
    if (tokens > 0 && !isEffectActive) {
      onActivateBoostResult();
    }
  };

  const handleBoostEffect = () => {
    if (tokens > 0 && !isEffectActive) {
      onActivateBoostEffect();
    }
  };

  const handleAddToken = () => {
    if (!isEffectActive) {
      onAddToken();
    }
  };

  const getEffectDescription = () => {
    switch (activeEffect) {
      case 'additional_die':
        return 'Эффект дополнительного куба';
      case 'boost_result':
        return 'Эффект повышения результата';
      case 'boost_effect':
        return 'Эффект дополнительного эффекта';
      default:
        return '';
    }
  };

  return (
    <div className={`plot-tokens-block ${isEffectActive ? 'effect-active' : ''}`}>
      <h3>Жетоны сюжета {isEffectActive && '🎯'}</h3>

      <div className="tokens-display">
        <div className="tokens-count">
          <span className="tokens-label">Доступно:</span>
          <span className="tokens-value">{tokens}</span>
        </div>
        {isEffectActive && (
          <div className="effect-indicator">
            🎯 {getEffectDescription()} активен
          </div>
        )}
      </div>

      <div className="tokens-actions">
        <button
          className="token-action-btn"
          onClick={handleAddCubeToPool}
          disabled={tokens === 0 || isEffectActive}
          title={
            isEffectActive
              ? "Дождитесь завершения активного эффекта"
              : tokens === 0
                ? "Недостаточно жетонов"
                : "Добавить дополнительный куб в пул"
          }
        >
          + 🎲 В пул
        </button>

        <button
          className="token-action-btn"
          onClick={handleBoostResult}
          disabled={tokens === 0 || isEffectActive}
          title={
            isEffectActive
              ? "Дождитесь завершения активного эффекта"
              : "Повысить результат броска"
          }
        >
          + 📊 Результат
        </button>

        <button
          className="token-action-btn"
          onClick={handleBoostEffect}
          disabled={tokens === 0 || isEffectActive}
          title={
            isEffectActive
              ? "Дождитесь завершения активного эффекта"
              : "Повысить куб эффекта"
          }
        >
          + ⚡ Эффект
        </button>

        <button
          className="add-token-btn"
          onClick={handleAddToken}
          disabled={isEffectActive}
          title={
            isEffectActive
              ? "Дождитесь завершения активного эффекта"
              : "Добавить жетон сюжета"
          }
        >
          + Жетон
        </button>
      </div>

      <div className="tokens-hint">
        {isEffectActive
          ? `💡 ${getActiveEffectHint(activeEffect)}`
          : '💡 Используйте жетоны сюжета для особых действий'
        }
      </div>
    </div>
  );
};

// Вспомогательная функция для подсказок
const getActiveEffectHint = (effect) => {
  switch (effect) {
    case 'additional_die':
      return 'Выберите любой трейт для добавления в пул (игнорируя ограничения). Все кнопки заблокированы до завершения эффекта.';
    case 'boost_result':
      return 'Выберите куб в результатах для повышения его значения. Все кнопки заблокированы до завершения эффекта.';
    case 'boost_effect':
      return 'Выберите куб эффекта для повышения его ранга. Все кнопки заблокированы до завершения эффекта.';
    default:
      return 'Активный эффект. Все кнопки заблокированы до завершения.';
  }
};

export default PlotTokens;