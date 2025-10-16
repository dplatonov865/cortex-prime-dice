import React from 'react';
import DiceIcon from './DiceIcon';
import { getNextRank, getPreviousRank } from '../utils/diceLogic';

const RoleBlock = ({ roles, onRoleClick, onRoleChange, getUsageCount, isUsageLimitReached, additionalDieEffect = false }) => {
  const handleIncrease = (roleName, currentRank) => {
    const newRank = getNextRank(currentRank);
    if (newRank !== currentRank && onRoleChange) {
      onRoleChange(roleName, newRank);
    }
  };

  const handleDecrease = (roleName, currentRank) => {
    const newRank = getPreviousRank(currentRank);
    if (newRank !== currentRank && onRoleChange) {
      onRoleChange(roleName, newRank);
    }
  };

  const handleRoleClick = (roleName, diceType) => {
    if (isUsageLimitReached && isUsageLimitReached('role', roleName) && !additionalDieEffect) {
      return;
    }
    onRoleClick(roleName, diceType);
  };

  return (
    <div className={`block roles-block ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Наборы навыков</h3>
      <div className="roles-list">
        {Object.entries(roles).map(([name, diceType]) => {
          const usageCount = getUsageCount ? getUsageCount('role', name) : 0;
          const isLimitReached = isUsageLimitReached && isUsageLimitReached('role', name);
          const isClickable = !isLimitReached || additionalDieEffect;

          return (
            <div
              key={name}
              className={`role-row ${!isClickable ? 'row-disabled' : ''}`}
              onClick={() => handleRoleClick(name, diceType)}
              title={
                !isClickable
                  ? 'Достигнут лимит в 3 использования'
                  : additionalDieEffect
                    ? 'Эффект дополнительного куба: можно добавить в пул'
                    : `Клик чтобы добавить куб в пул (использовано: ${usageCount}/3)`
              }
            >
              <div className="role-name-container">
                <span className="role-name">{name}</span>
                {usageCount > 0 && (
                  <span className="usage-counter"> X{usageCount}</span>
                )}
              </div>

              <div className="role-controls">
                <DiceIcon
                  type={diceType}
                  value={diceType.replace('d', '')}
                  clickable={isClickable}
                />

                <div className="rank-buttons-vertical">
                  <button
                    className="rank-button increase-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrease(name, diceType);
                    }}
                    disabled={diceType === 'd12'}
                    title="Повысить ранг"
                  >
                    ▲
                  </button>

                  <button
                    className="rank-button decrease-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrease(name, diceType);
                    }}
                    disabled={diceType === 'd4'}
                    title="Понизить ранг"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="role-hint">
        {additionalDieEffect
          ? '🎯 Эффект дополнительного куба: можно добавить любой набор навыков'
          : '💡 Кликайте по наборам навыков чтобы добавить кубы в пул'
        }
      </div>
    </div>
  );
};

export default RoleBlock;