import React from 'react';
import DiceIcon from './DiceIcon';
import { getNextRank, getPreviousRank } from '../utils/diceLogic';

const RoleBlock = ({ roles, onRoleClick, onRoleChange, isCategoryAvailable, additionalDieEffect = false }) => {
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
    if (isCategoryAvailable && !isCategoryAvailable('role') && !additionalDieEffect) {
      return;
    }
    onRoleClick(roleName, diceType);
  };

  const isBlockAvailable = isCategoryAvailable ? isCategoryAvailable('role') : true;
  const finalAvailability = isBlockAvailable || additionalDieEffect;

  return (
    <div className={`block roles-block ${!finalAvailability ? 'category-used' : ''} ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Роли</h3>
      <div className="roles-list">
        {Object.entries(roles).map(([name, diceType]) => (
          <div 
            key={name} 
            className={`role-row ${!finalAvailability ? 'row-disabled' : ''}`}
            onClick={() => handleRoleClick(name, diceType)}
            title={
              !finalAvailability 
                ? 'Уже используется роль из этого набора' 
                : additionalDieEffect
                ? 'Эффект дополнительного куба: можно добавить в пул'
                : 'Клик чтобы добавить куб в пул'
            }
          >
            <span className="role-name">{name}</span>
            
            <div className="role-controls">
              <DiceIcon 
                type={diceType} 
                value={diceType.replace('d', '')}
                clickable={finalAvailability}
              />
              
              <div className="rank-buttons-vertical">
                <button
                  className="rank-button increase-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrease(name, diceType);
                  }}
                  disabled={diceType === 'd12' || !finalAvailability}
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
                  disabled={diceType === 'd4' || !finalAvailability}
                  title="Понизить ранг"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="role-hint">
        {additionalDieEffect 
          ? '🎯 Эффект дополнительного куба: можно добавить любую роль' 
          : !isBlockAvailable 
            ? '⚡ Роль уже используется в пуле' 
            : '💡 Кликайте по ролям чтобы добавить кубы в пул'
        }
      </div>
    </div>
  );
};

export default RoleBlock;