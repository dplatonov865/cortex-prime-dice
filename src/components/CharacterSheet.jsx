import React, { useState } from 'react';
import AttributeBlock from '../components/AttributeBlock';
import RoleBlock from '../components/RoleBlock';
import ComplicationBlock from '../components/ComplicationBlock';
import DicePoolBlock from '../components/DicePoolBlock';
import ResultsBlock from '../components/ResultsBlock';
import { useDicePool } from '../hooks/useDicePool';
import { useDiceRoll } from '../hooks/useDiceRoll';

const CharacterSheet = () => {
  // Состояния характеристик
  const [attributes, setAttributes] = useState({
    'Атлетизм': 'd6',
    'Координация': 'd6',
    'Хитрость': 'd6',
    'Эрудиция': 'd6',
    'Чутьё': 'd6',
    'Вера': 'd6'
  });

  const [roles, setRoles] = useState({
    'Солдат': 'd6',
    'Дипломат': 'd6',
    'Эксперт': 'd6',
    'Мастер': 'd6',
    'Преступник': 'd6'
  });

  const [complications, setComplications] = useState({
    'Ослабление': '0',
    'Раскоординированность': '0',
    'Подозрительность': '0',
    'Забывчивость': '0',
    'Рассеянность': '0',
    'Неуверенность': '0'
  });

  // Хуки для управления логикой
  const { dicePool, addToDicePool, removeFromDicePool, clearDicePool, setDicePool } = useDicePool();
  const { 
    rollResults, 
    selectedDice, 
    result, 
    effectDie, 
    rollHistory, 
    rollDicePool, 
    handleResultDiceClick 
  } = useDiceRoll();

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

  // Обработчики изменения рангов
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

  // Обработчик броска
  const handleRollDice = () => {
    rollDicePool(dicePool, setDicePool);
  };

  return (
    <div className="character-sheet">
      <div className="main-columns">
        <AttributeBlock 
          attributes={attributes} 
          onAttributeClick={handleAttributeClick}
          onAttributeChange={handleAttributeChange}
        />
        
        <RoleBlock 
          roles={roles} 
          onRoleClick={handleRoleClick}
          onRoleChange={handleRoleChange}
        />
        
        <ComplicationBlock 
          complications={complications} 
          onComplicationClick={handleComplicationClick}
          onComplicationChange={handleComplicationChange}
        />
        
        <div className="block empty-block">
          <h3>Блок 4</h3>
          <p>Здесь будет дополнительная информация</p>
        </div>
        
        <div className="block empty-block">
          <h3>Блок 5</h3>
          <p>Здесь будет дополнительная информация</p>
        </div>
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
      />
    </div>
  );
};

export default CharacterSheet;