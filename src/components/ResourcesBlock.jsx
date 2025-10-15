import React, { useState } from 'react';
import DiceIcon from './DiceIcon';

const ResourcesBlock = ({ resources, onResourceClick, onResourcesChange, isCategoryAvailable, additionalDieEffect = false }) => {
    const [newResource, setNewResource] = useState('');

    const handleResourceClick = (resourceName, diceType) => {
        if (isCategoryAvailable && !isCategoryAvailable('resource') && !additionalDieEffect) {
            return;
        }
        onResourceClick(resourceName, diceType);
    };

    const handleAddResource = () => {
        if (newResource.trim() && Object.keys(resources).length < 10 &&
            ((isCategoryAvailable && isCategoryAvailable('resource')) || additionalDieEffect)) {
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

    const isBlockAvailable = isCategoryAvailable ? isCategoryAvailable('resource') : true;
    const finalAvailability = isBlockAvailable || additionalDieEffect;
    const canAddNew = finalAvailability && Object.keys(resources).length < 10;

    return (
        <div className={`block resources-block ${!finalAvailability ? 'category-used' : ''} ${additionalDieEffect ? 'bonus-mode' : ''}`}>
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
                    title={!canAddNew ? 'Нельзя добавить - набор уже используется или достигнут лимит' : 'Добавить ресурс'}
                >
                    +
                </button>
            </div>

            <div className="resources-list">
                {Object.entries(resources).map(([id, resource]) => (
                    <div key={id} className={`resource-row ${!finalAvailability ? 'row-disabled' : ''}`}>
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
                            disabled={!finalAvailability}
                        />

                        <div className="resource-controls">
                            <div
                                className={`resource-dice ${!finalAvailability ? 'dice-disabled' : ''}`}
                                onClick={() => handleResourceClick(resource.name, 'd6')}
                                title={
                                    !finalAvailability
                                        ? 'Уже используется ресурс из этого набора'
                                        : additionalDieEffect
                                            ? 'Эффект дополнительного куба: можно добавить в пул'
                                            : 'Клик чтобы добавить d6 в пул'
                                }
                            >
                                <DiceIcon
                                    type="d6"
                                    value="6"
                                    clickable={finalAvailability}
                                />
                            </div>

                            <button
                                className="remove-resource-button"
                                onClick={() => handleRemoveResource(id)}
                                title="Удалить ресурс"
                                disabled={!finalAvailability}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}

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
                    : !isBlockAvailable
                        ? '⚡ Ресурс уже используется в пуле'
                        : '💡 Кликайте по кубам чтобы добавить их в пул. Можно добавлять до 10 ресурсов.'
                }
            </div>
        </div>
    );
};

export default ResourcesBlock;