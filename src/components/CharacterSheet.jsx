import React, { useState } from 'react';
import CharacterHeader from './CharacterHeader';
import AttributeBlock from './AttributeBlock';
import RoleBlock from './RoleBlock';
import ComplicationBlock from './ComplicationBlock';
import DistinctionBlock from './DistinctionBlock';
import SpecialtiesBlock from './SpecialtiesBlock';
import DicePoolBlock from './DicePoolBlock';
import ResultsBlock from './ResultsBlock';
import PlotTokens from './PlotTokens';
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
  const [plotTokens, setPlotTokens] = useState(1);

  // Хуки для управления логикой
  const {
    dicePool,
    usedCategories,
    additionalDieEffect,
    addToDicePool,
    removeFromDicePool,
    clearDicePool,
    clearUsedCategories,
    isCategoryAvailable,
    setDicePool,
    activateAdditionalDie,
    deactivateAdditionalDie
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

  const handleAddToken = () => {
    setPlotTokens(prev => prev + 1);
  };

  const handleSpendToken = (action) => {
    setPlotTokens(prev => Math.max(0, prev - 1));
    // Здесь будет логика для разных действий
  };

  // Обработчик изменения информации о персонаже
  const handleCharacterInfoChange = (field, value) => {
    setCharacterInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обработчики кликов с поддержкой бонусного режима
  const handleAttributeClick = (attributeName, diceType) => {
    if (additionalDieEffect) {
      addToDicePool(attributeName, diceType, 'attribute');
      deactivateAdditionalDie();
    } else {
      addToDicePool(attributeName, diceType, 'attribute');
    }
  };

  const handleRoleClick = (roleName, diceType) => {
    if (additionalDieEffect) {
      addToDicePool(roleName, diceType, 'role');
      deactivateAdditionalDie();
    } else {
      addToDicePool(roleName, diceType, 'role');
    }
  };

  const handleComplicationClick = (complicationName, diceType) => {
    if (additionalDieEffect) {
      addToDicePool(complicationName, diceType, 'complication');
      deactivateAdditionalDie();
    } else {
      addToDicePool(complicationName, diceType, 'complication');
    }
  };

  const handleDistinctionClick = (distinctionName, diceType, category) => {
    if (additionalDieEffect) {
      addToDicePool(distinctionName, diceType, `distinction: ${category}`);
      deactivateAdditionalDie();
    } else {
      addToDicePool(distinctionName, diceType, `distinction: ${category}`);
    }
  };

  const handleSpecialtyClick = (specialtyName, diceType) => {
    if (additionalDieEffect) {
      addToDicePool(specialtyName, diceType, 'specialty');
      deactivateAdditionalDie();
    } else {
      addToDicePool(specialtyName, diceType, 'specialty');
    }
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

  // Активация бонусного режима через жетон
  const handleActivateAdditionalDie = () => {
    if (plotTokens > 0) {
      activateAdditionalDie();
    }
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
          additionalDieEffect={additionalDieEffect}
        />

        <RoleBlock
          roles={roles}
          onRoleClick={handleRoleClick}
          onRoleChange={handleRoleChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={additionalDieEffect}
        />

        <ComplicationBlock
          complications={complications}
          onComplicationClick={handleComplicationClick}
          onComplicationChange={handleComplicationChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={additionalDieEffect}
        />

        <DistinctionBlock
          distinctions={distinctions}
          onDistinctionClick={handleDistinctionClick}
          onDistinctionChange={handleDistinctionChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={additionalDieEffect}
        />

        <SpecialtiesBlock
          specialties={specialties}
          onSpecialtyClick={handleSpecialtyClick}
          onSpecialtiesChange={handleSpecialtiesChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={additionalDieEffect}
        />
      </div>

      <PlotTokens
        tokens={plotTokens}
        onAddToken={handleAddToken}
        onSpendToken={handleSpendToken}
        onActivateAdditionalDie={handleActivateAdditionalDie} // ← ИСПРАВИТЬ ЭТУ СТРОКУ
        additionalDieEffect={additionalDieEffect}
      />

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