import React from 'react';
import DiceIcon from './DiceIcon';

const AttributeBlock = ({ attributes, onAttributeClick }) => {
  const handleAttributeClick = (attributeName, diceType) => {
    onAttributeClick(attributeName, diceType);
  };

  return (
    <div className="block attributes-block">
      <h3>Атрибуты</h3>
      <div className="attributes-list">
        {Object.entries(attributes).map(([name, diceType]) => (
          <div 
            key={name} 
            className="attribute-row"
            onClick={() => handleAttributeClick(name, diceType)}
            title="Клик чтобы добавить куб в пул"
          >
            <span className="attribute-name">{name}</span>
            <DiceIcon 
              type={diceType} 
              value={diceType.replace('d', '')}
              clickable={false}
            />
          </div>
        ))}
      </div>
      <div className="attribute-hint">
        💡 Кликайте по атрибутам чтобы добавить кубы в пул
      </div>
    </div>
  );
};

export default AttributeBlock;