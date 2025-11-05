import React from 'react';

const PlotTokens = ({
  tokens,
  onAddToken,
  onSpendToken,
  onActivateAdditionalDie,
  onActivateBoostResult,
  onActivateBoostEffect,
  onCancelEffect,
  activeEffect,
  hasRollResults,
  usedCategories,
  onActivateAttributes,
  onActivateRoles,
  onActivateDistinctions // ← ДОБАВИТЬ ЭТОТ ПРОПС
}) => {
  const isEffectActive = activeEffect !== null;

  const handleAddCubeToPool = () => {
    if (tokens > 0 && !isEffectActive) {
      onSpendToken('add_to_pool');
      onActivateAdditionalDie();
    }
  };

  const handleBoostResult = () => {
    if (tokens > 0 && !isEffectActive && hasRollResults) {
      onSpendToken('boost_result');
      onActivateBoostResult();
    }
  };

  const handleBoostEffect = () => {
    if (tokens > 0 && !isEffectActive && hasRollResults) {
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
  const handleRemoveToken = () => {
    if (tokens > 0 && !isEffectActive) {
      onSpendToken('remove_token');
    }
  };

  const handleActivateAttributes = () => {
    if (tokens > 0 && !isEffectActive && usedCategories.has('attributes')) {
      onSpendToken('activate_attributes');
      onActivateAttributes();
    }
  };

  const handleActivateRoles = () => {
    if (tokens > 0 && !isEffectActive && usedCategories.has('roles')) {
      onSpendToken('activate_roles');
      onActivateRoles();
    }
  };

  const handleActivateDistinctions = () => {
    if (tokens > 0 && !isEffectActive && usedCategories.has('distinctions')) {
      onSpendToken('activate_distinctions');
      onActivateDistinctions();
    }
  };

  const canUseBoostResult = tokens > 0 && !isEffectActive && hasRollResults;
  const canUseBoostEffect = tokens > 0 && !isEffectActive && hasRollResults;
  const canActivateAttributes = tokens > 0 && !isEffectActive && usedCategories.has('attributes');
  const canActivateRoles = tokens > 0 && !isEffectActive && usedCategories.has('roles');
  const canActivateDistinctions = tokens > 0 && !isEffectActive && usedCategories.has('distinctions');

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
        {/* <button
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
        </button> */}
        <button
          className="token-action-btn"
          onClick={handleActivateAttributes}
          disabled={!canActivateAttributes}
          title={
            !usedCategories.has('attributes')
              ? "Атрибуты ещё не использованы"
              : isEffectActive
                ? "Дождитесь завершения активного эффекта"
                : tokens === 0
                  ? "Недостаточно жетонов"
                  : "Разблокировать атрибуты для повторного использования"
          }
        >
          + Атрибут
        </button>

        <button
          className="token-action-btn"
          onClick={handleActivateRoles}
          disabled={!canActivateRoles}
          title={
            !usedCategories.has('roles')
              ? "Навыки ещё не использованы"
              : isEffectActive
                ? "Дождитесь завершения активного эффекта"
                : tokens === 0
                  ? "Недостаточно жетонов"
                  : "Разблокировать навыки для повторного использования"
          }
        >
          + Навык
        </button>

        <button
          className="token-action-btn"
          onClick={handleActivateDistinctions}
          disabled={!canActivateDistinctions}
          title={
            !usedCategories.has('distinctions')
              ? "Отличия ещё не использованы"
              : isEffectActive
                ? "Дождитесь завершения активного эффекта"
                : tokens === 0
                  ? "Недостаточно жетонов"
                  : "Разблокировать отличия для повторного использования"
          }
        >
          + Ценность
        </button>
        <button
          className="token-action-btn"
          onClick={handleBoostResult}
          disabled={!canUseBoostResult}
          title={
            !hasRollResults
              ? "Сначала выполните бросок кубов"
              : isEffectActive
                ? "Дождитесь завершения активного эффекта"
                : tokens === 0
                  ? "Недостаточно жетонов"
                  : "Повысить результат броска"
          }
        >
          + Результат
        </button>

        {/* <button
          className="token-action-btn"
          onClick={handleBoostEffect}
          disabled={!canUseBoostEffect}
          title={
            !hasRollResults
              ? "Сначала выполните бросок кубов"
              : isEffectActive
                ? "Дождитесь завершения активного эффекта"
                : tokens === 0
                  ? "Недостаточно жетонов"
                  : "Автоматически повысить куб эффекта до максимального доступного"
          }
        >
          + ⚡ Эффект
        </button> */}

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
        <button
          className="remove-token-btn"
          onClick={handleRemoveToken}
          disabled={tokens === 0 || isEffectActive}
          title={
            isEffectActive
              ? "Дождитесь завершения активного эффекта"
              : tokens === 0
                ? "Нет доступных жетонов"
                : "Убрать жетон сюжета"
          }
        >
          - Жетон
        </button>
        {/* КНОПКА ОТМЕНЫ ЭФФЕКТА */}
        {/* <button
          className="cancel-effect-btn"
          onClick={handleCancelEffect}
          title="Отменить эффект и вернуть жетон"
        >
          ✕ Отменить эффект
        </button> */}
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