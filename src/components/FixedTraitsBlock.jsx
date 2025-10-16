import React from 'react';
import DiceIcon from './DiceIcon';
import { getNextRank, getPreviousRank } from '../utils/diceLogic';

const FixedTraitsBlock = ({
    type,
    title,
    traits,
    onTraitClick,
    onTraitChange,
    getUsageCount,
    isUsageLimitReached,
    additionalDieEffect = false,
    hint
}) => {

    // Обработчик изменения ранга (кнопки ▲▼)
    const handleRankChange = (traitId, currentRank, direction) => {
        const newRank = direction === 'increase'
            ? getNextRank(currentRank)
            : getPreviousRank(currentRank);

        if (newRank !== currentRank) {
            onTraitChange(type, traitId, { diceType: newRank });
        }
    };

    // Обработчик клика по трейту (добавление в пул)
    const handleTraitClick = (traitId, traitName, diceType) => {
        if (isUsageLimitReached && isUsageLimitReached(type, traitName) && !additionalDieEffect) {
            return;
        }
        onTraitClick(traitId, traitName, diceType, type);
    };

    return (
        <div className={`block fixed-traits-block ${additionalDieEffect ? 'bonus-mode' : ''}`}>
            <h3>{title}</h3>

            <div className="fixed-traits-list">
                {Object.entries(traits).map(([id, trait]) => {
                    const usageCount = getUsageCount ? getUsageCount(type, trait.name) : 0;
                    const isLimitReached = isUsageLimitReached && isUsageLimitReached(type, trait.name);
                    const isClickable = !isLimitReached || additionalDieEffect;

                    return (
                        <div
                            key={id}
                            className={`fixed-trait-row ${!isClickable ? 'row-disabled' : ''}`}
                            onClick={() => handleTraitClick(id, trait.name, trait.diceType)}
                            title={
                                !isClickable
                                    ? 'Достигнут лимит в 3 использования'
                                    : additionalDieEffect
                                        ? 'Эффект дополнительного куба: можно добавить в пул'
                                        : `Клик чтобы добавить куб в пул (использовано: ${usageCount}/3)`
                            }
                        >
                            <div className="fixed-trait-name-container">
                                <span className="trait-name">{trait.name}</span>
                                {usageCount > 0 && (
                                    <span className="usage-counter"> X{usageCount}</span>
                                )}
                            </div>

                            <div className="fixed-trait-controls">
                                <div className="trait-usage">
                                    {/* Пустой контейнер для выравнивания */}
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
                                        value={trait.diceType.replace('d', '')}
                                        clickable={isClickable}
                                    />
                                </div>

                                <div className="rank-buttons-vertical">
                                    <button
                                        className="rank-button increase-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRankChange(id, trait.diceType, 'increase');
                                        }}
                                        disabled={trait.diceType === 'd12'}
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
                                        disabled={trait.diceType === 'd4'}
                                        title="Понизить ранг"
                                    >
                                        ▼
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {hint && (
                <div className="trait-hint">
                    {hint}
                </div>
            )}
        </div>
    );
};

export default FixedTraitsBlock;