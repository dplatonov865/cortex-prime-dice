import React, { useState } from 'react';
import CharacterHeader from './CharacterHeader';
import FixedTraitsBlock from './FixedTraitsBlock';
import EditableTraitsBlock from './EditableTraitsBlock';
import DistinctionBlock from './DistinctionBlock';
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
  TRAIT_TYPES
} from '../constants/characterData';

const CharacterSheet = () => {
  // Информация о персонаже
  const [characterInfo, setCharacterInfo] = useLocalStorage('characterInfo', DEFAULT_CHARACTER_INFO);

  // Состояния характеристик в ЕДИНОМ ФОРМАТЕ
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
    usageCounters,
    usedDistinctionGroups,
    additionalDieEffect,
    usedCategories, // ← ДОБАВИТЬ
    unlockedCategories, // ← НОВОЕ
    removeFromUsedCategories, // ← ДОБАВИТЬ (нужно будет добавить в useDicePool)
    addToDicePool,
    removeFromDicePool,
    clearDicePool,
    clearUsageCounters,
    getUsageCount,
    isUsageLimitReached,
    activateAdditionalDie,
    deactivateAdditionalDie,
    unlockCategory, // ← НОВАЯ ФУНКЦИЯ
    addQuickDie
  } = useDicePool();

  const {
    rollResults,
    selectedDice,
    result,
    effectDice,
    // rollHistory,
    rerollMode,
    rollDicePool,
    handleResultDiceClick,
    activateRerollMode,
    rerollDice,
    cancelRerollMode,
    canSelectDice,
    maxSelectedDice,
    setResult,
    setSelectedDice,
    setEffectDice
  } = useDiceRoll();

  // УНИВЕРСАЛЬНЫЕ ОБРАБОТЧИКИ

  // Обработчик изменения информации о персонаже
  const handleCharacterInfoChange = (field, value) => {
    setCharacterInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Универсальный обработчик клика по трейту
  const handleTraitClick = (traitId, traitName, diceType, category) => {
    if (isUsageLimitReached && isUsageLimitReached(category, traitName) && !additionalDieEffect) {
      return;
    }

    if (activeEffect === 'additional_die') {
      addToDicePool(traitId, traitName, diceType, category);
      deactivateEffect();
    } else {
      addToDicePool(traitId, traitName, diceType, category);
    }
  };

  // Универсальный обработчик изменения трейта (для FixedTraitsBlock и DistinctionBlock)
  const handleTraitChange = (type, traitId, updates) => {
    const setters = {
      [TRAIT_TYPES.ATTRIBUTES]: setAttributes,
      [TRAIT_TYPES.ROLES]: setRoles,
      [TRAIT_TYPES.DISTINCTIONS]: setDistinctions
    };

    const setter = setters[type];
    if (setter) {
      setter(prev => ({
        ...prev,
        [traitId]: { ...prev[traitId], ...updates }
      }));
    }
  };

  // Универсальный обработчик для EditableTraitsBlock
  const handleEditableTraitChange = (type, action, traitId, updates = {}) => {
    const setters = {
      [TRAIT_TYPES.COMPLICATIONS]: setComplications,
      [TRAIT_TYPES.SPECIALTIES]: setSpecialties,
      [TRAIT_TYPES.RESOURCES]: setResources
    };

    const setter = setters[type];
    if (!setter) return;

    if (action === 'add') {
      const newId = Date.now().toString();
      setter(prev => ({
        ...prev,
        [newId]: {
          name: updates.name || '',
          diceType: updates.diceType || (type === 'complications' ? '0' : 'd6')
        }
      }));
    } else if (action === 'remove') {
      setter(prev => {
        const newTraits = { ...prev };
        delete newTraits[traitId];
        return newTraits;
      });
    } else if (action === 'update') {
      setter(prev => ({
        ...prev,
        [traitId]: { ...prev[traitId], ...updates }
      }));
    }
  };

  // Функции управления эффектами
  const deactivateEffect = () => {
    setActiveEffect(null);
    deactivateAdditionalDie();
  };

  const handleActivateAdditionalDie = () => {
    if (plotTokens > 0) {
      setActiveEffect('additional_die');
      activateAdditionalDie();
    }
  };

  const handleActivateBoostResult = () => {
    if (plotTokens > 0) {
      setActiveEffect('boost_result');
    }
  };
  const handleActivateReroll = () => {
    if (plotTokens > 0) {
      activateRerollMode();
    }
  };
  const handleUnlockDistinctions = () => {
    if (plotTokens > 0) {
      unlockCategory('distinctions');
    }
  };

  const handleActivateBoostEffect = () => {
    if (plotTokens > 0 && rollResults.length > 0) {
      const availableForEffect = rollResults.filter(dice =>
        !dice.isOne &&
        dice.rolledValue !== 0 &&
        !selectedDice.includes(dice.id) &&
        !effectDice.some(effect => effect.id === dice.id)
      );

      if (availableForEffect.length > 0) {
        const bestEffectDie = availableForEffect.reduce((max, dice) => {
          const diceValue = parseInt(dice.type.replace('d', ''));
          const maxValue = parseInt(max.type.replace('d', ''));
          return diceValue > maxValue ? dice : max;
        }, availableForEffect[0]);

        const newEffectDie = {
          id: bestEffectDie.id,
          type: bestEffectDie.type,
          name: bestEffectDie.name
        };

        const newEffectDice = [...effectDice, newEffectDie];
        setEffectDice(newEffectDice);
      } else {
        alert('Нет доступных кубов для повышения эффекта!');
      }
    }
  };

  const handleCancelEffect = () => {
    if (activeEffect) {
      setPlotTokens(prev => prev + 1);
      deactivateEffect();
    }
  };

  const handleAddToken = () => {
    setPlotTokens(prev => prev + 1);
  };
  const handleRemoveToken = () => {
    setPlotTokens(prev => Math.max(0, prev - 1));
  };

  const handleSpendToken = () => {
    setPlotTokens(prev => Math.max(0, prev - 1));
  };

  // Обработчик броска
  const handleRollDice = () => {
    rollDicePool(dicePool, clearDicePool, clearUsageCounters);
  };

  const handleBoostResultSelection = (diceId) => {
    if (activeEffect === 'boost_result') {
      // Находим куб
      const dice = rollResults.find(d => d.id === diceId);
      if (dice && !dice.isOne && dice.rolledValue !== 0 && !selectedDice.includes(diceId)) {
        // Добавляем в выбранные (можно сверх лимита)
        const newSelectedDice = [...selectedDice, diceId];
        setSelectedDice(newSelectedDice);

        // Пересчитываем результат
        const newResult = newSelectedDice.reduce((total, id) => {
          const selectedDice = rollResults.find(d => d.id === id);
          return total + (selectedDice ? selectedDice.rolledValue : 0);
        }, 0);
        setResult(newResult);

        // Пересчитываем куб эффекта
        calculateEffectDie(rollResults, newSelectedDice, setEffectDice);

        // Завершаем эффект и тратим жетон
        deactivateEffect();
        handleSpendToken();

        console.log(`Куб "${dice.name}" добавлен в результат! Новый результат: ${newResult}`);
      }
    }
  };
  // Функции экспорта/импорта
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
      version: '2.0'
    };
    exportCharacter(characterData);
  };

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

    // Очищаем localStorage
    const keys = [
      'characterInfo', 'attributes', 'roles', 'complications',
      'distinctions', 'specialties', 'resources', 'plotTokens'
    ];
    keys.forEach(key => localStorage.removeItem(key));
  };

  const handleAddQuickDie = (diceType) => {
    addQuickDie(diceType);
  };

  const handleActivateAttributes = () => {
    removeFromUsedCategories('attributes');
  };

  const handleActivateRoles = () => {
    removeFromUsedCategories('roles');
  };

  const handleActivateDistinctions = () => {
    removeFromUsedCategories('distinctions');
  };

  const checkMinimumRequirements = () => {
    const hasAttribute = dicePool.some(dice => dice.category === 'attributes');
    const hasRole = dicePool.some(dice => dice.category === 'roles');
    // const hasDistinction = dicePool.some(dice => dice.category === 'distinctions');

    return hasAttribute && hasRole;
  };

  const canRoll = checkMinimumRequirements();


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
          onTraitClick={handleTraitClick}
          onDistinctionChange={(distinctionId, updates) =>
            handleTraitChange('distinctions', distinctionId, updates)}
          getUsageCount={getUsageCount}
          isUsageLimitReached={isUsageLimitReached}
          usedDistinctionGroups={usedDistinctionGroups}
          usedCategories={usedCategories}
          unlockedCategories={unlockedCategories} // ← НОВОЕ
          additionalDieEffect={activeEffect === 'additional_die'}
        />
      </div>

      {/* Три колонки */}
      <div className="three-columns-layout">
        {/* Левая колонка */}
        <div className="column left-column">
          <FixedTraitsBlock
            type={TRAIT_TYPES.ATTRIBUTES}
            title="Атрибуты"
            traits={attributes}
            onTraitClick={handleTraitClick}
            onTraitChange={handleTraitChange}
            getUsageCount={getUsageCount}
            isUsageLimitReached={isUsageLimitReached}
            additionalDieEffect={activeEffect === 'additional_die'}
            hint={activeEffect === 'additional_die'
              ? '🎯 Эффект дополнительного куба: можно добавить любой атрибут'
              : '💡 Кликайте по атрибутам чтобы добавить кубы в пул'
            }
          />

          <EditableTraitsBlock
            type={TRAIT_TYPES.COMPLICATIONS}
            title="Стресс"
            traits={complications}
            onTraitClick={handleTraitClick}
            onTraitChange={handleEditableTraitChange}
            getUsageCount={getUsageCount}
            isUsageLimitReached={isUsageLimitReached}
          // maxItems={10}
          // hint="💡 В пул можно добавлять осложнения ранга d4"
          />
        </div>

        {/* Центральная колонка */}
        <div className="column center-column">
          <DicePoolBlock
            dicePool={dicePool}
            onRemoveFromPool={removeFromDicePool}
            onRollDice={handleRollDice}
            onClearPool={clearDicePool}
            onAddQuickDie={handleAddQuickDie}
            canRoll={canRoll}
          />

          <ResultsBlock
            rollResults={rollResults}
            selectedDice={selectedDice}
            result={result}
            effectDice={effectDice}
            // rollHistory={rollHistory}
            onResultDiceClick={handleResultDiceClick}
            onBoostResultSelection={handleBoostResultSelection}
            onRerollDice={rerollDice} // ← НОВОЕ
            canSelectDice={canSelectDice}
            maxSelectedDice={maxSelectedDice}
            activeEffect={activeEffect}
            rerollMode={rerollMode} // ← НОВОЕ
          />

          <PlotTokens
            tokens={plotTokens}
            onAddToken={handleAddToken}
            onRemoveToken={handleRemoveToken} // ← ДОБАВИТЬ ЭТОТ ПРОПС
            onSpendToken={handleSpendToken}
            onActivateAdditionalDie={handleActivateAdditionalDie}
            onActivateBoostResult={handleActivateBoostResult}
            onActivateBoostEffect={handleActivateBoostEffect}
            onCancelEffect={handleCancelEffect}
            onActivateAttributes={handleActivateAttributes} // ← ДОБАВИТЬ
            onActivateRoles={handleActivateRoles} // ← ДОБАВИТЬ
            onActivateDistinctions={handleActivateDistinctions} // ← ДОБАВИТЬ
            activeEffect={activeEffect}
            hasRollResults={rollResults.length > 0}
            usedCategories={usedCategories} // ← ДОБАВИТЬ (из useDicePool)
            onActivateReroll={handleActivateReroll} // ← НОВОЕ
            onUnlockDistinctions={handleUnlockDistinctions} // ← НОВОЕ
            unlockedCategories={unlockedCategories} // ← НОВОЕ
          />
        </div>

        {/* Правая колонка */}
        <div className="column right-column">
          <FixedTraitsBlock
            type={TRAIT_TYPES.ROLES}
            title="Навыки"
            traits={roles}
            onTraitClick={handleTraitClick}
            onTraitChange={handleTraitChange}
            getUsageCount={getUsageCount}
            isUsageLimitReached={isUsageLimitReached}
            additionalDieEffect={activeEffect === 'additional_die'}
            hint={activeEffect === 'additional_die'
              ? '🎯 Эффект дополнительного куба: можно добавить любой навык'
              : '💡 Кликайте по навыкам чтобы добавить кубы в пул'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;