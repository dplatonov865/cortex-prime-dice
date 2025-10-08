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
  const [rollHistory, setRollHistory] = useState([]);

  // Добавление куба в пул (левый клик)
  const addToDicePool = (attributeName, diceType) => {
    const newDice = {
      id: Date.now() + Math.random(),
      attribute: attributeName,
      type: diceType,
      value: parseInt(diceType.replace('d', ''))
    };
    
    setDicePool(prev => [...prev, newDice]);
  };

  // Удаление куба из пула (правый клик)
  const removeFromDicePool = (diceId, event) => {
    event.preventDefault(); // Предотвращаем контекстное меню
    setDicePool(prev => prev.filter(dice => dice.id !== diceId));
  };

  // Бросок всех кубов в пуле
  const rollDicePool = () => {
    if (dicePool.length === 0) return;

    const results = dicePool.map(dice => {
      const diceValue = parseInt(dice.type.replace('d', ''));
      const result = Math.floor(Math.random() * diceValue) + 1;
      
      return {
        ...dice,
        id: Date.now() + Math.random(), // Новый ID для результата
        rolledValue: result,
        timestamp: new Date().toLocaleTimeString()
      };
    });

    // Сохраняем результаты
    setRollResults(results);
    
    // Добавляем в историю
    setRollHistory(prev => [
      {
        id: Date.now(),
        results: results,
        total: results.reduce((sum, dice) => sum + dice.rolledValue, 0),
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 9) // Храним последние 10 бросков
    ]);

    // Очищаем пул
    setDicePool([]);
  };

  // Обработчик кликов по атрибутам
  const handleAttributeClick = (attributeName, diceType, event) => {
    if (event.button === 0) { // Левый клик
      addToDicePool(attributeName, diceType);
    } else if (event.button === 2) { // Правый клик
      // Удаляем последний куб этого атрибута из пула
      const diceToRemove = dicePool
        .filter(dice => dice.attribute === attributeName)
        .pop();
      
      if (diceToRemove) {
        removeFromDicePool(diceToRemove.id, event);
      }
    }
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
            <p className="empty-pool-message">Кликайте левой кнопкой по атрибутам чтобы добавить кубы в пул</p>
          ) : (
            <div className="dice-pool-list">
              {dicePool.map(dice => (
                <div 
                  key={dice.id} 
                  className="pool-dice-item"
                  onContextMenu={(e) => removeFromDicePool(dice.id, e)}
                  title={`Правый клик для удаления\n${dice.attribute}: ${dice.type}`}
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
            <div className="results-total">
              <strong>Общая сумма: </strong>
              <span className="total-value">
                {rollResults.reduce((sum, dice) => sum + dice.rolledValue, 0)}
              </span>
            </div>
            
            <div className="results-dice">
              {rollResults.map(dice => (
                <div key={dice.id} className="result-dice-item">
                  <DiceIcon 
                    type={dice.type} 
                    value={dice.rolledValue}
                    clickable={false}
                  />
                  <div className="dice-info">
                    <div className="dice-attribute">{dice.attribute}</div>
                    <div className="dice-roll">{dice.rolledValue}</div>
                  </div>
                </div>
              ))}
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
                  <span className="history-total">{roll.total}</span>
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