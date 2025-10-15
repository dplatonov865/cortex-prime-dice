import React, { useState } from 'react';
import CharacterHeader from './CharacterHeader';
import AttributeBlock from './AttributeBlock';
import RoleBlock from './RoleBlock';
import ComplicationBlock from './ComplicationBlock';
import DistinctionBlock from './DistinctionBlock';
import SpecialtiesBlock from './SpecialtiesBlock';
import ResourcesBlock from './ResourcesBlock';
import DicePoolBlock from './DicePoolBlock';
import ResultsBlock from './ResultsBlock';
import PlotTokens from './PlotTokens';
import { useDicePool } from '../hooks/useDicePool';
import { useDiceRoll } from '../hooks/useDiceRoll';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateEffectDie } from '../utils/diceLogic';
import { exportCharacter, importCharacter, validateCharacterData } from '../utils/fileHandler';
import {
  DEFAULT_CHARACTER_INFO,
  DEFAULT_ATTRIBUTES,
  DEFAULT_ROLES,
  DEFAULT_COMPLICATIONS,
  DEFAULT_DISTINCTIONS,
  DEFAULT_SPECIALTIES,
  DEFAULT_RESOURCES,
  LIMITS
} from '../constants/characterData';

const CharacterSheet = () => {
  // Информация о персонаже
  const [characterInfo, setCharacterInfo] = useLocalStorage('characterInfo', DEFAULT_CHARACTER_INFO);

  // Состояния характеристик
  const [attributes, setAttributes] = useLocalStorage('attributes', DEFAULT_ATTRIBUTES);
  const [roles, setRoles] = useLocalStorage('roles', DEFAULT_ROLES);
  const [complications, setComplications] = useLocalStorage('complications', DEFAULT_COMPLICATIONS);
  const [distinctions, setDistinctions] = useLocalStorage('distinctions', DEFAULT_DISTINCTIONS);
  const [specialties, setSpecialties] = useLocalStorage('specialties', DEFAULT_SPECIALTIES);
  const [resources, setResources] = useLocalStorage('resources', DEFAULT_RESOURCES);
  const [plotTokens, setPlotTokens] = useLocalStorage('plotTokens', 1);

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
    effectDice,
    rollHistory,
    rollDicePool,
    handleResultDiceClick,
    canSelectDice,
    maxSelectedDice,
    setResult,
    setSelectedDice,
    setEffectDice
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
      resources,
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
        setResources(data.resources || DEFAULT_RESOURCES);
        clearDicePool();
        alert('Персонаж успешно загружен!');
      }
    } catch (error) {
      alert(`Ошибка при импорте: ${error.message}`);
    }
  };

  const handleResetCharacter = () => {
    setCharacterInfo(DEFAULT_CHARACTER_INFO);
    setAttributes(DEFAULT_ATTRIBUTES);
    setRoles(DEFAULT_ROLES);
    setComplications(DEFAULT_COMPLICATIONS);
    setDistinctions(DEFAULT_DISTINCTIONS);
    setSpecialties(DEFAULT_SPECIALTIES);
    setResources(DEFAULT_RESOURCES);
    setPlotTokens(1);
    clearDicePool();
    setActiveEffect(null);

    // Очищаем localStorage для этих ключей
    localStorage.removeItem('characterInfo');
    localStorage.removeItem('attributes');
    localStorage.removeItem('roles');
    localStorage.removeItem('complications');
    localStorage.removeItem('distinctions');
    localStorage.removeItem('specialties');
    localStorage.removeItem('resources');
    localStorage.removeItem('plotTokens');
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

  const handleResourceClick = (resourceName, diceType) => {
    if (activeEffect === 'additional_die') {
      addToDicePool(resourceName, diceType, 'resource');
      deactivateEffect();
    } else {
      addToDicePool(resourceName, diceType, 'resource');
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

  const handleResourcesChange = (action, id, name) => {
    if (action === 'add' && Object.keys(resources).length < LIMITS.MAX_SPECIALTIES) {
      const newId = Date.now().toString();
      setResources(prev => ({ ...prev, [newId]: { name } }));
    } else if (action === 'remove') {
      setResources(prev => {
        const newResources = { ...prev };
        delete newResources[id];
        return newResources;
      });
    } else if (action === 'edit') {
      setResources(prev => ({ ...prev, [id]: { name } }));
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
      // setPlotTokens(prev => prev - 1);
    }
  };

  // CharacterSheet.jsx - полностью новая логика для handleActivateBoostEffect
  const handleActivateBoostEffect = () => {
    if (plotTokens > 0 && rollResults.length > 0) {
      // Находим доступные кубы для эффекта (не "1", не в результате, не уже используемые как эффект)
      const availableForEffect = rollResults.filter(dice =>
        !dice.isOne &&
        dice.rolledValue !== 0 &&
        !selectedDice.includes(dice.id) &&
        !effectDice.some(effect => effect.id === dice.id) // ← проверяем по ID
      );

      if (availableForEffect.length > 0) {
        // Находим куб с максимальным номиналом среди доступных
        const bestEffectDie = availableForEffect.reduce((max, dice) => {
          const diceValue = parseInt(dice.type.replace('d', ''));
          const maxValue = parseInt(max.type.replace('d', ''));
          return diceValue > maxValue ? dice : max;
        }, availableForEffect[0]);

        // ДОБАВЛЯЕМ новый куб эффекта к существующим как объект с ID
        const newEffectDie = {
          id: bestEffectDie.id,
          type: bestEffectDie.type,
          name: bestEffectDie.name
        };

        const newEffectDice = [...effectDice, newEffectDie];
        setEffectDice(newEffectDice);

        // Тратим жетон
        // setPlotTokens(prev => prev - 1);

        console.log(`Добавлен куб эффекта ${bestEffectDie.type}! Теперь эффекты: ${newEffectDice.map(e => e.type).join(', ')}`);
      } else {
        alert('Нет доступных кубов для повышения эффекта!');
      }
    }
  };


  const deactivateEffect = () => {
    if (activeEffect !== 'boost_effect') { // boost_effect теперь мгновенный, не требует деактивации
      setActiveEffect(null);
      deactivateAdditionalDie();
    }
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
        calculateEffectDie(rollResults, newSelectedDice, setEffectDice);

        // Деактивируем эффект
        deactivateEffect();

        console.log(`Куб "${dice.name}" добавлен в результат! Новый результат: ${newResult}`);
      }
    }
  };
  const handleCancelEffect = () => {
    if (activeEffect) {
      // Возвращаем жетон
      setPlotTokens(prev => prev + 1);
      // Деактивируем эффект
      deactivateEffect();
      console.log(`Эффект ${activeEffect} отменен, жетон возвращен`);
    }
  };

  return (
    <div className="character-sheet">
      <CharacterHeader
        characterInfo={characterInfo}
        onCharacterInfoChange={handleCharacterInfoChange}
        onExportCharacter={handleExportCharacter}
        onImportCharacter={handleImportCharacter}
        onResetCharacter={handleResetCharacter}
      />

      {/* Строка отличий */}
      <div className="distinctions-row">
        <DistinctionBlock
          distinctions={distinctions}
          onDistinctionClick={handleDistinctionClick}
          onDistinctionChange={handleDistinctionChange}
          isCategoryAvailable={isCategoryAvailable}
          additionalDieEffect={activeEffect === 'additional_die'}
        />
      </div>

      {/* Три колонки */}
      <div className="three-columns-layout">
        {/* Левая колонка */}
        <div className="column left-column">
          <AttributeBlock
            attributes={attributes}
            onAttributeClick={handleAttributeClick}
            onAttributeChange={handleAttributeChange}
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
        </div>

        {/* Центральная колонка */}
        <div className="column center-column">
          <RoleBlock
            roles={roles}
            onRoleClick={handleRoleClick}
            onRoleChange={handleRoleChange}
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

          <ResourcesBlock
            resources={resources}
            onResourceClick={handleResourceClick}
            onResourcesChange={handleResourcesChange}
            isCategoryAvailable={isCategoryAvailable}
            additionalDieEffect={activeEffect === 'additional_die'}
          />
        </div>

        {/* Правая колонка */}
        <div className="column right-column">
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
            effectDice={effectDice}
            rollHistory={rollHistory}
            onResultDiceClick={handleResultDiceClick}
            onBoostResultSelection={handleBoostResultSelection}
            canSelectDice={canSelectDice}
            maxSelectedDice={maxSelectedDice}
            activeEffect={activeEffect}
          />

          <PlotTokens
            tokens={plotTokens}
            onAddToken={handleAddToken}
            onSpendToken={handleSpendToken}
            onActivateAdditionalDie={handleActivateAdditionalDie}
            onActivateBoostResult={handleActivateBoostResult}
            onActivateBoostEffect={handleActivateBoostEffect}
            onCancelEffect={handleCancelEffect}
            activeEffect={activeEffect}
            hasRollResults={rollResults.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;