import React, { useState } from 'react';
import DiceIcon from './DiceIcon';

const SpecialtiesBlock = ({ specialties, onSpecialtyClick, onSpecialtiesChange, getUsageCount, isUsageLimitReached, additionalDieEffect = false }) => {
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleSpecialtyClick = (specialtyName, diceType) => {
    if (isUsageLimitReached && isUsageLimitReached('specialty', specialtyName) && !additionalDieEffect) {
      return;
    }
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

  const canAddNew = Object.keys(specialties).length < 10;

  return (
    <div className={`block specialties-block ${additionalDieEffect ? 'bonus-mode' : ''}`}>
      <h3>Специальности</h3>

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
          title={!canAddNew ? 'Достигнут лимит в 10 специальностей' : 'Добавить специальность'}
        >
          +
        </button>
      </div>

      <div className="specialties-list">
        {Object.entries(specialties).map(([id, specialty]) => {
          const usageCount = getUsageCount ? getUsageCount('specialty', specialty.name) : 0;
          const isLimitReached = isUsageLimitReached && isUsageLimitReached('specialty', specialty.name);
          const isClickable = !isLimitReached || additionalDieEffect;

          return (
            <div key={id} className={`specialty-row ${!isClickable ? 'row-disabled' : ''}`}>
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
                <div className="specialty-usage">
                  {usageCount > 0 && (
                    <span className="usage-counter"> X{usageCount}</span>
                  )}
                </div>

                <div
                  className={`specialty-dice ${!isClickable ? 'dice-disabled' : ''}`}
                  onClick={() => handleSpecialtyClick(specialty.name, 'd6')}
                  title={
                    !isClickable
                      ? 'Достигнут лимит в 3 использования'
                      : additionalDieEffect
                        ? 'Эффект дополнительного куба: можно добавить в пул'
                        : `Клик чтобы добавить d6 в пул (использовано: ${usageCount}/3)`
                  }
                >
                  <DiceIcon
                    type="d6"
                    value="6"
                    clickable={isClickable}
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
          );
        })}

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
          ? '🎯 Эффект дополнительного куба: можно добавить любую специальность'
          : '💡 Кликайте по кубам чтобы добавить их в пул. Можно добавлять до 10 специальностей.'
        }
      </div>
    </div>
  );
};

export default SpecialtiesBlock;