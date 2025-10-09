import React from 'react';

const CharacterHeader = ({ characterInfo, onCharacterInfoChange }) => {
  const handleChange = (field, value) => {
    onCharacterInfoChange(field, value);
  };

  return (
    <div className="character-header-block">
      <div className="character-name-section">
        <input
          type="text"
          className="character-name-input"
          value={characterInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Имя персонажа"
          maxLength={50}
        />
      </div>
      
      <div className="character-details-grid">
        <div className="detail-item">
          <label className="detail-label">Игрок</label>
          <input
            type="text"
            className="detail-input"
            value={characterInfo.player}
            onChange={(e) => handleChange('player', e.target.value)}
            placeholder="Ваше имя"
            maxLength={30}
          />
        </div>
        
        <div className="detail-item">
          <label className="detail-label">Кампания</label>
          <input
            type="text"
            className="detail-input"
            value={characterInfo.campaign}
            onChange={(e) => handleChange('campaign', e.target.value)}
            placeholder="Название кампании"
            maxLength={40}
          />
        </div>
        
        <div className="detail-item">
          <label className="detail-label">Раса</label>
          <input
            type="text"
            className="detail-input"
            value={characterInfo.race}
            onChange={(e) => handleChange('race', e.target.value)}
            placeholder="Раса/происхождение"
            maxLength={25}
          />
        </div>
        
        <div className="detail-item">
          <label className="detail-label">Возраст</label>
          <input
            type="text"
            className="detail-input"
            value={characterInfo.age}
            onChange={(e) => handleChange('age', e.target.value)}
            placeholder="Возраст"
            maxLength={15}
          />
        </div>
      </div>
      
      <div className="character-description-section">
        <label className="description-label">Описание персонажа</label>
        <textarea
          className="character-description"
          value={characterInfo.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Опишите внешность, характер, историю вашего персонажа..."
          maxLength={500}
          rows={3}
        />
        <div className="description-counter">
          {characterInfo.description.length}/500 символов
        </div>
      </div>
    </div>
  );
};

export default CharacterHeader;