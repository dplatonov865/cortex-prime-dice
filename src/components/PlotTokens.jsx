import React from 'react';

const PlotTokens = ({
  tokens,
  onAddToken,
  onSpendToken,
  onActivateAdditionalDie,
  onActivateBoostResult,
  onActivateBoostEffect,
  onCancelEffect, // ← НОВЫЙ ПРОПС
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
      onSpendToken('boost_result');
      onActivateBoostResult();
    }
  };

  const handleBoostEffect = () => {
    if (tokens > 0 && !isEffectActive) {
      onSpendToken('boost_effect');
      onActivateBoostEffect(); // Этот вызов теперь мгновенно применяет эффект
    }
  };

  const handleAddToken = () => {
    if (!isEffectActive) {
      onAddToken();
    }
  };

  const handleCancelEffect = () => {
    if (isEffectActive) {
      onCancelEffect();
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
              : "Автоматически повысить куб эффекта до максимального доступного"
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

        {/* КНОПКА ОТМЕНЫ ЭФФЕКТА */}
        <button
          className="cancel-effect-btn"
          onClick={handleCancelEffect}
          title="Отменить эффект и вернуть жетон"
        >
          ✕ Отменить эффект
        </button>
      </div>

      <div className="tokens-hint">
        {isEffectActive
          ? `💡 ${getActiveEffectHint(activeEffect)}`
          : '💡 Используйте жетоны сюжета для особых действий'
        }
        {isEffectActive && (
          <div className="cancel-hint">
            Можно отменить эффект и вернуть жетон
          </div>
        )}
      </div>
    </div>
  );
};

const getActiveEffectHint = (effect) => {
  switch (effect) {
    case 'additional_die':
      return 'Выберите любой трейт для добавления в пул (игнорируя ограничения).';
    case 'boost_result':
      return 'Выберите куб в результатах для повышения его значения.';
    case 'boost_effect':
      return 'Выберите куб эффекта для повышения его ранга.';
    default:
      return 'Активный эффект.';
  }
};

export default PlotTokens;