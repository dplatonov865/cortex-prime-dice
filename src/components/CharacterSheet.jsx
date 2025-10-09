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
import { calculateEffectDie } from '../utils/diceLogic';
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

  // Состояние активного эффекта
  const [activeEffect, setActiveEffect] = useState(null);

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
    maxSelectedDice,
    setResult,
    setSelectedDice,
    setEffectDie
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

      if (window.confirm('Вы уверены, что хотите загрузить этого персонажа? Текущие данные будут потеряны.')) {
        setCharacterInfo(data.characterInfo || DEFAULT_CHARACTER_INFO);
        setAttributes(data.attributes || DEFAULT_ATTRIBUTES);
        setRoles(data.roles || DEFAULT_ROLES);
        setComplications(data.complications || DEFAULT_COMPLICATIONS);
        setDistinctions(data.distinctions || DEFAULT_DISTINCTIONS);
        setSpecialties(data.specialties || DEFAULT_SPECIALTIES);
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
  };

  // Обработчик изменения информации о персонаже
  const handleCharacterInfoChange = (field, value) => {
    setCharacterInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обработчики кликов с поддержкой эффектов
  const handleAttributeClick = (attributeName, diceType) => {
    if (activeEffect === 'additional_die') {
      addToDicePool(attributeName, diceType, 'attribute');
      deactivateEffect();
    } else {
      addToDicePool(attributeName, diceType, 'attribute');
    }
  };

  const handleRoleClick = (roleName, diceType) => {
    if (activeEffect === 'additional_die') {
      addToDicePool(roleName, diceType, 'role');
      deactivateEffect();
    } else {
      addToDicePool(roleName, diceType, 'role');
    }
  };

  const handleComplicationClick = (complicationName, diceType) => {
    if (activeEffect === 'additional_die') {
      addToDicePool(complicationName, diceType, 'complication');
      deactivateEffect();
    } else {
      addToDicePool(complicationName, diceType, 'complication');
    }
  };

  const handleDistinctionClick = (distinctionName, diceType, category) => {
    if (activeEffect === 'additional_die') {
      addToDicePool(distinctionName, diceType, `distinction: ${category}`);
      deactivateEffect();
    } else {
      addToDicePool(distinctionName, diceType, `distinction: ${category}`);
    }
  };

  const handleSpecialtyClick = (specialtyName, diceType) => {
    if (activeEffect === 'additional_die') {
      addToDicePool(specialtyName, diceType, 'specialty');
      deactivateEffect();
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

  // Функции управления эффектами
  const handleActivateAdditionalDie = () => {
    if (plotTokens > 0) {
      setActiveEffect('additional_die');
      activateAdditionalDie();
    }
  };

  const handleActivateBoostResult = () => {
    if (plotTokens > 0) {
      setActiveEffect('boost_result');
      setPlotTokens(prev => prev - 1);
    }
  };

  const handleActivateBoostEffect = () => {
    if (plotTokens > 0) {
      setActiveEffect('boost_effect');
      setPlotTokens(prev => prev - 1);
    }
  };

  const deactivateEffect = () => {
    setActiveEffect(null);
    deactivateAdditionalDie();
  };

  // Обработчик для эффекта повышения результата
  const handleBoostResultSelection = (diceId) => {
    if (activeEffect === 'boost_result') {
      const dice = rollResults.find(d => d.id === diceId);
      if (dice && !dice.isOne && dice.rolledValue !== 0 && !selectedDice.includes(diceId)) {

        // Создаем новый массив выбранных кубов с добавленным кубом
        const newSelectedDice = [...selectedDice, diceId];
        setSelectedDice(newSelectedDice);

        // Пересчитываем сумму ВСЕХ выбранных кубов
        const newResult = newSelectedDice.reduce((total, id) => {
          const selectedDice = rollResults.find(d => d.id === id);
          return total + (selectedDice ? selectedDice.rolledValue : 0);
        }, 0);

        setResult(newResult);

        // Пересчитываем куб эффекта
        calculateEffectDie(rollResults, newSelectedDice, setEffectDie);

        // Деактивируем эффект
        deactivateEffect();

        console.log(`Куб "${dice.name}" добавлен в результат! Новый результат: ${newResult}`);
      }
    }
  };

  return (
    <div className="character-sheet">
      <CharacterHeader
        characterInfo={characterInfo}
        onCharacterInfoChange={handleCharacterInfoChange}
        onExportCharacter={handleExportCharacter}
        onImportCharacter={handleImportCharacter}
      />

      <div className="main-columns">
        <AttributeBlock
          attributes={attributes}
          onAttributeClick={handleAttributeClick}
          onAttributeChange={handleAttributeChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={activeEffect === 'additional_die'}
        />

        <RoleBlock
          roles={roles}
          onRoleClick={handleRoleClick}
          onRoleChange={handleRoleChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={activeEffect === 'additional_die'}
        />

        <ComplicationBlock
          complications={complications}
          onComplicationClick={handleComplicationClick}
          onComplicationChange={handleComplicationChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={activeEffect === 'additional_die'}
        />

        <DistinctionBlock
          distinctions={distinctions}
          onDistinctionClick={handleDistinctionClick}
          onDistinctionChange={handleDistinctionChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={activeEffect === 'additional_die'}
        />

        <SpecialtiesBlock
          specialties={specialties}
          onSpecialtyClick={handleSpecialtyClick}
          onSpecialtiesChange={handleSpecialtiesChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={activeEffect === 'additional_die'}
        />
      </div>

      <PlotTokens
        tokens={plotTokens}
        onAddToken={handleAddToken}
        onSpendToken={handleSpendToken}
        onActivateAdditionalDie={handleActivateAdditionalDie}
        onActivateBoostResult={handleActivateBoostResult}
        onActivateBoostEffect={handleActivateBoostEffect}
        activeEffect={activeEffect}
      />

      <DicePoolBlock
        dicePool={dicePool}
        onRemoveFromPool={removeFromDicePool}
        onRollDice={handleRollDice}
        onClearPool={clearDicePool}
      />

      <ResultsBlock
        rollResults={rollResults}
        selectedDice={selectedDice}
        result={result}
        effectDie={effectDie}
        rollHistory={rollHistory}
        onResultDiceClick={handleResultDiceClick}
        onBoostResultSelection={handleBoostResultSelection}
        canSelectDice={canSelectDice}
        maxSelectedDice={maxSelectedDice}
        activeEffect={activeEffect}
      />
    </div>
  );
};

export default CharacterSheet;