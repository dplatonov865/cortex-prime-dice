import React, { useRef } from 'react';

const CharacterHeader = ({
  characterInfo,
  onCharacterInfoChange,
  onExportCharacter,
  onImportCharacter,
  onResetCharacter
}) => {
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    onCharacterInfoChange(field, value);
  };

  const handleExportClick = () => {
    onExportCharacter();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleResetClick = () => {
    if (window.confirm('Вы уверены, что хотите сбросить персонажа к начальным значениям? Все данные будут потеряны.')) {
      onResetCharacter();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImportCharacter(file);
    }
    // Сбрасываем значение input чтобы можно было выбрать тот же файл снова
    event.target.value = '';
  };

  return (
    <div className="character-header-block">
      {/* Скрытый input для импорта */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".json"
        style={{ display: 'none' }}
      />

      <div className="character-header-top">

        <div className="character-actions">
          <button
            className="export-button"
            onClick={handleExportClick}
            title="Экспортировать лист персонажа"
          >
            💾 Экспорт
          </button>
          <button
            className="import-button"
            onClick={handleImportClick}
            title="Импортировать лист персонажа"
          >
            📂 Импорт
          </button>
          <button
            className="reset-button"
            onClick={handleResetClick}
            title="Сбросить персонажа к начальным значениям"
          >
            🔄 Сброс
          </button>
        </div>
      </div>

      <div className="character-details-grid">

        {/* <div className="character-name-section"> */}
        <div className="detail-item">
          <label className="detail-label">Имя</label>
          <input
            type="text"
            // className="character-name-input"
            className="detail-input"
            value={characterInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Имя персонажа"
            maxLength={50}
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

      {/* <div className="character-description-section">
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
      </div> */}
    </div>
  );
};

export default CharacterHeader;