import React from 'react';

const PlotTokens = ({ tokens, onAddToken, onSpendToken }) => {
  const handleAddCubeToPool = () => {
    if (tokens > 0) {
      onSpendToken('add_to_pool');
      alert('Жетон потрачен! Добавлен дополнительный куб в пул (заглушка)');
    }
  };

  const handleAddCubeToResult = () => {
    if (tokens > 0) {
      onSpendToken('add_to_result');
      alert('Жетон потрачен! Добавлен дополнительный куб в результат (заглушка)');
    }
  };

  return (
    <div className="plot-tokens-block">
      <h3>Жетоны сюжета</h3>
      
      <div className="tokens-display">
        <div className="tokens-count">
          <span className="tokens-label">Доступно:</span>
          <span className="tokens-value">{tokens}</span>
        </div>
      </div>

      <div className="tokens-actions">
        <button 
          className="token-action-btn"
          onClick={handleAddCubeToPool}
          disabled={tokens === 0}
          title="Добавить дополнительный куб в пул"
        >
          + 🎲 В пул
        </button>
        
        <button 
          className="token-action-btn"
          onClick={handleAddCubeToResult}
          disabled={tokens === 0}
          title="Добавить дополнительный куб в результат"
        >
          + 📊 В результат
        </button>

        <button 
          className="add-token-btn"
          onClick={onAddToken}
          title="Добавить жетон сюжета"
        >
          + Жетон
        </button>
      </div>

      <div className="tokens-hint">
        💡 Используйте жетоны сюжета для особых действий
      </div>
    </div>
  );
};

export default PlotTokens;