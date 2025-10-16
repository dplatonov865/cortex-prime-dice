import React, { useState } from 'react';
import DiceIcon from './DiceIcon';

const ResourcesBlock = ({ resources, onResourceClick, onResourcesChange, getUsageCount, isUsageLimitReached, additionalDieEffect = false }) => {
    const [newResource, setNewResource] = useState('');

    const handleResourceClick = (resourceName, diceType) => {
        if (isUsageLimitReached && isUsageLimitReached('resource', resourceName) && !additionalDieEffect) {
            return;
        }
        onResourceClick(resourceName, diceType);
    };

    const handleAddResource = () => {
        if (newResource.trim() && Object.keys(resources).length < 10) {
            onResourcesChange('add', null, newResource.trim());
            setNewResource('');
        }
    };

    const handleRemoveResource = (id) => {
        onResourcesChange('remove', id);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddResource();
        }
    };

    const handleEditResource = (id, newName) => {
        onResourcesChange('edit', id, newName);
    };

    const canAddNew = Object.keys(resources).length < 10;

    return (
        <div className={`block resources-block ${additionalDieEffect ? 'bonus-mode' : ''}`}>
            <h3>Ресурсы</h3>

            <div className="resources-input-container">
                <input
                    type="text"
                    className="resource-input"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Добавить ресурс..."
                    disabled={!canAddNew}
                    maxLength={30}
                />
                <button
                    className="add-resource-button"
                    onClick={handleAddResource}
                    disabled={!newResource.trim() || !canAddNew}
                    title={!canAddNew ? 'Достигнут лимит в 10 ресурсов' : 'Добавить ресурс'}
                >
                    +
                </button>
            </div>

            <div className="resources-list">
                {Object.entries(resources).map(([id, resource]) => {
                    const usageCount = getUsageCount ? getUsageCount('resource', resource.name) : 0;
                    const isLimitReached = isUsageLimitReached && isUsageLimitReached('resource', resource.name);
                    const isClickable = !isLimitReached || additionalDieEffect;

                    return (
                        <div key={id} className={`resource-row ${!isClickable ? 'row-disabled' : ''}`}>
                            <input
                                type="text"
                                className="resource-name-input"
                                value={resource.name}
                                onChange={(e) => handleEditResource(id, e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') e.target.blur();
                                }}
                                placeholder="Название ресурса..."
                                maxLength={30}
                            />

                            <div className="resource-controls">
                                <div className="resource-usage">
                                    {usageCount > 0 && (
                                        <span className="usage-counter"> X{usageCount}</span>
                                    )}
                                </div>

                                <div
                                    className={`resource-dice ${!isClickable ? 'dice-disabled' : ''}`}
                                    onClick={() => handleResourceClick(resource.name, 'd6')}
                                    title={
                                        !isClickable
                                            ? 'Достигнут лимит в 3 использования'
                                            : additionalDieEffect
                                                ? 'Эффект дополнительного куба: можно добавить в пул'
                                                : `Клик чтобы добавить d6 в пул (использовано: ${usageCount}/3)`
                                    }
                                >
                                    <DiceIcon
                                        type="d6"
                                        value="6"
                                        clickable={isClickable}
                                    />
                                </div>

                                <button
                                    className="remove-resource-button"
                                    onClick={() => handleRemoveResource(id)}
                                    title="Удалить ресурс"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    );
                })}

                {Object.keys(resources).length === 0 && (
                    <div className="no-resources-message">
                        Нет добавленных ресурсов
                    </div>
                )}
            </div>

            <div className="resources-counter">
                {Object.keys(resources).length}/10 ресурсов
            </div>

            <div className="resources-hint">
                {additionalDieEffect
                    ? '🎯 Эффект дополнительного куба: можно добавить любой ресурс'
                    : '💡 Кликайте по кубам чтобы добавить их в пул. Можно добавлять до 10 ресурсов.'
                }
            </div>
        </div>
    );
};

export default ResourcesBlock;