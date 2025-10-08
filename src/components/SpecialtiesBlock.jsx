import React, { useState } from 'react';
import DiceIcon from './DiceIcon';

const SpecialtiesBlock = ({ specialties, onSpecialtyClick, onSpecialtiesChange, isCategoryAvailable }) => {
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleSpecialtyClick = (specialtyName, diceType) => {
    if (isCategoryAvailable && !isCategoryAvailable('specialty')) {
      return;
    }
    onSpecialtyClick(specialtyName, diceType);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && Object.keys(specialties).length < 10 && 
        (!isCategoryAvailable || isCategoryAvailable('specialty'))) {
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
  const canAddNew = isBlockAvailable && Object.keys(specialties).length < 10;

  return (
    <div className={`block specialties-block ${!isBlockAvailable ? 'category-used' : ''}`}>
      <h3>Специальности и ресурсы</h3>
      
      <div className="specialties-input-container">
        <input
          type="text"
          className="specialty-input"
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Добавить специальность..."
          disabled={!canAddNew}
          maxLength={30}
        />
        <button
          className="add-specialty-button"
          onClick={handleAddSpecialty}
          disabled={!newSpecialty.trim() || !canAddNew}
          title={!canAddNew ? 'Нельзя добавить - набор уже используется или достигнут лимит' : 'Добавить специальность'}
        >
          +
        </button>
      </div>

      <div className="specialties-list">
        {Object.entries(specialties).map(([id, specialty]) => (
          <div key={id} className={`specialty-row ${!isBlockAvailable ? 'row-disabled' : ''}`}>
            <input
              type="text"
              className="specialty-name-input"
              value={specialty.name}
              onChange={(e) => handleEditSpecialty(id, e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') e.target.blur();
              }}
              placeholder="Название специальности..."
              maxLength={30}
              disabled={!isBlockAvailable}
            />
            
            <div className="specialty-controls">
              <div 
                className={`specialty-dice ${!isBlockAvailable ? 'dice-disabled' : ''}`}
                onClick={() => handleSpecialtyClick(specialty.name, 'd6')}
                title={
                  !isBlockAvailable 
                    ? 'Уже используется специальность из этого набора'
                    : 'Клик чтобы добавить d6 в пул'
                }
              >
                <DiceIcon 
                  type="d6" 
                  value="6"
                  clickable={isBlockAvailable}
                />
              </div>
              
              <button
                className="remove-specialty-button"
                onClick={() => handleRemoveSpecialty(id)}
                title="Удалить специальность"
                disabled={!isBlockAvailable}
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
        {!isBlockAvailable 
          ? '⚡ Специальность уже используется в пуле' 
          : '💡 Кликайте по кубам чтобы добавить их в пул. Можно добавлять до 10 специальностей.'
        }
      </div>
    </div>
  );
};

export default SpecialtiesBlock;