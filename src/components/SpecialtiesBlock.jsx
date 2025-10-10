import React, { useState } from 'react';
import DiceIcon from './DiceIcon';

const SpecialtiesBlock = ({ specialties, onSpecialtyClick, onSpecialtiesChange, isCategoryAvailable, additionalDieEffect = false }) => {
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleSpecialtyClick = (specialtyName, diceType) => {
    if (isCategoryAvailable && !isCategoryAvailable('specialty') && !additionalDieEffect) {
      return;
    }
    onSpecialtyClick(specialtyName, diceType);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && Object.keys(specialties).length < 10 && 
        ((isCategoryAvailable && isCategoryAvailable('specialty')) || additionalDieEffect)) {
      onSpecialtiesChange('add', null, newSpecialty.trim());
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (id) => {
    onSpecialtiesChange('remove', id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSpecialty();
    }
  };

  const handleEditSpecialty = (id, newName) => {
    onSpecialtiesChange('edit', id, newName);
  };

  const isBlockAvailable = isCategoryAvailable ? isCategoryAvailable('specialty') : true;
  const finalAvailability = isBlockAvailable || additionalDieEffect;
  const canAddNew = finalAvailability && Object.keys(specialties).length < 10;

  return (
    <div className={`block specialties-block ${!finalAvailability ? 'category-used' : ''} ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Ресурсы</h3>
      
      <div className="specialties-input-container">
        <input
          type="text"
          className="specialty-input"
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Добавить ресурс..."
          disabled={!canAddNew}
          maxLength={30}
        />
        <button
          className="add-specialty-button"
          onClick={handleAddSpecialty}
          disabled={!newSpecialty.trim() || !canAddNew}
          title={!canAddNew ? 'Нельзя добавить - набор уже используется или достигнут лимит' : 'Добавить ресурс'}
        >
          +
        </button>
      </div>

      <div className="specialties-list">
        {Object.entries(specialties).map(([id, specialty]) => (
          <div key={id} className={`specialty-row ${!finalAvailability ? 'row-disabled' : ''}`}>
            <input
              type="text"
              className="specialty-name-input"
              value={specialty.name}
              onChange={(e) => handleEditSpecialty(id, e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') e.target.blur();
              }}
              placeholder="Название ресурса..."
              maxLength={30}
              disabled={!finalAvailability}
            />
            
            <div className="specialty-controls">
              <div 
                className={`specialty-dice ${!finalAvailability ? 'dice-disabled' : ''}`}
                onClick={() => handleSpecialtyClick(specialty.name, 'd6')}
                title={
                  !finalAvailability 
                    ? 'Уже используется ресурс из этого набора'
                    : additionalDieEffect
                    ? 'Эффект дополнительного куба: можно добавить в пул'
                    : 'Клик чтобы добавить d6 в пул'
                }
              >
                <DiceIcon 
                  type="d6" 
                  value="6"
                  clickable={finalAvailability}
                />
              </div>
              
              <button
                className="remove-specialty-button"
                onClick={() => handleRemoveSpecialty(id)}
                title="Удалить ресурс"
                disabled={!finalAvailability}
              >
                ×
              </button>
            </div>
          </div>
        ))}
        
        {Object.keys(specialties).length === 0 && (
          <div className="no-specialties-message">
            Нет добавленных специальностей
          </div>
        )}
      </div>

      <div className="specialties-counter">
        {Object.keys(specialties).length}/10 специальностей
      </div>

      <div className="specialties-hint">
        {additionalDieEffect 
          ? '🎯 Эффект дополнительного куба: можно добавить любой ресурс' 
          : !isBlockAvailable 
            ? '⚡ Ресурс уже используется в пуле' 
            : '💡 Кликайте по кубам чтобы добавить их в пул. Можно добавлять до 10 ресурсов.'
        }
      </div>
    </div>
  );
};

export default SpecialtiesBlock;