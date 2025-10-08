import React, { useState } from 'react';
import DiceIcon from './DiceIcon';

const SpecialtiesBlock = ({ specialties, onSpecialtyClick, onSpecialtiesChange }) => {
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleSpecialtyClick = (specialtyName, diceType) => {
    onSpecialtyClick(specialtyName, diceType);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && Object.keys(specialties).length < 10) {
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

  return (
    <div className="block specialties-block">
      <h3>Специальности и ресурсы</h3>
      
      <div className="specialties-input-container">
        <input
          type="text"
          className="specialty-input"
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Добавить специальность..."
          disabled={Object.keys(specialties).length >= 10}
          maxLength={30}
        />
        <button
          className="add-specialty-button"
          onClick={handleAddSpecialty}
          disabled={!newSpecialty.trim() || Object.keys(specialties).length >= 10}
          title={Object.keys(specialties).length >= 10 ? 'Достигнут лимит (10)' : 'Добавить специальность'}
        >
          +
        </button>
      </div>

      <div className="specialties-list">
        {Object.entries(specialties).map(([id, specialty]) => (
          <div key={id} className="specialty-row">
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
            />
            
            <div className="specialty-controls">
              <div 
                className="specialty-dice"
                onClick={() => handleSpecialtyClick(specialty.name, 'd6')}
                title="Клик чтобы добавить d6 в пул"
              >
                <DiceIcon 
                  type="d6" 
                  value="6"
                  clickable={true}
                />
              </div>
              
              <button
                className="remove-specialty-button"
                onClick={() => handleRemoveSpecialty(id)}
                title="Удалить специальность"
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
        💡 Кликайте по кубам чтобы добавить их в пул. Можно добавлять до 10 специальностей.
      </div>
    </div>
  );
};

export default SpecialtiesBlock;