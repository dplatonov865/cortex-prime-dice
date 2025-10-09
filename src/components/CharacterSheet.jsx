import React, { useState } from 'react';
import CharacterHeader from '../components/CharacterHeader';
import AttributeBlock from '../components/AttributeBlock';
import RoleBlock from '../components/RoleBlock';
import ComplicationBlock from '../components/ComplicationBlock';
import DistinctionBlock from '../components/DistinctionBlock';
import SpecialtiesBlock from '../components/SpecialtiesBlock';
import DicePoolBlock from '../components/DicePoolBlock';
import ResultsBlock from '../components/ResultsBlock';
import { useDicePool } from '../hooks/useDicePool';
import { useDiceRoll } from '../hooks/useDiceRoll';
import { exportCharacter, importCharacter, validateCharacterData } from '../utils/fileHandler';
import {
  DEFAULT_CHARACTER_INFO,
  DEFAULT_ATTRIBUTES,
  DEFAULT_ROLES,
  DEFAULT_COMPLICATIONS,
  DEFAULT_DISTINCTIONS,
  DEFAULT_SPECIALTIES,
  LIMITS
} from '../constants/characterData';


const CharacterSheet = () => {
  // Информация о персонаже
  const [characterInfo, setCharacterInfo] = useState(DEFAULT_CHARACTER_INFO);

  // Состояния характеристик
  const [attributes, setAttributes] = useState(DEFAULT_ATTRIBUTES);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [complications, setComplications] = useState(DEFAULT_COMPLICATIONS);
  const [distinctions, setDistinctions] = useState(DEFAULT_DISTINCTIONS);
  const [specialties, setSpecialties] = useState(DEFAULT_SPECIALTIES);


  // Хуки для управления логикой
  const {
    dicePool,
    usedCategories,
    addToDicePool,
    removeFromDicePool,
    clearDicePool,
    clearUsedCategories,
    isCategoryAvailable,
    setDicePool
  } = useDicePool();

  const {
    rollResults,
    selectedDice,
    result,
    effectDie,
    rollHistory,
    rollDicePool,
    handleResultDiceClick,
    canSelectDice,
    maxSelectedDice
  } = useDiceRoll();

  // Функция экспорта
  const handleExportCharacter = () => {
    const characterData = {
      characterInfo,
      attributes,
      roles,
      complications,
      distinctions,
      specialties,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    exportCharacter(characterData);
  };

  // Функция импорта
  const handleImportCharacter = async (file) => {
    try {
      const data = await importCharacter(file);

      if (!validateCharacterData(data)) {
        alert('Неверный формат файла персонажа');
        return;
      }

      // Подтверждение импорта
      if (window.confirm('Вы уверены, что хотите загрузить этого персонажа? Текущие данные будут потеряны.')) {
        setCharacterInfo(data.characterInfo || DEFAULT_CHARACTER_INFO);
        setAttributes(data.attributes || DEFAULT_ATTRIBUTES);
        setRoles(data.roles || DEFAULT_ROLES);
        setComplications(data.complications || DEFAULT_COMPLICATIONS);
        setDistinctions(data.distinctions || DEFAULT_DISTINCTIONS);
        setSpecialties(data.specialties || DEFAULT_SPECIALTIES);

        // Очищаем пул и результаты
        clearDicePool();

        alert('Персонаж успешно загружен!');
      }
    } catch (error) {
      alert(`Ошибка при импорте: ${error.message}`);
    }
  };

  // Обработчик изменения информации о персонаже
  const handleCharacterInfoChange = (field, value) => {
    setCharacterInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обработчики кликов
  const handleAttributeClick = (attributeName, diceType) => {
    addToDicePool(attributeName, diceType, 'attribute');
  };

  const handleRoleClick = (roleName, diceType) => {
    addToDicePool(roleName, diceType, 'role');
  };

  const handleComplicationClick = (complicationName, diceType) => {
    addToDicePool(complicationName, diceType, 'complication');
  };

  const handleDistinctionClick = (distinctionName, diceType, category) => {
    addToDicePool(distinctionName, diceType, `distinction: ${category}`);
  };

  const handleSpecialtyClick = (specialtyName, diceType) => {
    addToDicePool(specialtyName, diceType, 'specialty');
  };

  // Обработчики изменения данных
  const handleAttributeChange = (attributeName, newRank) => {
    setAttributes(prev => ({
      ...prev,
      [attributeName]: newRank
    }));
  };

  const handleRoleChange = (roleName, newRank) => {
    setRoles(prev => ({
      ...prev,
      [roleName]: newRank
    }));
  };

  const handleComplicationChange = (complicationName, newRank) => {
    setComplications(prev => ({
      ...prev,
      [complicationName]: newRank
    }));
  };

  const handleDistinctionChange = (category, newName) => {
    setDistinctions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        name: newName
      }
    }));
  };

  const handleSpecialtiesChange = (action, id, name) => {
    if (action === 'add' && Object.keys(specialties).length < LIMITS.MAX_SPECIALTIES) {
      const newId = Date.now().toString();
      setSpecialties(prev => ({ ...prev, [newId]: { name } }));
    } else if (action === 'remove') {
      setSpecialties(prev => {
        const newSpecialties = { ...prev };
        delete newSpecialties[id];
        return newSpecialties;
      });
    } else if (action === 'edit') {
      setSpecialties(prev => ({ ...prev, [id]: { name } }));
    }
  };

  // Обработчик броска
  const handleRollDice = () => {
    rollDicePool(dicePool, setDicePool, clearUsedCategories);
  };

  return (
    <div className="character-sheet">
      {/* Шапка персонажа */}
      <CharacterHeader
        characterInfo={characterInfo}
        onCharacterInfoChange={handleCharacterInfoChange}
        onExportCharacter={handleExportCharacter}
        onImportCharacter={handleImportCharacter}
      />

      {/* Основные блоки характеристик */}
      <div className="main-columns">
        <AttributeBlock
          attributes={attributes}
          onAttributeClick={handleAttributeClick}
          onAttributeChange={handleAttributeChange}
          isCategoryAvailable={isCategoryAvailable}
        />

        <RoleBlock
          roles={roles}
          onRoleClick={handleRoleClick}
          onRoleChange={handleRoleChange}
          isCategoryAvailable={isCategoryAvailable}
        />

        <ComplicationBlock
          complications={complications}
          onComplicationClick={handleComplicationClick}
          onComplicationChange={handleComplicationChange}
          isCategoryAvailable={isCategoryAvailable}
        />

        <DistinctionBlock
          distinctions={distinctions}
          onDistinctionClick={handleDistinctionClick}
          onDistinctionChange={handleDistinctionChange}
          isCategoryAvailable={isCategoryAvailable}
        />

        <SpecialtiesBlock
          specialties={specialties}
          onSpecialtyClick={handleSpecialtyClick}
          onSpecialtiesChange={handleSpecialtiesChange}
          isCategoryAvailable={isCategoryAvailable}
        />
      </div>

      {/* Блок 6: Текущий пул кубов */}
      <DicePoolBlock
        dicePool={dicePool}
        onRemoveFromPool={removeFromDicePool}
        onRollDice={handleRollDice}
        onClearPool={clearDicePool}
      />

      {/* Блок 7: Результаты броска */}
      <ResultsBlock
        rollResults={rollResults}
        selectedDice={selectedDice}
        result={result}
        effectDie={effectDie}
        rollHistory={rollHistory}
        onResultDiceClick={handleResultDiceClick}
        canSelectDice={canSelectDice}
        maxSelectedDice={maxSelectedDice}
      />
    </div>
  );
};

export default CharacterSheet;