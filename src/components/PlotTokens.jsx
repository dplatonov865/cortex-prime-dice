import React from 'react';

const PlotTokens = ({ tokens, onAddToken, onSpendToken, plotTokenActive = false }) => {
    const handleAction = (actionName) => {
        if (tokens > 0) {
            onSpendToken(actionName); // Теперь передаем название действия
        }
    };

    return (
        <div className="plot-tokens-block">
            <h3>Жетоны сюжета</h3>
            {plotTokenActive && (
                <div className="plot-token-active-indicator">
                    ⚡ Режим дополнительного куба активен! Выберите один куб из любого блока.
                </div>
            )}

            <div className="tokens-display">
                <div className="tokens-count">
                    <span className="tokens-label">Доступно:</span>
                    <span className="tokens-value">{tokens}</span>
                </div>
            </div>

            <div className="tokens-actions">
                <button
                    className="token-action-btn"
                    onClick={() => handleAction('Добавить куб в пул')}
                    disabled={tokens === 0}
                >
                    + 🎲 В пул
                </button>

                <button
                    className="token-action-btn"
                    onClick={() => handleAction('Добавить куб в результат')}
                    disabled={tokens === 0}
                >
                    + 📊 В результат
                </button>

                <button
                    className="token-action-btn"
                    onClick={() => handleAction('Добавить куб эффекта')}
                    disabled={tokens === 0}
                >
                    + ⚡ Куб эффекта
                </button>

                <button
                    className="token-action-btn"
                    onClick={() => handleAction('Активировать возможность')}
                    disabled={tokens === 0}
                >
                    🔄 Возможность
                </button>

                <button
                    className="token-action-btn"
                    onClick={() => handleAction('Другое действие')}
                    disabled={tokens === 0}
                >
                    ❓ Другое
                </button>

                <button
                    className="add-token-btn"
                    onClick={onAddToken}
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