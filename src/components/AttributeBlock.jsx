import React from 'react';
import DiceIcon from './DiceIcon';

const AttributeBlock = ({ attributes, onAttributeClick }) => {
  const handleAttributeInteraction = (attributeName, diceType, event) => {
    onAttributeClick(attributeName, diceType, event);
  };

  return (
    <div className="block attributes-block">
      <h3>Атрибуты</h3>
      <div className="attributes-list">
        {Object.entries(attributes).map(([name, diceType]) => (
          <div 
            key={name} 
            className="attribute-row"
            onMouseDown={(e) => handleAttributeInteraction(name, diceType, e)}
            title="Левый клик - добавить в пул\nПравый клик - удалить из пула"
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
        💡 Левый клик - добавить, правый - удалить
      </div>
    </div>
  );
};

export default AttributeBlock;