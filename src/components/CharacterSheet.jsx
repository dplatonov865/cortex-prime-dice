import React, { useState } from 'react';
import AttributeBlock from './AttributeBlock';
import DiceIcon from './DiceIcon';

const CharacterSheet = () => {
  const [attributes, setAttributes] = useState({
    'Атлетизм': 'd4',
    'Координация': 'd6',
    'Хитрость': 'd8',
    'Эрудиция': 'd10',
    'Чутьё': 'd12',
    'Вера': 'd6'
  });

  const [dicePool, setDicePool] = useState([]);
  const [rollResults, setRollResults] = useState([]);
  const [selectedDice, setSelectedDice] = useState([]);
  const [result, setResult] = useState(0);
  const [effectDie, setEffectDie] = useState('d4');
  const [rollHistory, setRollHistory] = useState([]);

  // Добавление куба в пул (клик по атрибуту)
  const addToDicePool = (attributeName, diceType) => {
    const newDice = {
      id: Date.now() + Math.random(),
      attribute: attributeName,
      type: diceType,
      value: parseInt(diceType.replace('d', ''))
    };
    
    setDicePool(prev => [...prev, newDice]);
  };

  // Удаление куба из пула (клик по кубу в пуле)
  const removeFromDicePool = (diceId) => {
    setDicePool(prev => prev.filter(dice => dice.id !== diceId));
  };

  // Бросок всех кубов в пуле
  const rollDicePool = () => {
    if (dicePool.length === 0) return;

    const results = dicePool.map(dice => {
      const diceValue = parseInt(dice.type.replace('d', ''));
      const rolledValue = Math.floor(Math.random() * diceValue) + 1;
      
      return {
        ...dice,
        id: Date.now() + Math.random(),
        rolledValue: rolledValue,
        isOne: rolledValue === 1,
        isSelected: false, // Изначально все не выбраны
        timestamp: new Date().toLocaleTimeString()
      };
    });

    // Сбрасываем выбранные кубы и результаты
    setRollResults(results);
    setSelectedDice([]);
    setResult(0);
    setEffectDie('d4');
    
    // Автоматически вычисляем эффект после броска
    calculateEffectDie(results, []);

    // Добавляем в историю
    setRollHistory(prev => [
      {
        id: Date.now(),
        results: results,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 4) // Храним последние 5 бросков
    ]);

    // Очищаем пул
    setDicePool([]);
  };

  // Обработчик кликов по результатам броска
  const handleResultDiceClick = (diceId) => {
    const dice = rollResults.find(d => d.id === diceId);
    if (!dice || dice.isOne) return; // Нельзя выбирать кубы с 1

    if (selectedDice.includes(diceId)) {
      // Удаляем из выбранных
      const newSelected = selectedDice.filter(id => id !== diceId);
      setSelectedDice(newSelected);
      updateResultAndEffect(newSelected);
    } else {
      // Добавляем в выбранные
      const newSelected = [...selectedDice, diceId];
      setSelectedDice(newSelected);
      updateResultAndEffect(newSelected);
    }
  };

  // Обновление результата и куба эффекта
  const updateResultAndEffect = (selectedIds) => {
    // Вычисляем сумму выбранных кубов
    const sum = selectedIds.reduce((total, diceId) => {
      const dice = rollResults.find(d => d.id === diceId);
      return total + (dice ? dice.rolledValue : 0);
    }, 0);
    
    setResult(sum);
    
    // Вычисляем куб эффекта
    calculateEffectDie(rollResults, selectedIds);
  };

  // Вычисление куба эффекта
  const calculateEffectDie = (results, selectedIds) => {
    // Доступные кубы: не выбранные и не единицы
    const availableDice = results.filter(dice => 
      !selectedIds.includes(dice.id) && !dice.isOne
    );

    if (availableDice.length === 0) {
      setEffectDie('d4');
      return;
    }

    // Находим куб с наибольшим номиналом
    const maxDie = availableDice.reduce((max, dice) => {
      const diceValue = parseInt(dice.type.replace('d', ''));
      const maxValue = parseInt(max.type.replace('d', ''));
      return diceValue > maxValue ? dice : max;
    }, availableDice[0]);

    setEffectDie(maxDie.type);
  };

  // Обработчик кликов по атрибутам
  const handleAttributeClick = (attributeName, diceType) => {
    addToDicePool(attributeName, diceType);
  };

  // Очистка пула
  const clearDicePool = () => {
    setDicePool([]);
  };

  return (
    <div className="character-sheet">
      <div className="main-columns">
        <AttributeBlock 
          attributes={attributes} 
          onAttributeClick={handleAttributeClick}
        />
        
        <div className="block empty-block">
          <h3>Блок 2</h3>
          <p>Здесь будет дополнительная информация</p>
        </div>
        
        <div className="block empty-block">
          <h3>Блок 3</h3>
          <p>Здесь будет дополнительная информация</p>
        </div>
        
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
      <div className="horizontal-block dice-pool-block">
        <div className="block-header">
          <h3>Текущий пул кубов</h3>
          <div className="pool-controls">
            <button 
              onClick={rollDicePool} 
              className="roll-button"
              disabled={dicePool.length === 0}
            >
              Бросок ({dicePool.length})
            </button>
            <button 
              onClick={clearDicePool} 
              className="clear-button"
              disabled={dicePool.length === 0}
            >
              Очистить
            </button>
          </div>
        </div>
        
        <div className="dice-pool">
          {dicePool.length === 0 ? (
            <p className="empty-pool-message">Кликайте по атрибутам чтобы добавить кубы в пул</p>
          ) : (
            <div className="dice-pool-list">
              {dicePool.map(dice => (
                <div 
                  key={dice.id} 
                  className="pool-dice-item"
                  onClick={() => removeFromDicePool(dice.id)}
                  title={`Клик чтобы удалить\n${dice.attribute}: ${dice.type}`}
                >
                  <DiceIcon 
                    type={dice.type} 
                    value={dice.value}
                    clickable={false}
                  />
                  <span className="dice-attribute">{dice.attribute}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Блок 7: Результаты броска */}
      <div className="bottom-block results-block">
        <h3>Результаты броска</h3>
        
        {rollResults.length === 0 ? (
          <p className="no-results-message">Здесь будут отображаться результаты бросков</p>
        ) : (
          <div className="current-results">
            {/* Строки с результатом и кубом эффекта */}
            <div className="result-stats">
              <div className="result-stat">
                <strong>Результат:</strong>
                <span className="result-value">{result}</span>
              </div>
              <div className="result-stat">
                <strong>Куб эффекта:</strong>
                <DiceIcon 
                  type={effectDie} 
                  value={effectDie.replace('d', '')}
                  clickable={false}
                />
              </div>
            </div>

            {/* Выпавшие кубы */}
            <div className="results-section">
              <h4>Выпавшие значения:</h4>
              <div className="results-dice">
                {rollResults.map(dice => {
                  const isSelected = selectedDice.includes(dice.id);
                  const isInactive = dice.isOne;
                  
                  return (
                    <div 
                      key={dice.id} 
                      className={`result-dice-item ${isSelected ? 'selected' : ''} ${isInactive ? 'inactive' : ''}`}
                      onClick={() => handleResultDiceClick(dice.id)}
                      title={
                        isInactive 
                          ? 'Выпала 1 - нельзя выбрать' 
                          : `Клик для ${isSelected ? 'исключения из' : 'добавления в'} результат`
                      }
                    >
                      <DiceIcon 
                        type={dice.type} 
                        value={dice.rolledValue}
                        clickable={!isInactive}
                      />
                      <div className="dice-info">
                        <div className="dice-attribute">{dice.attribute}</div>
                        <div className="dice-roll">{dice.rolledValue}</div>
                        {isSelected && <div className="selected-indicator">✓ В результате</div>}
                        {isInactive && <div className="inactive-indicator">✗ Неактивен</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Подсказка */}
            <div className="results-hint">
              💡 Кликайте по кубам чтобы добавить/убрать их из результата
            </div>
          </div>
        )}
        
        {/* История бросков */}
        {rollHistory.length > 0 && (
          <div className="roll-history-section">
            <h4>История бросков</h4>
            <div className="history-list">
              {rollHistory.map(roll => (
                <div key={roll.id} className="history-item">
                  <span className="history-time">{roll.timestamp}</span>
                  <div className="history-dice">
                    {roll.results.map((dice, index) => (
                      <DiceIcon 
                        key={index}
                        type={dice.type} 
                        value={dice.rolledValue}
                        clickable={false}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSheet;