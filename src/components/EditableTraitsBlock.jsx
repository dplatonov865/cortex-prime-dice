import React, { useState } from 'react';
import DiceIcon from './DiceIcon';
import { getNextRank, getPreviousRank, getNextComplicationRank, getPreviousComplicationRank } from '../utils/diceLogic';

const EditableTraitsBlock = ({
    type,
    title,
    traits,
    onTraitClick,
    onTraitChange,
    getUsageCount,
    isUsageLimitReached,
    additionalDieEffect = false,
    maxItems = 10,
    hint
}) => {
    const [newTraitName, setNewTraitName] = useState('');

    // Обработчик изменения ранга (кнопки ▲▼)
    const handleRankChange = (traitId, currentRank, direction) => {
        let newRank;

        if (type === 'complications') {
            // Для осложнений используем специальные функции с поддержкой '0'
            newRank = direction === 'increase'
                ? getNextComplicationRank(currentRank)
                : getPreviousComplicationRank(currentRank);
        } else {
            // Для специальностей и ресурсов используем обычные функции
            newRank = direction === 'increase'
                ? getNextRank(currentRank)
                : getPreviousRank(currentRank);
        }

        if (newRank !== currentRank) {
            onTraitChange(type, 'update', traitId, { diceType: newRank });
        }
    };

    // Обработчик клика по трейту (добавление в пул)
    const handleTraitClick = (traitId, traitName, diceType) => {
        if (isUsageLimitReached && isUsageLimitReached(type, traitName) && !additionalDieEffect) {
            return;
        }
        onTraitClick(traitId, traitName, diceType, type);
    };

    // Обработчик добавления нового трейта
    const handleAddTrait = () => {
        if (newTraitName.trim() && Object.keys(traits).length < maxItems) {
            // Определяем начальный diceType в зависимости от типа
            let initialDiceType = 'd6';
            if (type === 'complications') {
                initialDiceType = '0';
            }

            onTraitChange(type, 'add', null, {
                name: newTraitName.trim(),
                diceType: initialDiceType
            });
            setNewTraitName('');
        }
    };

    // Обработчик удаления трейта
    const handleRemoveTrait = (traitId) => {
        onTraitChange(type, 'remove', traitId);
    };

    // Обработчик изменения названия трейта
    const handleNameChange = (traitId, newName) => {
        onTraitChange(type, 'update', traitId, { name: newName });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTrait();
        }
    };

    const canAddNew = Object.keys(traits).length < maxItems;

    return (
        <div className={`block editable-traits-block ${additionalDieEffect ? 'bonus-mode' : ''}`}>
            <h3>{title}</h3>

            {/* Поле для добавления нового трейта */}
            <div className="editable-input-container">
                <input
                    type="text"
                    className="trait-input"
                    value={newTraitName}
                    onChange={(e) => setNewTraitName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Добавить ${title.toLowerCase()}...`}
                    disabled={!canAddNew}
                    maxLength={30}
                />
                <button
                    className="add-trait-button"
                    onClick={handleAddTrait}
                    disabled={!newTraitName.trim() || !canAddNew}
                    title={!canAddNew ? `Достигнут лимит в ${maxItems} ${title.toLowerCase()}` : `Добавить ${title.toLowerCase()}`}
                >
                    +
                </button>
            </div>

            {/* Список трейтов */}
            <div className="editable-traits-list">
                {Object.entries(traits).map(([id, trait]) => {
                    const usageCount = getUsageCount ? getUsageCount(type, trait.name) : 0;
                    const isLimitReached = isUsageLimitReached && isUsageLimitReached(type, trait.name);
                    const isClickable = !isLimitReached || additionalDieEffect;

                    // Определяем, заблокированы ли кнопки рангов
                    const isMaxRank = type === 'complications'
                        ? trait.diceType === 'd12'
                        : trait.diceType === 'd12';

                    const isMinRank = type === 'complications'
                        ? trait.diceType === '0'
                        : trait.diceType === 'd4';

                    return (
                        <div key={id} className={`editable-trait-row ${!isClickable ? 'row-disabled' : ''}`}>
                            <input
                                type="text"
                                className="trait-name-input"
                                value={trait.name}
                                onChange={(e) => handleNameChange(id, e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') e.target.blur();
                                }}
                                placeholder={`Название ${title.toLowerCase()}...`}
                                maxLength={30}
                            />

                            <div className="editable-trait-controls">
                                <div className="trait-usage">
                                    {usageCount > 0 && (
                                        <span className="usage-counter"> X{usageCount}</span>
                                    )}
                                </div>

                                <div
                                    className={`trait-dice ${!isClickable ? 'dice-disabled' : ''}`}
                                    onClick={() => handleTraitClick(id, trait.name, trait.diceType)}
                                    title={
                                        !isClickable
                                            ? 'Достигнут лимит в 3 использования'
                                            : additionalDieEffect
                                                ? 'Эффект дополнительного куба: можно добавить в пул'
                                                : `Клик чтобы добавить ${trait.diceType} в пул (использовано: ${usageCount}/3)`
                                    }
                                >
                                    <DiceIcon
                                        type={trait.diceType}
                                        value={trait.diceType === '0' ? '0' : trait.diceType.replace('d', '')}
                                        clickable={isClickable}
                                    />
                                </div>

                                {/* Кнопки управления рангом для ВСЕХ типов */}
                                <div className="rank-buttons-vertical">
                                    <button
                                        className="rank-button increase-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRankChange(id, trait.diceType, 'increase');
                                        }}
                                        disabled={isMaxRank}
                                        title="Повысить ранг"
                                    >
                                        ▲
                                    </button>

                                    <button
                                        className="rank-button decrease-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRankChange(id, trait.diceType, 'decrease');
                                        }}
                                        disabled={isMinRank}
                                        title="Понизить ранг"
                                    >
                                        ▼
                                    </button>
                                </div>

                                <button
                                    className="remove-trait-button"
                                    onClick={() => handleRemoveTrait(id)}
                                    title={`Удалить ${title.toLowerCase()}`}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    );
                })}

                {Object.keys(traits).length === 0 && (
                    <div className="no-traits-message">
                        Нет добавленных {title.toLowerCase()}
                    </div>
                )}
            </div>

            {/* Счетчик и подсказка */}
            <div className="traits-counter">
                {Object.keys(traits).length}/{maxItems} {title.toLowerCase()}
            </div>

            {hint && (
                <div className="trait-hint">
                    {hint}
                </div>
            )}
        </div>
    );
};

export default EditableTraitsBlock;