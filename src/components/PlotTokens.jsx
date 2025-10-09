import React from 'react';

const PlotTokens = ({ tokens, onAddToken, onSpendToken, onActivateAdditionalDie, additionalDieEffect }) => {
  const handleAddCubeToPool = () => {
    if (tokens > 0 && !additionalDieEffect) {
      onSpendToken('add_to_pool');
      onActivateAdditionalDie();
    }
  };

  const handleAddCubeToResult = () => {
    if (tokens > 0 && !additionalDieEffect) {
      onSpendToken('add_to_result');
      alert('Жетон потрачен! Добавлен дополнительный куб в результат (заглушка)');
    }
  };

  const handleAddToken = () => {
    if (!additionalDieEffect) {
      onAddToken();
    }
  };

  return (
    <div className={`plot-tokens-block ${additionalDieEffect ? 'additional-die-effect-active' : ''}`}>
      <h3>Жетоны сюжета {additionalDieEffect && '🎯'}</h3>
      
      <div className="tokens-display">
        <div className="tokens-count">
          <span className="tokens-label">Доступно:</span>
          <span className="tokens-value">{tokens}</span>
        </div>
        {additionalDieEffect && (
          <div className="additional-die-effect-indicator">
            🎯 Эффект дополнительного куба активен
          </div>
        )}
      </div>

      <div className="tokens-actions">
        <button 
          className="token-action-btn"
          onClick={handleAddCubeToPool}
          disabled={tokens === 0 || additionalDieEffect}
          title={
            additionalDieEffect 
              ? "Дождитесь завершения эффекта дополнительного куба" 
              : tokens === 0 
                ? "Недостаточно жетонов" 
                : "Добавить дополнительный куб в пул"
          }
        >
          + 🎲 В пул
        </button>
        
        <button 
          className="token-action-btn"
          onClick={handleAddCubeToResult}
          disabled={tokens === 0 || additionalDieEffect}
          title={
            additionalDieEffect 
              ? "Дождитесь завершения эффекта дополнительного куба" 
              : "Добавить дополнительный куб в результат"
          }
        >
          + 📊 В результат
        </button>

        <button 
          className="add-token-btn"
          onClick={handleAddToken}
          disabled={additionalDieEffect}
          title={
            additionalDieEffect 
              ? "Дождитесь завершения эффекта дополнительного куба" 
              : "Добавить жетон сюжета"
          }
        >
          + Жетон
        </button>
      </div>

      <div className="tokens-hint">
        {additionalDieEffect 
          ? '💡 Выберите любой трейт для добавления в пул (игнорируя ограничения). Все кнопки заблокированы до завершения эффекта.' 
          : '💡 Используйте жетоны сюжета для особых действий'
        }
      </div>
    </div>
  );
};

export default PlotTokens;