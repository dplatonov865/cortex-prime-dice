import React from 'react';
import DiceIcon from './DiceIcon';

const DicePoolBlock = ({
  dicePool,
  onRemoveFromPool,
  onRollDice,
  onClearPool,
  onAddQuickDie // ← новый пропс
}) => {
  // Быстрые кубы для добавления
  const quickDice = [
    { type: 'd4', value: '4' },
    { type: 'd6', value: '6' },
    { type: 'd8', value: '8' },
    { type: 'd10', value: '10' },
    { type: 'd12', value: '12' }
  ];

  return (
    <div className="horizontal-block dice-pool-block">
      <div className="block-header">
        <h3>Текущий пул кубов</h3>
        <div className="pool-controls">
          <button
            onClick={onRollDice}
            className="roll-button"
            disabled={dicePool.length === 0}
          >
            Бросок ({dicePool.length})
          </button>
          <button
            onClick={onClearPool}
            className="clear-button"
            disabled={dicePool.length === 0}
          >
            Очистить
          </button>
        </div>
      </div>

      {/* Панель быстрых кубов */}
      <div className="quick-dice-panel">
        <h4>Быстрые кубы:</h4>
        <div className="quick-dice-list">
          {quickDice.map(dice => (
            <div
              key={dice.type}
              className="quick-dice-item"
              onClick={() => onAddQuickDie(dice.type)}
              title={`Добавить ${dice.type} в пул`}
            >
              <DiceIcon
                type={dice.type}
                value={dice.value}
                clickable={true}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="dice-pool">
        {dicePool.length === 0 ? (
          <p className="empty-pool-message">
            Кликайте по атрибутам, наборам навыков, специальностям или ресурсам, чтобы добавить кубы в пул
          </p>
        ) : (
          <div className="dice-pool-list">
            {dicePool.map(dice => (
              <div
                key={dice.id}
                className="pool-dice-item"
                onClick={() => onRemoveFromPool(dice.id)}
                title={`Клик чтобы удалить\n${getCategoryLabel(dice.category)}: ${dice.name} (${dice.type})`}
              >
                <DiceIcon
                  type={dice.type}
                  value={dice.value}
                  clickable={false}
                />
                <div className="dice-info-small">
                  <span className="dice-category">
                    {getCategoryLabel(dice.category)}
                  </span>
                  <span className="dice-name">{dice.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
      return 'Ценность';
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

export default DicePoolBlock;