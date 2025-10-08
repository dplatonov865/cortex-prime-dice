import React from 'react';
import DiceIcon from './DiceIcon';

const RoleBlock = ({ roles, onRoleClick }) => {
  const handleRoleClick = (roleName, diceType) => {
    onRoleClick(roleName, diceType);
  };

  return (
    <div className="block roles-block">
      <h3>Роли</h3>
      <div className="roles-list">
        {Object.entries(roles).map(([name, diceType]) => (
          <div 
            key={name} 
            className="role-row"
            onClick={() => handleRoleClick(name, diceType)}
            title="Клик чтобы добавить куб в пул"
          >
            <span className="role-name">{name}</span>
            <DiceIcon 
              type={diceType} 
              value={diceType.replace('d', '')}
              clickable={false}
            />
          </div>
        ))}
      </div>
      <div className="role-hint">
        💡 Кликайте по ролям чтобы добавить кубы в пул
      </div>
    </div>
  );
};

export default RoleBlock;